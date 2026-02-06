import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Avatar,
  Chip,
  Divider,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  SportsSoccer as SoccerIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import NavbarParticipant from "../components/navbar/NavbarParticipant";
import palette from "../themes/palette";
import { getMyBets, getLeaderboard, getCurrentUser } from "../service/betService";
import { ApiTossConnected } from "../service/axios";
import { useSnackbar } from "../provider/snackbarProvider";

const MonPetitProno = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [bets, setBets] = useState([]);
  const [rank, setRank] = useState(null);
  const [sports, setSports] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les données en parallèle
      const [userResponse, betsResponse, leaderboardResponse, sportsResponse] = await Promise.all([
        getCurrentUser(),
        getMyBets(),
        getLeaderboard(100),
        ApiTossConnected.get('/sports'),
      ]);

      setUser(userResponse);
      setBets(betsResponse);
      setSports(sportsResponse.data);

      // Calculer le rang
      const userRank = leaderboardResponse.findIndex(u => u.userId === userResponse.id) + 1;
      setRank(userRank > 0 ? userRank : null);

    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar('Erreur lors du chargement des données', 3000, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les paris en cours (matchs non terminés)
  const activeBets = bets.filter(bet => !bet.match?.hasEnded);

  // Formater la date du match
  const formatMatchDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    const timeStr = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    if (isToday) return `Aujourd'hui, ${timeStr}`;
    if (isTomorrow) return `Demain, ${timeStr}`;
    
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtenir le label de prédiction
  const getPredictionLabel = (bet) => {
    const winner = bet.predictedWinner;
    const teamOneName = bet.match?.teamOne?.name || 'Équipe 1';
    const teamTwoName = bet.match?.teamTwo?.name || 'Équipe 2';

    let label = '';
    if (winner === 'TeamOne') label = `Victoire ${teamOneName}`;
    else if (winner === 'TeamTwo') label = `Victoire ${teamTwoName}`;
    else label = 'Match nul';

    // Ajouter le score prédit si disponible
    if (bet.predictedScoreTeamOne !== null && bet.predictedScoreTeamTwo !== null) {
      label += ` (${bet.predictedScoreTeamOne}-${bet.predictedScoreTeamTwo})`;
    }

    return label;
  };

  // Obtenir la couleur selon le statut du match
  const getMatchStatusColor = (match) => {
    if (match?.hasStarted && !match?.hasEnded) return '#FFA500'; // En cours
    if (match?.hasEnded) return '#4CAF50'; // Terminé
    return palette.primary.main; // À venir
  };

  const getMatchStatusLabel = (match) => {
    if (match?.hasStarted && !match?.hasEnded) return 'En cours';
    if (match?.hasEnded) return 'Terminé';
    return 'À venir';
  };

  if (loading) {
    return (
      <>
        <NavbarParticipant />
        <Box
          sx={{
            backgroundColor: '#f8f9fa',
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

  return (
    <>
      <NavbarParticipant />
      <Box
        sx={{
          backgroundColor: '#f8f9fa',
          minHeight: '100vh',
          paddingTop: '80px',
        }}
      >
        {/* Header avec profil */}
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, lg: 2 }, mb: { xs: 1.5, lg: 2 } }}>
            <Button
              onClick={() => navigate('/mon-petit-prono')}
              sx={{ color: 'white', minWidth: 'auto', p: { xs: 0.5, lg: 1 } }}
              startIcon={<ArrowBackIcon />}
            >
              {!isMobile && 'Retour'}
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, lg: 3 } }}>
            <Avatar
              sx={{
                width: { xs: 50, lg: 70 },
                height: { xs: 50, lg: 70 },
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                fontSize: { xs: '1rem', lg: '1.5rem' },
                fontWeight: 'bold',
                border: '3px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              {user?.firstname?.[0]}{user?.lastname?.[0]}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: { xs: '1.1rem', lg: '1.4rem' } }}>
                {user?.firstname} {user?.lastname?.[0]}.
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: { xs: '0.75rem', lg: '0.9rem' } }}>
                {user?.school?.name || 'École non définie'}
              </Typography>
            </Box>
            
            {/* Stats compactes */}
            <Box sx={{ display: 'flex', gap: { xs: 1, lg: 2 } }}>
              <Box sx={{ 
                backgroundColor: 'rgba(255,255,255,0.15)', 
                padding: { xs: '0.4rem 0.7rem', lg: '0.5rem 1rem' }, 
                borderRadius: '12px',
                textAlign: 'center',
              }}>
                <TrophyIcon sx={{ color: '#FFD700', fontSize: { xs: 18, lg: 24 } }} />
                <Typography sx={{ fontWeight: 'bold', fontSize: { xs: '0.85rem', lg: '1rem' } }}>
                  {rank ? `${rank}${rank === 1 ? 'er' : 'e'}` : '-'}
                </Typography>
              </Box>
              <Box sx={{ 
                backgroundColor: 'rgba(255,255,255,0.15)', 
                padding: { xs: '0.4rem 0.7rem', lg: '0.5rem 1rem' }, 
                borderRadius: '12px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
                <SoccerIcon sx={{ color: palette.primary.red, fontSize: { xs: 18, lg: 24 } }} />
                <Typography sx={{ fontWeight: 'bold', fontSize: { xs: '0.85rem', lg: '1rem' } }}>
                  {user?.betPoints || 0}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Contenu principal */}
        <Box sx={{ padding: { xs: '1rem', lg: '2rem 3rem' } }}>

          {/* Active Bets Section */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: { xs: 1, lg: 1.5 },
          }}>
            <Typography
              sx={{
                fontWeight: 'bold',
                color: palette.primary.dark,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: { xs: '1rem', lg: '1.15rem' },
              }}
            >
              <SoccerIcon sx={{ color: palette.primary.red, fontSize: { xs: 20, lg: 24 } }} />
              Paris en cours
            </Typography>
            <Chip 
              label={activeBets.length} 
              size="small" 
              sx={{ 
                backgroundColor: palette.primary.red, 
                color: 'white', 
                fontWeight: 'bold',
                fontSize: { xs: '0.7rem', lg: '0.8rem' },
              }} 
            />
          </Box>

          {activeBets.length === 0 ? (
            <Card
              sx={{
                borderRadius: '12px',
                padding: { xs: '1.5rem', lg: '2rem' },
                textAlign: 'center',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                mb: { xs: 2, lg: 3 },
              }}
            >
              <Typography sx={{ color: '#666', fontSize: { xs: '0.85rem', lg: '0.95rem' } }}>
                Aucun pari en cours. Rendez-vous sur les matchs pour parier !
              </Typography>
            </Card>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, lg: 2 }, mb: { xs: 2, lg: 3 } }}>
              {activeBets.map((bet) => (
                <Card
                  key={bet.id}
                  sx={{
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    overflow: 'hidden',
                  }}
                >
                  <CardContent sx={{ padding: { xs: '0.75rem', lg: '1.5rem' } }}>
                    {/* Match Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 1, lg: 2 } }}>
                      <Typography sx={{ color: '#666', fontSize: { xs: '0.7rem', lg: '0.85rem' } }}>
                        {bet.match?.sport?.sport || 'Sport'}
                      </Typography>
                      <Chip
                        label={getMatchStatusLabel(bet.match)}
                        size="small"
                        sx={{
                          backgroundColor: getMatchStatusColor(bet.match),
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: { xs: '0.6rem', lg: '0.7rem' },
                          height: { xs: 20, lg: 24 },
                        }}
                      />
                    </Box>

                    {/* Teams - Version compacte sur mobile */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: { xs: 1, lg: 2 } }}>
                      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: { xs: 0.75, lg: 1 } }}>
                        <Avatar
                          src={bet.match?.teamOne?.school?.pictureLink}
                          sx={{ 
                            width: { xs: 32, lg: 48 }, 
                            height: { xs: 32, lg: 48 }, 
                            backgroundColor: palette.primary.light,
                            fontSize: { xs: '0.75rem', lg: '1rem' },
                          }}
                        >
                          {bet.match?.teamOne?.name?.[0]}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ 
                            fontWeight: 'bold', 
                            fontSize: { xs: '0.75rem', lg: '0.9rem' }, 
                            color: palette.primary.dark,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {isMobile ? bet.match?.teamOne?.name?.split(' ')[0] : bet.match?.teamOne?.name || 'Équipe 1'}
                          </Typography>
                          {!isMobile && (
                            <Typography sx={{ fontSize: '0.7rem', color: '#888' }}>
                              {bet.match?.teamOne?.school?.name}
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      <Box sx={{ px: { xs: 1, lg: 2 }, textAlign: 'center' }}>
                        <Typography sx={{ fontWeight: 'bold', color: '#999', fontSize: { xs: '0.75rem', lg: '0.9rem' } }}>
                          VS
                        </Typography>
                        <Typography sx={{ fontSize: { xs: '0.6rem', lg: '0.7rem' }, color: '#aaa', mt: 0.5 }}>
                          {formatMatchDate(bet.match?.matchTime)}
                        </Typography>
                      </Box>

                      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: { xs: 0.75, lg: 1 }, justifyContent: 'flex-end' }}>
                        <Box sx={{ minWidth: 0, textAlign: 'right' }}>
                          <Typography sx={{ 
                            fontWeight: 'bold', 
                            fontSize: { xs: '0.75rem', lg: '0.9rem' }, 
                            color: palette.primary.dark,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {isMobile ? bet.match?.teamTwo?.name?.split(' ')[0] : bet.match?.teamTwo?.name || 'Équipe 2'}
                          </Typography>
                          {!isMobile && (
                            <Typography sx={{ fontSize: '0.7rem', color: '#888' }}>
                              {bet.match?.teamTwo?.school?.name}
                            </Typography>
                          )}
                        </Box>
                        <Avatar
                          src={bet.match?.teamTwo?.school?.pictureLink}
                          sx={{ 
                            width: { xs: 32, lg: 48 }, 
                            height: { xs: 32, lg: 48 }, 
                            backgroundColor: palette.primary.light,
                            fontSize: { xs: '0.75rem', lg: '1rem' },
                          }}
                        >
                          {bet.match?.teamTwo?.name?.[0]}
                        </Avatar>
                      </Box>
                    </Box>

                    <Divider sx={{ my: { xs: 1, lg: 1.5 } }} />

                    {/* User Prediction */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography sx={{ fontSize: { xs: '0.65rem', lg: '0.75rem' }, color: '#888' }}>
                          Votre Pronostic
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 'bold',
                            color: palette.primary.red,
                            fontSize: { xs: '0.8rem', lg: '0.95rem' },
                          }}
                        >
                          {getPredictionLabel(bet)}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ fontSize: { xs: '0.65rem', lg: '0.75rem' }, color: '#888' }}>
                          Cote
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 'bold',
                            color: palette.primary.dark,
                            fontSize: { xs: '0.95rem', lg: '1.1rem' },
                          }}
                        >
                          x{(bet.predictedWinner === 'TeamOne' 
                              ? bet.oddsSnapshotTeamOne 
                              : bet.predictedWinner === 'TeamTwo' 
                                ? bet.oddsSnapshotTeamTwo 
                                : bet.oddsSnapshotDraw
                            )?.toFixed(2) || '2.00'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

          {/* Past Bets Section */}
          {bets.filter(b => b.match?.hasEnded).length > 0 && (
            <>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mt: { xs: 2, lg: 3 },
                mb: { xs: 1, lg: 1.5 },
              }}>
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    color: palette.primary.dark,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontSize: { xs: '1rem', lg: '1.15rem' },
                  }}
                >
                  <HistoryIcon sx={{ color: '#FFD700', fontSize: { xs: 20, lg: 24 } }} />
                  Historique des paris
                </Typography>
                <Chip 
                  label={bets.filter(b => b.match?.hasEnded).length} 
                  size="small" 
                  sx={{ 
                    backgroundColor: '#666', 
                    color: 'white', 
                    fontWeight: 'bold',
                    fontSize: { xs: '0.7rem', lg: '0.8rem' },
                  }} 
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, lg: 2 }, mb: { xs: 2, lg: 3 } }}>
                {bets.filter(b => b.match?.hasEnded).map((bet) => (
                  <Card
                    key={bet.id}
                    sx={{
                      borderRadius: '12px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                      borderLeft: `4px solid ${bet.isCorrect ? '#4CAF50' : '#f44336'}`,
                    }}
                  >
                    <CardContent sx={{ padding: { xs: '0.75rem 1rem', lg: '1rem 1.5rem' } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ 
                            fontWeight: 'bold', 
                            fontSize: { xs: '0.8rem', lg: '0.9rem' }, 
                            color: palette.primary.dark,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {isMobile 
                              ? `${bet.match?.teamOne?.name?.split(' ')[0]} vs ${bet.match?.teamTwo?.name?.split(' ')[0]}`
                              : `${bet.match?.teamOne?.name} vs ${bet.match?.teamTwo?.name}`
                            }
                          </Typography>
                          <Typography sx={{ fontSize: { xs: '0.7rem', lg: '0.8rem' }, color: '#888' }}>
                            Score: {bet.match?.scoreTeamOne} - {bet.match?.scoreTeamTwo}
                          </Typography>
                          <Typography sx={{ fontSize: { xs: '0.65rem', lg: '0.75rem' }, color: '#aaa' }}>
                            Pronostic: {isMobile ? getPredictionLabel(bet).split(' ')[0] : getPredictionLabel(bet)}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right', ml: 1 }}>
                          <Chip
                            label={bet.isCorrect ? 'Gagné' : 'Perdu'}
                            size="small"
                            sx={{
                              backgroundColor: bet.isCorrect ? '#4CAF50' : '#f44336',
                              color: 'white',
                              fontWeight: 'bold',
                              mb: 0.5,
                              fontSize: { xs: '0.6rem', lg: '0.7rem' },
                              height: { xs: 20, lg: 24 },
                            }}
                          />
                          <Typography
                            sx={{
                              fontWeight: 'bold',
                              color: bet.isCorrect ? '#4CAF50' : '#f44336',
                              fontSize: { xs: '0.85rem', lg: '1rem' },
                            }}
                          >
                            {bet.isCorrect ? `+${bet.pointsWon}` : '0'} pts
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </>
          )}

          {/* Section Accès aux matchs */}
          <Divider sx={{ my: { xs: 2, lg: 3 } }} />
          
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate('/matchs-prono/all')}
            sx={{
              background: `linear-gradient(135deg, ${palette.primary.red} 0%, #a01020 100%)`,
              borderRadius: '12px',
              padding: { xs: '1rem', lg: '1.25rem' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textTransform: 'none',
              boxShadow: '0 4px 15px rgba(207, 20, 39, 0.3)',
              '&:hover': {
                background: `linear-gradient(135deg, #a01020 0%, #800815 100%)`,
                boxShadow: '0 6px 20px rgba(207, 20, 39, 0.4)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, lg: 2 } }}>
              <SoccerIcon sx={{ fontSize: { xs: 24, lg: 32 } }} />
              <Box sx={{ textAlign: 'left' }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', lg: '1.15rem' } }}>
                  Voir tous les matchs
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.7rem', lg: '0.8rem' }, opacity: 0.9 }}>
                  Parier sur les prochains matchs
                </Typography>
              </Box>
            </Box>
            <ArrowForwardIcon sx={{ fontSize: { xs: 20, lg: 24 } }} />
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default MonPetitProno;
