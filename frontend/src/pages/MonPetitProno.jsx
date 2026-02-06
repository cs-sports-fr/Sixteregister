import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  Stars as StarsIcon,
  SportsSoccer as SoccerIcon,
  ArrowForward as ArrowForwardIcon,
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
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [bets, setBets] = useState([]);
  const [rank, setRank] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
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
      setLeaderboard(leaderboardResponse);
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
            padding: '2rem 3rem',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SoccerIcon sx={{ fontSize: 32 }} />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
              }}
            >
              <span
                style={{
                  textDecoration: 'underline',
                  textDecorationColor: palette.primary.red,
                  textDecorationThickness: '4px',
                  textUnderlineOffset: '8px',
                }}
              >
                Mon
              </span>{' '}
              Petit Prono
            </Typography>
          </Box>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1rem', mt: 1 }}>
            Pariez sur les matchs et grimpez dans le classement !
          </Typography>
        </Box>

        {/* Profile Section */}
        <Box sx={{ padding: '2rem 3rem' }}>
          {/* User Info Card */}
          <Card
            sx={{
              borderRadius: '16px',
              marginBottom: '2rem',
              overflow: 'visible',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}
          >
            <CardContent sx={{ padding: '2rem' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: palette.primary.main,
                    fontSize: '2rem',
                    fontWeight: 'bold',
                  }}
                >
                  {user?.firstname?.[0]}{user?.lastname?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: palette.primary.dark }}>
                    {user?.firstname} {user?.lastname?.[0]}.
                  </Typography>
                  <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>
                    {user?.school?.name || 'École non définie'}
                  </Typography>
                </Box>
              </Box>

              {/* Stats Cards */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      backgroundColor: '#f8f9fa',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      textAlign: 'center',
                      border: '2px solid #e9ecef',
                    }}
                  >
                    <TrophyIcon sx={{ fontSize: 32, color: '#FFD700', mb: 1 }} />
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 'bold', color: palette.primary.dark }}
                    >
                      {rank ? `${rank}${rank === 1 ? 'er' : 'ème'}` : '-'}
                    </Typography>
                    <Typography sx={{ color: '#666', fontSize: '0.85rem' }}>
                      Classement
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      backgroundColor: '#f8f9fa',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      textAlign: 'center',
                      border: '2px solid #e9ecef',
                    }}
                  >
                    <StarsIcon sx={{ fontSize: 32, color: palette.primary.main, mb: 1 }} />
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 'bold', color: palette.primary.dark }}
                    >
                      {user?.betPoints || 0}
                    </Typography>
                    <Typography sx={{ color: '#666', fontSize: '0.85rem' }}>
                      Points
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Active Bets Section */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: palette.primary.dark,
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <SoccerIcon sx={{ color: palette.primary.red }} />
            Paris en cours
          </Typography>

          {activeBets.length === 0 ? (
            <Card
              sx={{
                borderRadius: '12px',
                padding: '2rem',
                textAlign: 'center',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              }}
            >
              <Typography sx={{ color: '#666' }}>
                Aucun pari en cours. Rendez-vous sur les matchs pour parier !
              </Typography>
            </Card>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {activeBets.map((bet) => (
                <Card
                  key={bet.id}
                  sx={{
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    overflow: 'hidden',
                  }}
                >
                  <CardContent sx={{ padding: '1.5rem' }}>
                    {/* Match Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography sx={{ color: '#666', fontSize: '0.85rem' }}>
                        {bet.match?.sport?.sport || 'Sport'}
                      </Typography>
                      <Chip
                        label={getMatchStatusLabel(bet.match)}
                        size="small"
                        sx={{
                          backgroundColor: getMatchStatusColor(bet.match),
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.7rem',
                        }}
                      />
                    </Box>

                    {/* Teams */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ flex: 1, textAlign: 'center' }}>
                        <Avatar
                          src={bet.match?.teamOne?.school?.pictureLink}
                          sx={{ 
                            width: 48, 
                            height: 48, 
                            margin: '0 auto 0.5rem',
                            backgroundColor: palette.primary.light,
                          }}
                        >
                          {bet.match?.teamOne?.name?.[0]}
                        </Avatar>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: palette.primary.dark }}>
                          {bet.match?.teamOne?.name || 'Équipe 1'}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#888' }}>
                          {bet.match?.teamOne?.school?.name}
                        </Typography>
                      </Box>

                      <Box sx={{ px: 2 }}>
                        <Typography
                          sx={{
                            fontWeight: 'bold',
                            color: '#999',
                            fontSize: '0.9rem',
                          }}
                        >
                          VS
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: '#aaa', textAlign: 'center', mt: 0.5 }}>
                          {formatMatchDate(bet.match?.matchTime)}
                        </Typography>
                      </Box>

                      <Box sx={{ flex: 1, textAlign: 'center' }}>
                        <Avatar
                          src={bet.match?.teamTwo?.school?.pictureLink}
                          sx={{ 
                            width: 48, 
                            height: 48, 
                            margin: '0 auto 0.5rem',
                            backgroundColor: palette.primary.light,
                          }}
                        >
                          {bet.match?.teamTwo?.name?.[0]}
                        </Avatar>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: palette.primary.dark }}>
                          {bet.match?.teamTwo?.name || 'Équipe 2'}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#888' }}>
                          {bet.match?.teamTwo?.school?.name}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    {/* User Prediction */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', color: '#888' }}>
                          Votre Pronostic
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 'bold',
                            color: palette.primary.main,
                            fontSize: '0.95rem',
                          }}
                        >
                          {getPredictionLabel(bet)}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ fontSize: '0.75rem', color: '#888' }}>
                          Cote
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 'bold',
                            color: palette.primary.dark,
                            fontSize: '1.1rem',
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
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: palette.primary.dark,
                  marginTop: '2rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <TrophyIcon sx={{ color: '#FFD700' }} />
                Historique des paris
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {bets.filter(b => b.match?.hasEnded).map((bet) => (
                  <Card
                    key={bet.id}
                    sx={{
                      borderRadius: '12px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                      borderLeft: `4px solid ${bet.isCorrect ? '#4CAF50' : '#f44336'}`,
                    }}
                  >
                    <CardContent sx={{ padding: '1rem 1.5rem' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: palette.primary.dark }}>
                            {bet.match?.teamOne?.name} vs {bet.match?.teamTwo?.name}
                          </Typography>
                          <Typography sx={{ fontSize: '0.8rem', color: '#888' }}>
                            Score: {bet.match?.scoreTeamOne} - {bet.match?.scoreTeamTwo}
                          </Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: '#aaa' }}>
                            Pronostic: {getPredictionLabel(bet)}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Chip
                            label={bet.isCorrect ? 'Gagné' : 'Perdu'}
                            size="small"
                            sx={{
                              backgroundColor: bet.isCorrect ? '#4CAF50' : '#f44336',
                              color: 'white',
                              fontWeight: 'bold',
                              mb: 0.5,
                            }}
                          />
                          <Typography
                            sx={{
                              fontWeight: 'bold',
                              color: bet.isCorrect ? '#4CAF50' : '#f44336',
                              fontSize: '1rem',
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

          {/* Section Sports - Pour aller parier */}
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: palette.primary.dark, mb: 2 }}>
            🎯 Parier sur les matchs
          </Typography>
          <Grid container spacing={2}>
            {sports.map((sport) => (
              <Grid item xs={12} sm={6} md={4} key={sport.id}>
                <Card
                  sx={{
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    },
                  }}
                  onClick={() => navigate(`/matchs-prono/${sport.id}`)}
                >
                  <CardContent sx={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <SoccerIcon sx={{ color: palette.primary.main, fontSize: 28 }} />
                      <Typography sx={{ fontWeight: 'bold', color: palette.primary.dark }}>
                        {sport.sport}
                      </Typography>
                    </Box>
                    <ArrowForwardIcon sx={{ color: palette.primary.red }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default MonPetitProno;
