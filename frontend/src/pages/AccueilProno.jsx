import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Avatar,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import {
  SportsSoccer as SoccerIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  AccessTime as TimeIcon,
  Casino as CasinoIcon,
} from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import NavbarParticipant from "../components/navbar/NavbarParticipant";
import palette from "../themes/palette";
import { getMyBets, getLeaderboard, getCurrentUser } from "../service/betService";
import { ApiTossConnected } from "../service/axios";
import { useSnackbar } from "../provider/snackbarProvider";

const AccueilProno = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [bets, setBets] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [nextMatchFeminin, setNextMatchFeminin] = useState(null);
  const [nextMatchMasculin, setNextMatchMasculin] = useState(null);
  const [sports, setSports] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [userResponse, betsResponse, leaderboardResponse, sportsResponse] = await Promise.all([
        getCurrentUser(),
        getMyBets(),
        getLeaderboard(10),
        ApiTossConnected.get('/sports'),
      ]);

      setUser(userResponse);
      setBets(betsResponse);
      setLeaderboard(leaderboardResponse.slice(0, 3));
      setSports(sportsResponse.data);

      // Récupérer tous les matchs de tous les sports
      const allMatchesPromises = sportsResponse.data.map(async (sport) => {
        try {
          const response = await ApiTossConnected.get(`/matches/${sport.id}`);
          return response.data.map(match => ({ ...match, sportName: sport.sport, sportId: sport.id }));
        } catch {
          return [];
        }
      });

      const allMatchesArrays = await Promise.all(allMatchesPromises);
      const allMatches = allMatchesArrays.flat();

      // Filtrer les matchs à venir avec équipes définies
      const upcomingMatches = allMatches
        .filter(m => !m.hasStarted && m.teamOne && m.teamTwo)
        .sort((a, b) => {
          // Trier par date, puis par ID (pour avoir un critère stable si même heure)
          const dateDiff = new Date(a.matchTime) - new Date(b.matchTime);
          if (dateDiff !== 0) return dateDiff;
          return a.id - b.id;
        });

      // Séparer les matchs féminins et masculins selon le nom du sport
      // Critère: le sport contient "F" ou "féminin" ou "feminin" = féminin, sinon masculin
      const isFeminin = (sportName) => {
        const lower = sportName?.toLowerCase() || '';
        return lower.includes(' f') || lower.endsWith(' f') || lower.includes('fém') || lower.includes('fem');
      };

      const matchesFeminin = upcomingMatches.filter(m => isFeminin(m.sportName));
      const matchesMasculin = upcomingMatches.filter(m => !isFeminin(m.sportName));

      // Prendre le premier de chaque catégorie (le plus proche en date)
      setNextMatchFeminin(matchesFeminin.length > 0 ? matchesFeminin[0] : null);
      setNextMatchMasculin(matchesMasculin.length > 0 ? matchesMasculin[0] : null);

    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar('Erreur lors du chargement des données', 3000, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Paris en cours (non résolus)
  const activeBets = bets.filter(bet => !bet.isResolved);
  // Historique (résolus)
  const historyBets = bets.filter(bet => bet.isResolved).slice(0, 3);

  // Formater la date du match
  const formatMatchTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    const timeStr = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    if (isToday) return `Aujourd'hui ${timeStr}`;
    if (isTomorrow) return `Demain ${timeStr}`;
    return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }) + ` ${timeStr}`;
  };

  // Obtenir le label de prédiction
  const getPredictionLabel = (bet) => {
    const winner = bet.predictedWinner;
    const teamOneName = bet.match?.teamOne?.name || 'Équipe 1';
    const teamTwoName = bet.match?.teamTwo?.name || 'Équipe 2';

    if (winner === 'TeamOne') return teamOneName;
    if (winner === 'TeamTwo') return teamTwoName;
    return 'Nul';
  };

  // Composant pour afficher un match highlight
  const MatchHighlight = ({ match, categoryLabel }) => {
    // Cas où il n'y a pas de match à venir
    if (!match) {
      return (
        <Card
          sx={{
            borderRadius: '16px',
            background: `linear-gradient(135deg, ${palette.primary.dark} 0%, rgba(20, 30, 48, 0.95) 100%)`,
            color: 'white',
            overflow: 'hidden',
            height: '100%',
            minHeight: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', mb: 1 }}>
              {categoryLabel}
            </Typography>
            <Typography sx={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)' }}>
              Aucun match à venir
            </Typography>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <Card
        sx={{
          borderRadius: '16px',
          background: `linear-gradient(135deg, ${palette.primary.dark} 0%, rgba(20, 30, 48, 0.95) 100%)`,
          color: 'white',
          overflow: 'hidden',
          height: '100%',
        }}
      >
        <CardContent sx={{ padding: '1.25rem' }}>
          {/* Header du match */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
              {match.sportName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TimeIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }} />
              <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
                {formatMatchTime(match.matchTime)}
              </Typography>
            </Box>
          </Box>

          {/* Équipes */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            {/* Team 1 */}
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Avatar
                src={match.teamOne?.school?.pictureLink}
                sx={{
                  width: 50,
                  height: 50,
                  margin: '0 auto',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: '2px solid rgba(255,255,255,0.2)',
                }}
              >
                {match.teamOne?.name?.[0]}
              </Avatar>
              <Typography sx={{ mt: 1, fontWeight: 'bold', fontSize: '0.85rem' }}>
                {match.teamOne?.school?.name || match.teamOne?.name}
              </Typography>
            </Box>

            {/* VS */}
            <Box sx={{ px: 2 }}>
              <Typography
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  color: palette.primary.red,
                }}
              >
                VS
              </Typography>
            </Box>

            {/* Team 2 */}
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Avatar
                src={match.teamTwo?.school?.pictureLink}
                sx={{
                  width: 50,
                  height: 50,
                  margin: '0 auto',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: '2px solid rgba(255,255,255,0.2)',
                }}
              >
                {match.teamTwo?.name?.[0]}
              </Avatar>
              <Typography sx={{ mt: 1, fontWeight: 'bold', fontSize: '0.85rem' }}>
                {match.teamTwo?.school?.name || match.teamTwo?.name}
              </Typography>
            </Box>
          </Box>

          {/* Bouton Parier */}
          <Button
            fullWidth
            variant="contained"
            startIcon={<CasinoIcon />}
            onClick={() => {
              if (match.sportId) navigate(`/matchs-prono/${match.sportId}`);
            }}
            sx={{
              backgroundColor: palette.primary.red,
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 'bold',
              py: 1,
              '&:hover': {
                backgroundColor: '#b01020',
              },
            }}
          >
            Placer un pari
          </Button>
        </CardContent>
      </Card>
    );
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
            padding: '1.5rem 3rem',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SoccerIcon sx={{ fontSize: 28 }} />
              <Typography
                variant="h5"
                sx={{ fontWeight: 'bold' }}
              >
                <span
                  style={{
                    textDecoration: 'underline',
                    textDecorationColor: palette.primary.red,
                    textDecorationThickness: '3px',
                    textUnderlineOffset: '6px',
                  }}
                >
                  Mon
                </span>{' '}
                Petit Prono
              </Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <StarIcon sx={{ color: '#FFD700', fontSize: 18 }} />
              <Typography sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
                {user?.betPoints || 0}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ padding: '1.5rem 3rem' }}>
          {/* Section Prochains matchs */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: palette.primary.dark,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <TimeIcon sx={{ color: palette.primary.red }} />
            Prochains matchs
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <MatchHighlight match={nextMatchFeminin} categoryLabel="👩 Sport Féminin" />
            </Grid>
            <Grid item xs={12} md={6}>
              <MatchHighlight match={nextMatchMasculin} categoryLabel="👨 Sport Masculin" />
            </Grid>
          </Grid>

          {/* Section Paris + Top 3 */}
          <Grid container spacing={2}>
            {/* Bloc Gauche: Paris en cours + Historique */}
            <Grid item xs={12} md={7}>
              <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: '100%' }}>
                <CardContent sx={{ padding: '1.5rem' }}>
                  {/* Paris en cours */}
                  <Typography sx={{ fontWeight: 'bold', color: palette.primary.dark, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CasinoIcon sx={{ color: palette.primary.main, fontSize: 20 }} />
                    Mes paris en cours
                  </Typography>

                  {activeBets.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 2, color: '#888' }}>
                      <Typography sx={{ fontSize: '0.9rem' }}>Aucun pari en cours</Typography>
                      <Button
                        size="small"
                        sx={{ mt: 1, textTransform: 'none' }}
                        onClick={() => navigate('/mes-pronos')}
                      >
                        Voir les matchs
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                      {activeBets.slice(0, 3).map((bet) => (
                        <Box
                          key={bet.id}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.75rem',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '10px',
                            borderLeft: `3px solid ${palette.primary.main}`,
                          }}
                        >
                          <Box>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '0.85rem', color: palette.primary.dark }}>
                              {bet.match?.teamOne?.name} vs {bet.match?.teamTwo?.name}
                            </Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: '#888' }}>
                              Prono: {getPredictionLabel(bet)}
                            </Typography>
                          </Box>
                          <Chip
                            label="En attente"
                            size="small"
                            sx={{ backgroundColor: '#FFF3E0', color: '#E65100', fontSize: '0.7rem' }}
                          />
                        </Box>
                      ))}
                    </Box>
                  )}

                  <Divider sx={{ my: 2 }} />

                  {/* Historique */}
                  <Typography sx={{ fontWeight: 'bold', color: palette.primary.dark, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    📜 Historique
                  </Typography>

                  {historyBets.length === 0 ? (
                    <Typography sx={{ fontSize: '0.85rem', color: '#888', textAlign: 'center', py: 1 }}>
                      Aucun pari résolu
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {historyBets.map((bet) => (
                        <Box
                          key={bet.id}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.75rem',
                            backgroundColor: bet.isCorrect ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                            borderRadius: '10px',
                            borderLeft: `3px solid ${bet.isCorrect ? '#4CAF50' : '#f44336'}`,
                          }}
                        >
                          <Box>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '0.85rem', color: palette.primary.dark }}>
                              {bet.match?.teamOne?.name} vs {bet.match?.teamTwo?.name}
                            </Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: '#888' }}>
                              {bet.match?.scoreTeamOne} - {bet.match?.scoreTeamTwo}
                            </Typography>
                          </Box>
                          <Typography
                            sx={{
                              fontWeight: 'bold',
                              color: bet.isCorrect ? '#4CAF50' : '#f44336',
                              fontSize: '0.9rem',
                            }}
                          >
                            {bet.isCorrect ? `+${bet.pointsWon}` : '0'} pts
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}

                  <Button
                    fullWidth
                    variant="text"
                    sx={{ mt: 2, textTransform: 'none', color: palette.primary.main }}
                    onClick={() => navigate('/mes-pronos')}
                  >
                    Voir tous mes paris →
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Bloc Droit: Top 3 parieurs */}
            <Grid item xs={12} md={5}>
              <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: '100%' }}>
                <CardContent sx={{ padding: '1.5rem' }}>
                  <Typography sx={{ fontWeight: 'bold', color: palette.primary.dark, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrophyIcon sx={{ color: '#FFD700', fontSize: 20 }} />
                    Top 3 des parieurs
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {leaderboard.map((player, index) => {
                      const medals = ['🥇', '🥈', '🥉'];
                      const bgColors = ['rgba(255, 215, 0, 0.15)', 'rgba(192, 192, 192, 0.15)', 'rgba(205, 127, 50, 0.15)'];
                      
                      return (
                        <Box
                          key={player.userId}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0.75rem 1rem',
                            backgroundColor: bgColors[index],
                            borderRadius: '12px',
                          }}
                        >
                          <Typography sx={{ fontSize: '1.2rem', mr: 1.5 }}>
                            {medals[index]}
                          </Typography>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              backgroundColor: palette.primary.main,
                              fontSize: '0.9rem',
                              mr: 1.5,
                            }}
                          >
                            {player.name?.[0]}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: palette.primary.dark }}>
                              {player.name?.split(' ')[0]}
                            </Typography>
                            <Typography sx={{ fontSize: '0.7rem', color: '#888' }}>
                              {player.school}
                            </Typography>
                          </Box>
                          <Typography sx={{ fontWeight: 'bold', color: palette.primary.dark, fontSize: '0.95rem' }}>
                            {player.betPoints} pts
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>

                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      mt: 3,
                      textTransform: 'none',
                      borderColor: palette.primary.main,
                      color: palette.primary.main,
                      borderRadius: '10px',
                      '&:hover': {
                        backgroundColor: 'rgba(49, 140, 231, 0.1)',
                      },
                    }}
                    onClick={() => navigate('/classement')}
                  >
                    Voir le classement complet
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Navigation rapide */}
          <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {sports.slice(0, 4).map((sport) => (
              <Button
                key={sport.id}
                variant="outlined"
                onClick={() => navigate(`/matchs-prono/${sport.id}`)}
                sx={{
                  textTransform: 'none',
                  borderRadius: '20px',
                  borderColor: '#ddd',
                  color: palette.primary.dark,
                  '&:hover': {
                    borderColor: palette.primary.main,
                    backgroundColor: 'rgba(49, 140, 231, 0.05)',
                  },
                }}
              >
                ⚽ {sport.sport}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AccueilProno;
