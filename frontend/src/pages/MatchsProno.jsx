import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
} from "@mui/material";
import {
  SportsSoccer as SoccerIcon,
  ArrowBack as ArrowBackIcon,
  Casino as CasinoIcon,
  EmojiEvents as TrophyIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from 'react-router-dom';
import NavbarParticipant from "../components/navbar/NavbarParticipant";
import palette from "../themes/palette";
import { ApiTossConnected } from "../service/axios";
import { getMatchOdds, placeBet } from "../service/betService";
import { useSnackbar } from "../provider/snackbarProvider";

const MatchsProno = () => {
  const navigate = useNavigate();
  const { sportId } = useParams();
  const { showSnackbar } = useSnackbar();
  
  const [loading, setLoading] = useState(true);
  const [sport, setSport] = useState(null);
  const [pools, setPools] = useState([]);
  const [matches, setMatches] = useState([]);
  const [selectedPool, setSelectedPool] = useState(null);
  const [showKnockout, setShowKnockout] = useState(false);
  
  // Dialog state
  const [betDialogOpen, setBetDialogOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [matchOdds, setMatchOdds] = useState(null);
  const [betData, setBetData] = useState({
    predictedWinner: '',
    predictedScoreTeamOne: '',
    predictedScoreTeamTwo: '',
  });
  const [betLoading, setBetLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [sportId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les infos du sport
      const sportsResponse = await ApiTossConnected.get('/sports');
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
      
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar('Erreur lors du chargement des données', 3000, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les matchs selon la sélection
  const getFilteredMatches = () => {
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
    
    setBetLoading(true);
    try {
      await placeBet({
        matchId: selectedMatch.id,
        predictedWinner: betData.predictedWinner,
        predictedScoreTeamOne: betData.predictedScoreTeamOne ? parseInt(betData.predictedScoreTeamOne) : null,
        predictedScoreTeamTwo: betData.predictedScoreTeamTwo ? parseInt(betData.predictedScoreTeamTwo) : null,
      });
      
      showSnackbar('Pari placé avec succès !', 3000, 'success');
      setBetDialogOpen(false);
      
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
            backgroundColor: '#f5f5f5',
            minHeight: '100vh',
            paddingTop: '80px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress sx={{ color: palette.primary.main }} />
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
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
          paddingTop: '80px',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            backgroundColor: palette.primary.dark,
            padding: '1.5rem 3rem',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/mon-petit-prono')} sx={{ color: 'white' }}>
              <ArrowBackIcon />
            </IconButton>
            <SoccerIcon sx={{ fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {sport?.sport || 'Sport'}
            </Typography>
          </Box>
        </Box>

        {/* Tabs pour poules */}
        <Box sx={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <Tabs
            value={showKnockout ? 'knockout' : selectedPool}
            onChange={(e, value) => {
              if (value === 'knockout') {
                setShowKnockout(true);
                setSelectedPool(null);
              } else {
                setShowKnockout(false);
                setSelectedPool(value);
              }
            }}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '0.9rem',
              },
              '& .Mui-selected': {
                color: palette.primary.red,
              },
              '& .MuiTabs-indicator': {
                backgroundColor: palette.primary.red,
              },
            }}
          >
            {pools.map((pool) => (
              <Tab key={pool.id} label={pool.name} value={pool.id} />
            ))}
            {hasKnockoutMatches && (
              <Tab 
                label="Phases finales" 
                value="knockout"
                icon={<TrophyIcon sx={{ fontSize: 18 }} />}
                iconPosition="start"
              />
            )}
          </Tabs>
        </Box>

        {/* Liste des matchs */}
        <Box sx={{ padding: '1.5rem' }}>
          {filteredMatches.length === 0 ? (
            <Card sx={{ padding: '2rem', textAlign: 'center', borderRadius: '12px' }}>
              <Typography sx={{ color: '#666' }}>
                Aucun match dans cette catégorie
              </Typography>
            </Card>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {filteredMatches.map((match) => (
                <Card
                  key={match.id}
                  sx={{
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    overflow: 'hidden',
                    cursor: match.hasStarted ? 'default' : 'pointer',
                    opacity: match.hasEnded ? 0.7 : 1,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: match.hasStarted ? 'none' : 'scale(1.01)',
                    },
                  }}
                  onClick={() => !match.hasStarted && handleOpenBetDialog(match)}
                >
                  <CardContent sx={{ padding: '1rem 1.5rem' }}>
                    {/* Match Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography sx={{ fontSize: '0.75rem', color: '#888' }}>
                        {formatMatchDate(match.matchTime)}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {match.phase !== 'GroupStage' && (
                          <Chip
                            label={getPhaseLabel(match.phase)}
                            size="small"
                            sx={{ backgroundColor: '#FFD700', color: '#333', fontSize: '0.7rem' }}
                          />
                        )}
                        {match.hasEnded ? (
                          <Chip label="Terminé" size="small" sx={{ backgroundColor: '#4CAF50', color: 'white', fontSize: '0.7rem' }} />
                        ) : match.hasStarted ? (
                          <Chip label="En cours" size="small" sx={{ backgroundColor: '#FFA500', color: 'white', fontSize: '0.7rem' }} />
                        ) : (
                          <Chip 
                            label="Parier" 
                            size="small" 
                            icon={<CasinoIcon sx={{ fontSize: 14 }} />}
                            sx={{ backgroundColor: palette.primary.main, color: 'white', fontSize: '0.7rem' }} 
                          />
                        )}
                      </Box>
                    </Box>

                    {/* Teams */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {/* Team 1 */}
                      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          src={match.teamOne?.school?.pictureLink}
                          sx={{ width: 40, height: 40, backgroundColor: palette.primary.light }}
                        >
                          {match.teamOne?.name?.[0]}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 'bold', fontSize: '0.95rem', color: palette.primary.dark }}>
                            {match.teamOne?.name || 'TBD'}
                          </Typography>
                          <Typography sx={{ fontSize: '0.7rem', color: '#888' }}>
                            {match.teamOne?.school?.name}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Score or VS */}
                      <Box sx={{ px: 2, textAlign: 'center' }}>
                        {match.hasStarted || match.hasEnded ? (
                          <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: palette.primary.dark }}>
                            {match.scoreTeamOne ?? '-'} - {match.scoreTeamTwo ?? '-'}
                          </Typography>
                        ) : (
                          <Typography sx={{ fontWeight: 'bold', color: '#999', fontSize: '0.9rem' }}>
                            VS
                          </Typography>
                        )}
                      </Box>

                      {/* Team 2 */}
                      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'flex-end', textAlign: 'right' }}>
                        <Box>
                          <Typography sx={{ fontWeight: 'bold', fontSize: '0.95rem', color: palette.primary.dark }}>
                            {match.teamTwo?.name || 'TBD'}
                          </Typography>
                          <Typography sx={{ fontSize: '0.7rem', color: '#888' }}>
                            {match.teamTwo?.school?.name}
                          </Typography>
                        </Box>
                        <Avatar
                          src={match.teamTwo?.school?.pictureLink}
                          sx={{ width: 40, height: 40, backgroundColor: palette.primary.light }}
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
      >
        <DialogTitle sx={{ backgroundColor: palette.primary.dark, color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CasinoIcon />
            Placer un pari
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedMatch && (
            <>
              {/* Match info */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: palette.primary.dark }}>
                  {selectedMatch.teamOne?.name} vs {selectedMatch.teamTwo?.name}
                </Typography>
                <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>
                  {formatMatchDate(selectedMatch.matchTime)}
                </Typography>
              </Box>

              {/* Cotes */}
              {matchOdds && (
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                  <Chip 
                    label={`1: x${matchOdds.odds.teamOne?.toFixed(2)}`}
                    sx={{ backgroundColor: '#e3f2fd', fontWeight: 'bold' }}
                  />
                  <Chip 
                    label={`N: x${matchOdds.odds.draw?.toFixed(2)}`}
                    sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}
                  />
                  <Chip 
                    label={`2: x${matchOdds.odds.teamTwo?.toFixed(2)}`}
                    sx={{ backgroundColor: '#fce4ec', fontWeight: 'bold' }}
                  />
                </Box>
              )}

              {/* Sélection du gagnant */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Votre pronostic *</InputLabel>
                <Select
                  value={betData.predictedWinner}
                  label="Votre pronostic *"
                  onChange={(e) => setBetData({ ...betData, predictedWinner: e.target.value })}
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

              {/* Score prédit (optionnel) */}
              <Alert severity="info" sx={{ mb: 2 }}>
                Score prédit (optionnel) : jusqu'à +50 pts bonus ! Plus votre score est proche du réel, plus vous gagnez de points.
              </Alert>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label={`Score ${selectedMatch.teamOne?.name}`}
                    type="number"
                    value={betData.predictedScoreTeamOne}
                    onChange={(e) => setBetData({ ...betData, predictedScoreTeamOne: e.target.value })}
                    inputProps={{ min: 0, max: 20 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label={`Score ${selectedMatch.teamTwo?.name}`}
                    type="number"
                    value={betData.predictedScoreTeamTwo}
                    onChange={(e) => setBetData({ ...betData, predictedScoreTeamTwo: e.target.value })}
                    inputProps={{ min: 0, max: 20 }}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button onClick={() => setBetDialogOpen(false)} disabled={betLoading}>
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={handlePlaceBet}
            disabled={betLoading || !betData.predictedWinner}
            sx={{
              backgroundColor: palette.primary.red,
              '&:hover': { backgroundColor: '#b01020' },
            }}
          >
            {betLoading ? <CircularProgress size={24} /> : 'Valider le pari'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MatchsProno;
