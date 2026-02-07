import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Tabs,
  Tab,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
  Slider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  SportsSoccer as SoccerIcon,
  ArrowBack as ArrowBackIcon,
  Casino as CasinoIcon,
  EmojiEvents as TrophyIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from 'react-router-dom';
import NavbarParticipant from "../components/navbar/NavbarParticipant";
import palette from "../themes/palette";
import { ApiTossConnected } from "../service/axios";
import { getMatchOdds, placeBet, getCurrentUser } from "../service/betService";
import { useSnackbar } from "../provider/snackbarProvider";

const MatchsProno = () => {
  const navigate = useNavigate();
  const { sportId } = useParams();
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  
  // Mode "all" = tous les matchs de tous les sports
  const isAllMode = sportId === 'all' || !sportId;
  
  const [loading, setLoading] = useState(true);
  const [sport, setSport] = useState(null);
  const [sports, setSports] = useState([]);
  const [pools, setPools] = useState([]);
  const [matches, setMatches] = useState([]);
  const [selectedPool, setSelectedPool] = useState(null);
  const [selectedSport, setSelectedSport] = useState(null);
  const [showKnockout, setShowKnockout] = useState(false);
  
  // Dialog state
  const [betDialogOpen, setBetDialogOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [matchOdds, setMatchOdds] = useState(null);
  const [betData, setBetData] = useState({
    predictedWinner: '',
    predictedScoreTeamOne: '',
    predictedScoreTeamTwo: '',
    stake: 0,
  });
  const [betLoading, setBetLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, [sportId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Récupérer l'utilisateur pour son solde
      const userData = await getCurrentUser();
      setUser(userData);
      
      // Récupérer tous les sports
      const sportsResponse = await ApiTossConnected.get('/sports');
      setSports(sportsResponse.data);
      
      if (isAllMode) {
        // Mode "tous les matchs" - récupérer tous les matchs de tous les sports
        const allMatchesPromises = sportsResponse.data.map(async (s) => {
          try {
            const response = await ApiTossConnected.get(`/matches/${s.id}`);
            return response.data.map(match => ({ ...match, sportName: s.sport, sportId: s.id }));
          } catch {
            return [];
          }
        });
        
        const allMatchesArrays = await Promise.all(allMatchesPromises);
        const allMatches = allMatchesArrays.flat()
          .sort((a, b) => new Date(a.matchTime) - new Date(b.matchTime));
        setMatches(allMatches);
        
        // Sélectionner le premier sport par défaut
        if (sportsResponse.data.length > 0) {
          setSelectedSport(sportsResponse.data[0].id);
        }
      } else {
        // Mode sport spécifique
        const sportData = sportsResponse.data.find(s => s.id === parseInt(sportId));
        setSport(sportData);
        
        // Récupérer les pools
        const poolsResponse = await ApiTossConnected.get(`/pools/public/sport/${sportId}`);
        setPools(poolsResponse.data);
        
        // Récupérer tous les matchs
        const matchesResponse = await ApiTossConnected.get(`/matches/${sportId}`);
        setMatches(matchesResponse.data);
        
        // Sélectionner la première poule par défaut
        if (poolsResponse.data.length > 0) {
          setSelectedPool(poolsResponse.data[0].id);
        }
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar('Erreur lors du chargement des données', 3000, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les matchs selon la sélection
  const getFilteredMatches = () => {
    if (isAllMode) {
      // En mode "all", filtrer par sport sélectionné
      let filtered = matches;
      if (selectedSport) {
        filtered = matches.filter(m => m.sportId === selectedSport);
      }
      // Ne garder que les matchs à venir
      return filtered.filter(m => !m.hasEnded);
    }
    
    if (showKnockout) {
      return matches.filter(m => m.phase !== 'GroupStage');
    }
    if (selectedPool) {
      return matches.filter(m => {
        const teamOnePoolId = m.teamOne?.pools?.[0]?.id;
        const teamTwoPoolId = m.teamTwo?.pools?.[0]?.id;
        return m.phase === 'GroupStage' && (teamOnePoolId === selectedPool || teamTwoPoolId === selectedPool);
      });
    }
    return [];
  };

  // Vérifier si des matchs en phases finales existent
  const hasKnockoutMatches = matches.some(m => m.phase !== 'GroupStage');

  // Ouvrir le dialog de pari
  const handleOpenBetDialog = async (match) => {
    if (match.hasStarted) {
      showSnackbar('Impossible de parier sur un match déjà commencé', 3000, 'warning');
      return;
    }
    
    setSelectedMatch(match);
    setBetData({
      predictedWinner: '',
      predictedScoreTeamOne: '',
      predictedScoreTeamTwo: '',
      stake: 0,
    });
    setBetDialogOpen(true);
    
    // Récupérer les cotes
    try {
      const odds = await getMatchOdds(match.id);
      setMatchOdds(odds);
    } catch (error) {
      console.error('Error fetching odds:', error);
    }
  };

  // Placer un pari
  const handlePlaceBet = async () => {
    if (!betData.predictedWinner) {
      showSnackbar('Veuillez sélectionner un gagnant', 3000, 'warning');
      return;
    }
    
    if (betData.stake <= 0) {
      showSnackbar('Veuillez miser au moins 1 crédit', 3000, 'warning');
      return;
    }
    
    setBetLoading(true);
    try {
      const result = await placeBet({
        matchId: selectedMatch.id,
        predictedWinner: betData.predictedWinner,
        predictedScoreTeamOne: betData.predictedScoreTeamOne ? parseInt(betData.predictedScoreTeamOne) : null,
        predictedScoreTeamTwo: betData.predictedScoreTeamTwo ? parseInt(betData.predictedScoreTeamTwo) : null,
        stake: betData.stake,
      });
      
      showSnackbar(`Pari de ${betData.stake} crédits placé avec succès ! Nouveau solde: ${result.newBalance}`, 3000, 'success');
      setBetDialogOpen(false);
      // Mettre à jour le solde local
      setUser(prev => ({ ...prev, betPoints: result.newBalance }));
      
    } catch (error) {
      console.error('Error placing bet:', error);
      const message = error.response?.data?.detail || 'Erreur lors du pari';
      showSnackbar(message, 3000, 'error');
    } finally {
      setBetLoading(false);
    }
  };

  // Formater la date du match
  const formatMatchDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Label de la phase
  const getPhaseLabel = (phase) => {
    const labels = {
      'GroupStage': 'Poules',
      'Roundof64': '64èmes',
      'Roundof32': '32èmes',
      'Roundof16': '16èmes',
      'QuarterFinal': 'Quarts',
      'SemiFinal': 'Demi-finales',
      'ThirdPlace': 'Petite finale',
      'Final': 'Finale',
    };
    return labels[phase] || phase;
  };

  if (loading) {
    return (
      <>
        <NavbarParticipant />
        <Box
          sx={{
            background: `linear-gradient(135deg, ${palette.primary.dark} 0%, #1a1a2e 100%)`,
            minHeight: '100vh',
            paddingTop: '80px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress sx={{ color: palette.primary.red }} />
        </Box>
      </>
    );
  }

  const filteredMatches = getFilteredMatches();

  return (
    <>
      <NavbarParticipant />
      <Box
        sx={{
          background: `linear-gradient(135deg, ${palette.primary.dark} 0%, #1a1a2e 100%)`,
          minHeight: '100vh',
          paddingTop: '80px',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${palette.primary.red} 0%, #a01020 100%)`,
            padding: { xs: '1rem', lg: '1.5rem 3rem' },
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              right: '-50px',
              top: '-50px',
              width: '150px',
              height: '150px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '50%',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, lg: 2 } }}>
            <IconButton onClick={() => navigate('/')} sx={{ color: 'white', p: { xs: 0.5, lg: 1 } }}>
              <ArrowBackIcon sx={{ fontSize: { xs: 32, lg: 24 } }} />
            </IconButton>
            <SoccerIcon sx={{ fontSize: { xs: 48, lg: 28 }, color: 'white' }} />
            <Typography sx={{ fontWeight: 'bold', fontSize: { xs: '2.2rem', lg: '1.5rem' } }}>
              {isAllMode ? 'Tous les matchs' : (sport?.sport || 'Sport')}
            </Typography>
            {user && (
              <Box sx={{ 
                ml: 'auto',
                backgroundColor: 'rgba(255,255,255,0.15)', 
                padding: { xs: '0.6rem 1.2rem', lg: '0.4rem 0.8rem' }, 
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}>
                <SoccerIcon sx={{ color: palette.primary.red, fontSize: { xs: 28, lg: 18 } }} />
                <Typography sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', lg: '0.9rem' } }}>
                  {user.betPoints}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Tabs pour sports (mode all) ou poules (mode sport) */}
        <Box sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
          <Tabs
            value={isAllMode ? selectedSport : (showKnockout ? 'knockout' : selectedPool)}
            onChange={(e, value) => {
              if (isAllMode) {
                setSelectedSport(value);
              } else {
                if (value === 'knockout') {
                  setShowKnockout(true);
                  setSelectedPool(null);
                } else {
                  setShowKnockout(false);
                  setSelectedPool(value);
                }
              }
            }}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: { xs: '1.5rem', lg: '0.9rem' },
                color: 'rgba(255, 255, 255, 0.7)',
                minHeight: { xs: '70px', lg: '48px' },
                padding: { xs: '12px 24px', lg: '12px 16px' },
              },
              '& .Mui-selected': {
                color: 'white !important',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: palette.primary.red,
              },
            }}
          >
            {isAllMode ? (
              sports.map((s) => (
                <Tab key={s.id} label={s.sport?.toLowerCase().includes('feminin') || s.sport?.toLowerCase().includes('féminin') ? 'Féminin' : 'Masculin'} value={s.id} />
              ))
            ) : (
              <>
                {pools.map((pool) => (
                  <Tab key={pool.id} label={pool.name} value={pool.id} />
                ))}
                {hasKnockoutMatches && (
                  <Tab 
                    label={isMobile ? "Finales" : "Phases finales"}
                    value="knockout"
                    icon={<TrophyIcon sx={{ fontSize: { xs: 28, lg: 18 } }} />}
                    iconPosition="start"
                  />
                )}
              </>
            )}
          </Tabs>
        </Box>

        {/* Liste des matchs */}
        <Box sx={{ padding: { xs: '0.75rem', lg: '1.5rem' } }}>
          {filteredMatches.length === 0 ? (
            <Box sx={{ 
              padding: { xs: '1.5rem', lg: '2rem' }, 
              textAlign: 'center', 
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            }}>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Aucun match à venir
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, lg: 2 } }}>
              {filteredMatches.map((match) => (
                <Card
                  key={match.id}
                  sx={{
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    overflow: 'hidden',
                    cursor: match.hasStarted ? 'default' : 'pointer',
                    opacity: match.hasEnded ? 0.7 : 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: match.hasStarted ? 'none' : 'scale(1.01)',
                      boxShadow: match.hasStarted ? '0 4px 20px rgba(0,0,0,0.2)' : '0 8px 30px rgba(207, 20, 39, 0.3)',
                    },
                  }}
                  onClick={() => !match.hasStarted && handleOpenBetDialog(match)}
                >
                  <CardContent sx={{ padding: { xs: '0.75rem', lg: '1rem 1.5rem' } }}>
                    {/* Match Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 1, lg: 1 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isAllMode && (
                          <Typography sx={{ fontSize: { xs: '1.3rem', lg: '0.75rem' }, color: palette.primary.red, fontWeight: 'bold' }}>
                            {match.sportName}
                          </Typography>
                        )}
                        <Typography sx={{ fontSize: { xs: '1.3rem', lg: '0.75rem' }, color: 'rgba(255, 255, 255, 0.6)' }}>
                          {formatMatchDate(match.matchTime)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {match.phase !== 'GroupStage' && (
                          <Chip
                            label={isMobile ? getPhaseLabel(match.phase)?.slice(0, 6) : getPhaseLabel(match.phase)}
                            size="small"
                            sx={{ backgroundColor: '#FFD700', color: '#333', fontSize: { xs: '1.2rem', lg: '0.7rem' }, height: { xs: 40, lg: 24 } }}
                          />
                        )}
                        {match.hasEnded ? (
                          <Chip label="Terminé" size="small" sx={{ backgroundColor: '#4CAF50', color: 'white', fontSize: { xs: '1.2rem', lg: '0.7rem' }, height: { xs: 40, lg: 24 } }} />
                        ) : match.hasStarted ? (
                          <Chip label="En cours" size="small" sx={{ backgroundColor: '#FFA500', color: 'white', fontSize: { xs: '1.2rem', lg: '0.7rem' }, height: { xs: 40, lg: 24 } }} />
                        ) : (
                          <Chip 
                            label={isMobile ? "Parier" : "Parier"}
                            size="small" 
                            icon={<CasinoIcon sx={{ fontSize: { xs: 24, lg: 14 } }} />}
                            sx={{ backgroundColor: palette.primary.red, color: 'white', fontSize: { xs: '1.2rem', lg: '0.7rem' }, height: { xs: 40, lg: 24 } }} 
                          />
                        )}
                      </Box>
                    </Box>

                    {/* Teams */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {/* Team 1 */}
                      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: { xs: 1.5, lg: 1.5 } }}>
                        <Avatar
                          src={match.teamOne?.school?.pictureLink}
                          sx={{ 
                            width: { xs: 64, lg: 40 }, 
                            height: { xs: 64, lg: 40 }, 
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            fontSize: { xs: '1.6rem', lg: '1rem' },
                            color: 'white',
                          }}
                        >
                          {match.teamOne?.name?.[0]}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ 
                            fontWeight: 'bold', 
                            fontSize: { xs: '1.5rem', lg: '0.95rem' }, 
                            color: 'white',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {isMobile ? match.teamOne?.name?.split(' ')[0] : match.teamOne?.name || 'TBD'}
                          </Typography>
                          {!isMobile && (
                            <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                              {match.teamOne?.school?.name}
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      {/* Score or VS */}
                      <Box sx={{ px: { xs: 2, lg: 2 }, textAlign: 'center' }}>
                        {match.hasStarted || match.hasEnded ? (
                          <Typography sx={{ fontWeight: 'bold', fontSize: { xs: '2rem', lg: '1.2rem' }, color: 'white' }}>
                            {match.scoreTeamOne ?? '-'} - {match.scoreTeamTwo ?? '-'}
                          </Typography>
                        ) : (
                          <Typography sx={{ fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.5)', fontSize: { xs: '1.6rem', lg: '0.9rem' } }}>
                            VS
                          </Typography>
                        )}
                      </Box>

                      {/* Team 2 */}
                      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: { xs: 1.5, lg: 1.5 }, justifyContent: 'flex-end', textAlign: 'right' }}>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ 
                            fontWeight: 'bold', 
                            fontSize: { xs: '1.5rem', lg: '0.95rem' }, 
                            color: 'white',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {isMobile ? match.teamTwo?.name?.split(' ')[0] : match.teamTwo?.name || 'TBD'}
                          </Typography>
                          {!isMobile && (
                            <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                              {match.teamTwo?.school?.name}
                            </Typography>
                          )}
                        </Box>
                        <Avatar
                          src={match.teamTwo?.school?.pictureLink}
                          sx={{ 
                            width: { xs: 64, lg: 40 }, 
                            height: { xs: 64, lg: 40 }, 
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            fontSize: { xs: '1.6rem', lg: '1rem' },
                            color: 'white',
                          }}
                        >
                          {match.teamTwo?.name?.[0]}
                        </Avatar>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Dialog de pari */}
      <Dialog 
        open={betDialogOpen} 
        onClose={() => setBetDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            background: isMobile ? `linear-gradient(135deg, ${palette.primary.dark} 0%, #1a1a2e 100%)` : 'white',
            borderRadius: isMobile ? 0 : '12px',
            display: isMobile ? 'flex' : undefined,
            flexDirection: isMobile ? 'column' : undefined,
          }
        }}
      >
        <DialogTitle sx={{ 
          background: `linear-gradient(135deg, ${palette.primary.red} 0%, #a01020 100%)`, 
          color: 'white',
          padding: { xs: '0.75rem 1rem', lg: '1rem 1.5rem' },
          flexShrink: 0,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isMobile && (
                <IconButton onClick={() => setBetDialogOpen(false)} sx={{ color: 'white', mr: 0.5 }}>
                  <ArrowBackIcon sx={{ fontSize: { xs: 32, lg: 24 } }} />
                </IconButton>
              )}
              <CasinoIcon sx={{ fontSize: { xs: 40, lg: 24 } }} />
              <Typography sx={{ fontWeight: 'bold', fontSize: { xs: '1.9rem', lg: '1.1rem' } }}>
                Placer un pari
              </Typography>
            </Box>
            <Chip 
              icon={<SoccerIcon sx={{ fontSize: { xs: 28, lg: 14 }, color: `${palette.primary.red} !important` }} />}
              label={`${user?.betPoints || 0}`}
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                color: 'white', 
                fontWeight: 'bold',
                fontSize: { xs: '1.5rem', lg: '0.85rem' },
                height: { xs: 48, lg: 32 },
              }}
            />
          </Box>
        </DialogTitle>
        <DialogContent sx={{ 
          pt: { xs: 2, lg: 3 },
          px: { xs: 1.5, lg: 3 },
          backgroundColor: isMobile ? 'transparent' : 'white',
          display: isMobile ? 'flex' : undefined,
          flexDirection: isMobile ? 'column' : undefined,
          justifyContent: isMobile ? 'center' : undefined,
          flex: isMobile ? 1 : undefined,
          overflow: isMobile ? 'auto' : undefined,
        }}>
          {selectedMatch && (
            <>
              {/* Match info */}
              <Box sx={{ 
                textAlign: 'center', 
                mb: { xs: 2, lg: 3 },
                backgroundColor: isMobile ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                borderRadius: '12px',
                padding: isMobile ? 2 : 0,
              }}>
                <Typography sx={{ 
                  fontWeight: 'bold', 
                  color: isMobile ? 'white' : palette.primary.dark,
                  fontSize: { xs: '2rem', lg: '1.25rem' },
                }}>
                  {isMobile 
                    ? `${selectedMatch.teamOne?.name?.split(' ')[0]} vs ${selectedMatch.teamTwo?.name?.split(' ')[0]}`
                    : `${selectedMatch.teamOne?.name} vs ${selectedMatch.teamTwo?.name}`
                  }
                </Typography>
                <Typography sx={{ 
                  color: isMobile ? 'rgba(255, 255, 255, 0.6)' : '#888', 
                  fontSize: { xs: '1.5rem', lg: '0.85rem' } 
                }}>
                  {formatMatchDate(selectedMatch.matchTime)}
                </Typography>
              </Box>

              {/* Slider de mise */}
              <Box sx={{ 
                mb: { xs: 2, lg: 3 }, 
                px: 1,
                backgroundColor: isMobile ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                borderRadius: '12px',
                padding: isMobile ? 2 : 1,
              }}>
                <Typography sx={{ 
                  mb: 1, 
                  fontWeight: 'bold', 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  color: isMobile ? 'white' : 'inherit',
                  fontSize: { xs: '1.7rem', lg: '0.95rem' },
                }}>
                  <span>Votre mise</span>
                  <span style={{ color: palette.primary.red }}>{betData.stake} crédits</span>
                </Typography>
                <Slider
                  value={betData.stake}
                  onChange={(e, newValue) => setBetData({ ...betData, stake: newValue })}
                  min={0}
                  max={user?.betPoints || 0}
                  step={1}
                  valueLabelDisplay="auto"
                  sx={{
                    color: palette.primary.red,
                    '& .MuiSlider-thumb': {
                      '&:hover, &.Mui-focusVisible': {
                        boxShadow: `0px 0px 0px 8px rgba(208, 32, 47, 0.16)`,
                      },
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: isMobile ? 'rgba(255, 255, 255, 0.3)' : undefined,
                    },
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                  <Typography variant="caption" sx={{ color: isMobile ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary' }}>0</Typography>
                  <Typography variant="caption" sx={{ color: isMobile ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary' }}>Max: {user?.betPoints || 0}</Typography>
                </Box>
              </Box>

              {/* Cotes */}
              {matchOdds && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: { xs: 0.5, lg: 2 }, 
                  mb: { xs: 2, lg: 3 },
                  flexWrap: 'wrap',
                }}>
                  <Chip 
                    label={`1: x${matchOdds.odds.teamOne?.toFixed(2)}`}
                    sx={{ 
                      backgroundColor: isMobile ? 'rgba(99, 179, 237, 0.3)' : '#e3f2fd', 
                      color: isMobile ? 'white' : 'inherit',
                      fontWeight: 'bold',
                      fontSize: { xs: '1.4rem', lg: '0.8rem' },
                      height: { xs: 42, lg: 32 },
                    }}
                  />
                  <Chip 
                    label={`N: x${matchOdds.odds.draw?.toFixed(2)}`}
                    sx={{ 
                      backgroundColor: isMobile ? 'rgba(255, 255, 255, 0.2)' : '#f5f5f5', 
                      color: isMobile ? 'white' : 'inherit',
                      fontWeight: 'bold',
                      fontSize: { xs: '1.4rem', lg: '0.8rem' },
                      height: { xs: 42, lg: 32 },
                    }}
                  />
                  <Chip 
                    label={`2: x${matchOdds.odds.teamTwo?.toFixed(2)}`}
                    sx={{ 
                      backgroundColor: isMobile ? 'rgba(244, 143, 177, 0.3)' : '#fce4ec', 
                      color: isMobile ? 'white' : 'inherit',
                      fontWeight: 'bold',
                      fontSize: { xs: '1.4rem', lg: '0.8rem' },
                      height: { xs: 42, lg: 32 },
                    }}
                  />
                </Box>
              )}

              {/* Sélection du gagnant */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel sx={{ color: isMobile ? 'rgba(255, 255, 255, 0.7)' : undefined }}>Votre pronostic *</InputLabel>
                <Select
                  value={betData.predictedWinner}
                  label="Votre pronostic *"
                  onChange={(e) => setBetData({ ...betData, predictedWinner: e.target.value })}
                  sx={{
                    color: isMobile ? 'white' : 'inherit',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: isMobile ? 'rgba(255, 255, 255, 0.3)' : undefined,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: isMobile ? 'rgba(255, 255, 255, 0.5)' : undefined,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: palette.primary.red,
                    },
                    '& .MuiSvgIcon-root': {
                      color: isMobile ? 'white' : undefined,
                    },
                  }}
                >
                  <MenuItem value="TeamOne">
                    Victoire {selectedMatch.teamOne?.name}
                  </MenuItem>
                  <MenuItem value="Draw">Match nul</MenuItem>
                  <MenuItem value="TeamTwo">
                    Victoire {selectedMatch.teamTwo?.name}
                  </MenuItem>
                </Select>
              </FormControl>

              {/* Gains potentiels */}
              {betData.stake > 0 && betData.predictedWinner && matchOdds && (
                <Alert severity="success" sx={{ 
                  mb: 2,
                  backgroundColor: isMobile ? 'rgba(76, 175, 80, 0.2)' : undefined,
                  color: isMobile ? 'white' : undefined,
                  '& .MuiAlert-icon': {
                    color: isMobile ? '#4CAF50' : undefined,
                    fontSize: { xs: 32, lg: 22 },
                  },
                  fontSize: { xs: '1.5rem', lg: '0.875rem' },
                }}>
                  <strong>Gains potentiels:</strong><br />
                  {(() => {
                    const odds = betData.predictedWinner === 'TeamOne' ? matchOdds.odds?.teamOne :
                                 betData.predictedWinner === 'TeamTwo' ? matchOdds.odds?.teamTwo :
                                 matchOdds.odds?.draw;
                    const baseWin = Math.round(betData.stake * (odds || 2));
                    const maxBonus = betData.stake;
                    return `Base: +${baseWin} crédits | Avec score exact: +${baseWin + maxBonus} crédits`;
                  })()}
                </Alert>
              )}

              {/* Score prédit (optionnel) */}
              <Alert severity="info" sx={{ 
                mb: 2,
                backgroundColor: isMobile ? 'rgba(33, 150, 243, 0.2)' : undefined,
                color: isMobile ? 'white' : undefined,
                '& .MuiAlert-icon': {
                  color: isMobile ? '#2196F3' : undefined,
                  fontSize: { xs: 32, lg: 22 },
                },
                fontSize: { xs: '1.5rem', lg: '0.875rem' },
              }}>
                Score prédit (optionnel) : bonus jusqu'à +100% de la mise ! Plus votre score est proche du réel, plus vous gagnez.
              </Alert>
              
              <Box sx={{ 
                display: 'flex', 
                gap: { xs: 1, lg: 2 }, 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: isMobile ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                borderRadius: '12px',
                padding: isMobile ? 2 : 0,
              }}>
                {/* Score Équipe 1 */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography sx={{ 
                    mb: 0.5, 
                    fontWeight: 'bold', 
                    color: isMobile ? 'white' : palette.primary.dark, 
                    textAlign: 'center', 
                    maxWidth: { xs: 140, lg: 100 }, 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap',
                    fontSize: { xs: '1.3rem', lg: '0.75rem' },
                  }}>
                    {isMobile ? selectedMatch.teamOne?.name?.split(' ')[0] : selectedMatch.teamOne?.name || 'Équipe 1'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, lg: 1 } }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => setBetData({ ...betData, predictedScoreTeamOne: Math.max(0, (parseInt(betData.predictedScoreTeamOne) || 0) - 1).toString() })}
                      sx={{ 
                        minWidth: { xs: 56, lg: 36 }, 
                        width: { xs: 56, lg: 36 }, 
                        height: { xs: 56, lg: 36 }, 
                        borderRadius: '50%', 
                        backgroundColor: palette.primary.dark, 
                        '&:hover': { backgroundColor: '#333' } 
                      }}
                    >
                      <RemoveIcon sx={{ fontSize: { xs: 32, lg: 20 } }} />
                    </Button>
                    <Typography sx={{ 
                      fontSize: { xs: '2.4rem', lg: '1.5rem' }, 
                      fontWeight: 'bold', 
                      minWidth: { xs: 60, lg: 40 }, 
                      textAlign: 'center', 
                      color: isMobile ? 'white' : palette.primary.dark 
                    }}>
                      {betData.predictedScoreTeamOne || '0'}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => setBetData({ ...betData, predictedScoreTeamOne: ((parseInt(betData.predictedScoreTeamOne) || 0) + 1).toString() })}
                      sx={{ 
                        minWidth: { xs: 56, lg: 36 }, 
                        width: { xs: 56, lg: 36 }, 
                        height: { xs: 56, lg: 36 }, 
                        borderRadius: '50%', 
                        backgroundColor: palette.primary.red, 
                        '&:hover': { backgroundColor: '#b01020' } 
                      }}
                    >
                      <AddIcon sx={{ fontSize: { xs: 32, lg: 20 } }} />
                    </Button>
                  </Box>
                </Box>

                <Typography sx={{ 
                  fontSize: { xs: '2rem', lg: '1.2rem' }, 
                  fontWeight: 'bold', 
                  color: isMobile ? 'rgba(255, 255, 255, 0.5)' : palette.secondary.main, 
                  mx: { xs: 1, lg: 1 } 
                }}>-</Typography>

                {/* Score Équipe 2 */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography sx={{ 
                    mb: 0.5, 
                    fontWeight: 'bold', 
                    color: isMobile ? 'white' : palette.primary.dark, 
                    textAlign: 'center', 
                    maxWidth: { xs: 140, lg: 100 }, 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap',
                    fontSize: { xs: '1.3rem', lg: '0.75rem' },
                  }}>
                    {isMobile ? selectedMatch.teamTwo?.name?.split(' ')[0] : selectedMatch.teamTwo?.name || 'Équipe 2'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, lg: 1 } }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => setBetData({ ...betData, predictedScoreTeamTwo: Math.max(0, (parseInt(betData.predictedScoreTeamTwo) || 0) - 1).toString() })}
                      sx={{ 
                        minWidth: { xs: 56, lg: 36 }, 
                        width: { xs: 56, lg: 36 }, 
                        height: { xs: 56, lg: 36 }, 
                        borderRadius: '50%', 
                        backgroundColor: palette.primary.dark, 
                        '&:hover': { backgroundColor: '#333' } 
                      }}
                    >
                      <RemoveIcon sx={{ fontSize: { xs: 32, lg: 20 } }} />
                    </Button>
                    <Typography sx={{ 
                      fontSize: { xs: '2.4rem', lg: '1.5rem' }, 
                      fontWeight: 'bold', 
                      minWidth: { xs: 60, lg: 40 }, 
                      textAlign: 'center', 
                      color: isMobile ? 'white' : palette.primary.dark 
                    }}>
                      {betData.predictedScoreTeamTwo || '0'}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => setBetData({ ...betData, predictedScoreTeamTwo: ((parseInt(betData.predictedScoreTeamTwo) || 0) + 1).toString() })}
                      sx={{ 
                        minWidth: { xs: 56, lg: 36 }, 
                        width: { xs: 56, lg: 36 }, 
                        height: { xs: 56, lg: 36 }, 
                        borderRadius: '50%', 
                        backgroundColor: palette.primary.red, 
                        '&:hover': { backgroundColor: '#b01020' } 
                      }}
                    >
                      <AddIcon sx={{ fontSize: { xs: 32, lg: 20 } }} />
                    </Button>
                  </Box>
                </Box>
              </Box>

              {/* Bouton Miser sur mobile (intégré au contenu pour être centré) */}
              {isMobile && (
                <Box sx={{ mt: 3, px: 1 }}>
                  <Button
                    variant="contained"
                    onClick={handlePlaceBet}
                    disabled={betLoading || !betData.predictedWinner || betData.stake <= 0}
                    fullWidth
                    sx={{
                      backgroundColor: palette.primary.red,
                      '&:hover': { backgroundColor: '#b01020' },
                      borderRadius: '25px',
                      padding: '1.5rem',
                      fontWeight: 'bold',
                      fontSize: '1.5rem',
                      minHeight: '70px',
                    }}
                  >
                    {betLoading ? <CircularProgress size={40} sx={{ color: 'white' }} /> : `Miser ${betData.stake} crédits`}
                  </Button>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        {!isMobile && (
          <DialogActions sx={{ 
            padding: 2,
            backgroundColor: 'white',
          }}>
            <Button onClick={() => setBetDialogOpen(false)} disabled={betLoading}>
              Annuler
            </Button>
            <Button
              variant="contained"
              onClick={handlePlaceBet}
              disabled={betLoading || !betData.predictedWinner || betData.stake <= 0}
              sx={{
                backgroundColor: palette.primary.red,
                '&:hover': { backgroundColor: '#b01020' },
                fontWeight: 'bold',
              }}
            >
              {betLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : `Miser ${betData.stake} crédits`}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};

export default MatchsProno;
