import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Avatar,
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
  Slider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  SportsSoccer as SoccerIcon,
  EmojiEvents as TrophyIcon,
  History as HistoryIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import NavbarParticipant from "../components/navbar/NavbarParticipant";
import palette from "../themes/palette";
import { getMyBets, getLeaderboard, getCurrentUser, getMatchOdds, placeBet } from "../service/betService";
import { ApiTossConnected } from "../service/axios";
import { useSnackbar } from "../provider/snackbarProvider";

const AccueilProno = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [bets, setBets] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [nextMatchesFeminin, setNextMatchesFeminin] = useState([]);
  const [nextMatchesMasculin, setNextMatchesMasculin] = useState([]);
  const [sports, setSports] = useState([]);
  
  // États pour le dialog de pari
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
          const dateDiff = new Date(a.matchTime) - new Date(b.matchTime);
          if (dateDiff !== 0) return dateDiff;
          return a.id - b.id;
        });

      // Séparer les matchs féminins et masculins
      const isFeminin = (sportName) => {
        const lower = sportName?.toLowerCase() || '';
        return lower.includes(' f') || lower.endsWith(' f') || lower.includes('fém') || lower.includes('fem');
      };

      const matchesFeminin = upcomingMatches.filter(m => isFeminin(m.sportName));
      const matchesMasculin = upcomingMatches.filter(m => !isFeminin(m.sportName));

      setNextMatchesFeminin(matchesFeminin.slice(0, 1));
      setNextMatchesMasculin(matchesMasculin.slice(0, 1));

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
      setUser(prev => ({ ...prev, betPoints: result.newBalance }));
      fetchData();
      
    } catch (error) {
      console.error('Error placing bet:', error);
      const message = error.response?.data?.detail || 'Erreur lors du pari';
      showSnackbar(message, 3000, 'error');
    } finally {
      setBetLoading(false);
    }
  };

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

  // Composant pour afficher un match highlight - Style original avec avatars centrés
  const MatchHighlight = ({ match }) => {
    if (!match) {
      return (
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: { xs: '12px', lg: '20px' },
            padding: { xs: '1rem', lg: '1.5rem' },
            textAlign: 'center',
            height: '100%',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography sx={{ fontSize: { xs: '0.85rem', lg: '1rem' }, color: palette.secondary.main }}>
            Aucun match à venir
          </Typography>
        </Box>
      );
    }
    
    return (
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: { xs: '12px', lg: '20px' },
          padding: { xs: '1.25rem', lg: '1.5rem' },
          textAlign: 'center',
          height: '100%',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Heure du match */}
        <Typography sx={{ fontSize: { xs: '2.1rem', lg: '0.7rem' }, color: palette.secondary.main, fontWeight: 'bold', mb: 1 }}>
          {formatMatchTime(match.matchTime)}
        </Typography>

        {/* Équipes */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
          {/* Team 1 */}
          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <Avatar
              src={match.teamOne?.school?.pictureLink}
              sx={{
                width: { xs: 100, lg: 55 },
                height: { xs: 100, lg: 55 },
                margin: '0 auto',
                backgroundColor: palette.primary.dark,
                border: `3px solid ${palette.primary.red}`,
                fontSize: { xs: '2.7rem', lg: '1.2rem' },
              }}
            >
              {match.teamOne?.name?.[0]}
            </Avatar>
            <Typography sx={{ mt: 0.75, fontWeight: 'bold', fontSize: { xs: '2.1rem', lg: '0.8rem' }, color: palette.primary.dark }}>
              {match.teamOne?.school?.name || match.teamOne?.name}
            </Typography>
          </Box>

          {/* VS */}
          <Box sx={{ px: 1.5 }}>
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '2.7rem', lg: '1.1rem' },
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
                width: { xs: 100, lg: 55 },
                height: { xs: 100, lg: 55 },
                margin: '0 auto',
                backgroundColor: palette.primary.dark,
                border: `3px solid ${palette.primary.red}`,
                fontSize: { xs: '2.7rem', lg: '1.2rem' },
              }}
            >
              {match.teamTwo?.name?.[0]}
            </Avatar>
            <Typography sx={{ mt: 0.75, fontWeight: 'bold', fontSize: { xs: '2.1rem', lg: '0.8rem' }, color: palette.primary.dark }}>
              {match.teamTwo?.school?.name || match.teamTwo?.name}
            </Typography>
          </Box>
        </Box>

        {/* Sport + Bouton Parier */}
        <Box sx={{ mt: 1 }}>
          <Typography sx={{ fontSize: { xs: '1.8rem', lg: '0.65rem' }, color: palette.secondary.main, mb: 0.5 }}>
            {match.sportName}
          </Typography>
          <Button
            fullWidth
            size="small"
            variant="contained"
            onClick={() => handleOpenBetDialog(match)}
            sx={{
              backgroundColor: palette.primary.red,
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: { xs: '2.1rem', lg: '0.75rem' },
              py: { xs: 2.5, lg: 0.75 },
              minHeight: { xs: '70px', lg: 'auto' },
              boxShadow: '0 4px 15px rgba(207, 20, 39, 0.3)',
              '&:hover': {
                backgroundColor: '#b01020',
              },
            }}
          >
            Parier
          </Button>
        </Box>
      </Box>
    );
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
          minHeight: { xs: 'calc(100vh - 60px)', lg: '100vh' },
          paddingTop: { xs: '60px', lg: '80px' },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header Section - réduit */}
        <Box
          sx={{
            backgroundColor: palette.primary.dark,
            height: { xs: '10vh', lg: 'auto' },
            minHeight: { xs: '10vh', lg: 'auto' },
            padding: { xs: '0.75rem', lg: '2rem' },
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '3rem', lg: '2.5rem' },
              marginBottom: { xs: '0.3rem', lg: '0.75rem' },
              color: 'white',
              textTransform: 'uppercase',
            }}
          >
            Mon{' '}
            <span style={{ color: palette.primary.red }}>Petit</span>{' '}
            Prono
          </Typography>

          {/* Solde box */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              padding: { xs: '0.5rem 1rem', lg: '0.75rem 1.5rem' },
              borderRadius: '20px',
              border: '2px solid rgba(255,255,255,0.2)',
            }}
          >
            <SoccerIcon sx={{ color: palette.primary.red, fontSize: { xs: 45, lg: 28 }, mr: 0.75 }} />
            <Typography sx={{ fontWeight: 'bold', fontSize: { xs: '2.4rem', lg: '1.5rem' }, color: 'white' }}>
              {user?.betPoints || 0} <span style={{ fontSize: '1.65rem', color: 'rgba(255,255,255,0.7)' }}>crédits</span>
            </Typography>
          </Box>
        </Box>

        {/* Content - Prend le reste de l'écran */}
        <Box 
          sx={{ 
            padding: { xs: '1rem', lg: '2rem' }, 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '1400px',
            margin: '0 auto',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {/* Titre section matchs */}
          <Typography
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '2.4rem', lg: '1.5rem' },
              color: palette.primary.dark,
              textTransform: 'uppercase',
              textAlign: 'center',
              mb: { xs: 1, lg: 2 },
            }}
          >
            Prochains matchs
          </Typography>

          {/* Matchs - Féminin et Masculin côte à côte, 2 matchs empilés dans chaque colonne */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', lg: 'row' },
              gap: { xs: 1, lg: 3 },
              flex: { xs: '1 1 auto', lg: 'none' },
              mb: { xs: 1, lg: 3 },
            }}
          >
            {/* Matchs Féminins - empilés verticalement */}
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: { xs: '2.1rem', lg: '0.85rem' }, color: palette.primary.red, textTransform: 'uppercase', mb: 1 }}>
                 Foot Féminin
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {nextMatchesFeminin.length === 0 ? (
                  <Box sx={{ backgroundColor: 'white', borderRadius: '12px', p: 2, textAlign: 'center' }}>
                    <Typography sx={{ color: palette.secondary.main, fontSize: { xs: '2rem', lg: '0.85rem' } }}>Aucun match à venir</Typography>
                  </Box>
                ) : (
                  nextMatchesFeminin.map((match, index) => (
                    <MatchHighlight key={match.id || index} match={match} />
                  ))
                )}
                <Button
                  variant="text"
                  size="small"
                  onClick={() => navigate('/matchs-prono/all')}
                  sx={{
                    color: palette.primary.red,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: { xs: '2rem', lg: '0.75rem' },
                    mt: 0.5,
                    '&:hover': { backgroundColor: 'rgba(207, 20, 39, 0.08)' },
                  }}
                >
                  Voir tous les matchs →
                </Button>
              </Box>
            </Box>
            
            {/* Matchs Masculins - empilés verticalement */}
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: { xs: '2.1rem', lg: '0.85rem' }, color: palette.primary.red, textTransform: 'uppercase', mb: 1 }}>
                Foot Masculin
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {nextMatchesMasculin.length === 0 ? (
                  <Box sx={{ backgroundColor: 'white', borderRadius: '12px', p: 2, textAlign: 'center' }}>
                    <Typography sx={{ color: palette.secondary.main, fontSize: { xs: '2rem', lg: '0.85rem' } }}>Aucun match à venir</Typography>
                  </Box>
                ) : (
                  nextMatchesMasculin.map((match, index) => (
                    <MatchHighlight key={match.id || index} match={match} />
                  ))
                )}
                <Button
                  variant="text"
                  size="small"
                  onClick={() => navigate('/matchs-prono/all')}
                  sx={{
                    color: palette.primary.red,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: { xs: '2rem', lg: '0.75rem' },
                    mt: 0.5,
                    '&:hover': { backgroundColor: 'rgba(207, 20, 39, 0.08)' },
                  }}
                >
                  Voir tous les matchs →
                </Button>
              </Box>
            </Box>
        </Box>

          {/* Section Top 3 + Historique - empilés verticalement sur mobile */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', lg: 'row' },
              gap: { xs: 1.5, lg: 3 },
              flex: { xs: '0 0 auto', lg: 'none' },
            }}
          >
            {/* Bloc: Top 3 parieurs */}
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  padding: { xs: '1rem', lg: '1.5rem' },
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '4px',
                    background: `linear-gradient(90deg, #FFD700 0%, transparent 100%)`,
                  },
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    color: palette.primary.dark,
                    mb: { xs: 1, lg: 2 },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontSize: { xs: '2.25rem', lg: '1rem' },
                  }}
                >
                  <TrophyIcon sx={{ color: '#FFD700', fontSize: { xs: 42, lg: 20 } }} />
                  {isMobile ? 'Top 3' : 'Top 3 parieurs'}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 0.75, lg: 1.5 } }}>
                  {leaderboard.map((player, index) => {
                    const medals = ['🥇', '🥈', '🥉'];
                    const bgColors = ['rgba(255, 215, 0, 0.15)', 'rgba(192, 192, 192, 0.15)', 'rgba(205, 127, 50, 0.15)'];
                    
                    return (
                      <Box
                        key={player.userId}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: { xs: '0.75rem', lg: '0.75rem 1rem' },
                          backgroundColor: bgColors[index],
                          borderRadius: '12px',
                        }}
                      >
                        <Typography sx={{ fontSize: { xs: '2.4rem', lg: '1.2rem' }, mr: { xs: 1.5, lg: 1.5 } }}>
                          {medals[index]}
                        </Typography>
                        {!isMobile && (
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              backgroundColor: palette.primary.dark,
                              fontSize: '0.9rem',
                              mr: 1.5,
                            }}
                          >
                            {player.name?.[0]}
                          </Avatar>
                        )}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography 
                            sx={{ 
                              fontWeight: 'bold', 
                              fontSize: { xs: '2rem', lg: '0.9rem' }, 
                              color: palette.primary.dark,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {isMobile ? player.name?.split(' ')[0] : player.name?.split(' ')[0]}
                          </Typography>
                          {!isMobile && (
                            <Typography sx={{ fontSize: '0.7rem', color: palette.secondary.main }}>
                              {player.school}
                            </Typography>
                          )}
                        </Box>
                        <Typography sx={{ fontWeight: 'bold', color: palette.primary.dark, fontSize: { xs: '2rem', lg: '0.95rem' } }}>
                          {player.betPoints}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    mt: { xs: 1, lg: 2 },
                    textTransform: 'none',
                    borderColor: '#FFD700',
                    color: 'white',
                    borderRadius: '10px',
                    fontSize: { xs: '2rem', lg: '0.85rem' },
                    py: { xs: 1.5, lg: 1 },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 215, 0, 0.1)',
                      borderColor: '#FFD700',
                    },
                  }}
                  onClick={() => navigate('/classement')}
                >
                  {isMobile ? 'Classement' : 'Voir le classement'}
                </Button>
              </Box>
            </Box>

            {/* Bloc: Historique des paris */}
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  padding: { xs: '1rem', lg: '1.5rem' },
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '4px',
                    background: `linear-gradient(90deg, ${palette.primary.main} 0%, transparent 100%)`,
                  },
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    color: palette.primary.dark,
                    mb: { xs: 1, lg: 2 },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontSize: { xs: '2.25rem', lg: '1rem' },
                  }}
                >
                  <HistoryIcon sx={{ color: palette.primary.main, fontSize: { xs: 42, lg: 20 } }} />
                  {isMobile ? 'Historique' : 'Historique des paris'}
                </Typography>

                {historyBets.length === 0 ? (
                  <Typography sx={{ fontSize: { xs: '2rem', lg: '0.85rem' }, color: palette.secondary.main, textAlign: 'center', py: { xs: 2, lg: 3 } }}>
                    Aucun pari résolu
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 0.75, lg: 1 } }}>
                    {historyBets.map((bet) => (
                      <Box
                        key={bet.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: { xs: '0.5rem', lg: '0.75rem' },
                          backgroundColor: bet.isCorrect ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                          borderRadius: '10px',
                          borderLeft: `3px solid ${bet.isCorrect ? '#4CAF50' : '#f44336'}`,
                        }}
                      >
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography 
                            sx={{ 
                              fontWeight: 'bold', 
                              fontSize: { xs: '2rem', lg: '0.85rem' }, 
                              color: palette.primary.dark,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {isMobile 
                              ? `${bet.match?.teamOne?.name?.slice(0, 3)} vs ${bet.match?.teamTwo?.name?.slice(0, 3)}`
                              : `${bet.match?.teamOne?.name} vs ${bet.match?.teamTwo?.name}`
                            }
                          </Typography>
                          <Typography sx={{ fontSize: { xs: '1.65rem', lg: '0.75rem' }, color: palette.secondary.main }}>
                            {bet.match?.scoreTeamOne} - {bet.match?.scoreTeamTwo}
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            fontWeight: 'bold',
                            color: bet.isCorrect ? '#4CAF50' : '#f44336',
                            fontSize: { xs: '2.1rem', lg: '0.9rem' },
                            ml: 1,
                          }}
                        >
                          {bet.pointsWon > 0 ? `+${bet.pointsWon}` : bet.pointsWon}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                <Button
                  fullWidth
                  variant="text"
                  sx={{ 
                    mt: { xs: 1, lg: 2 }, 
                    textTransform: 'none', 
                    color: 'white',
                    fontSize: { xs: '2rem', lg: '0.9rem' },
                  }}
                  onClick={() => navigate('/mes-pronos')}
                >
                  Voir tout →
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Dialog pour placer un pari */}
      <Dialog
        open={betDialogOpen}
        onClose={() => setBetDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '16px' }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: palette.primary.dark, fontSize: { xs: '1.3rem', lg: '1.25rem' } }}>
          Placer un pari
        </DialogTitle>
        <DialogContent>
          {selectedMatch && (
            <Box sx={{ mb: 3 }}>
              <Typography color="text.secondary" sx={{ mb: 1, fontSize: { xs: '1rem', lg: '0.875rem' } }}>
                {selectedMatch.sportName || 'Match'}
              </Typography>
              <Typography sx={{ fontWeight: 'bold', fontSize: { xs: '1.2rem', lg: '1.25rem' } }}>
                {selectedMatch.teamOne?.school?.name || selectedMatch.teamOne?.name || 'Équipe 1'} vs {selectedMatch.teamTwo?.school?.name || selectedMatch.teamTwo?.name || 'Équipe 2'}
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: { xs: '1rem', lg: '0.875rem' } }}>
                {selectedMatch.matchTime
                  ? new Date(selectedMatch.matchTime).toLocaleString('fr-FR')
                  : 'Date à définir'}
              </Typography>
            </Box>
          )}

          {/* Slider de mise avec boutons +/- */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ mb: 1, fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', fontSize: { xs: '1.1rem', lg: '0.875rem' } }}>
              <span>Votre mise</span>
              <span style={{ color: palette.primary.red }}>{betData.stake} / {user?.betPoints || 0} crédits</span>
            </Typography>
            
            {/* Boutons +/- */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
              <Button
                variant="contained"
                onClick={() => setBetData({ ...betData, stake: Math.max(0, betData.stake - 10) })}
                sx={{ 
                  minWidth: { xs: 48, lg: 44 }, 
                  width: { xs: 48, lg: 44 }, 
                  height: { xs: 48, lg: 44 }, 
                  borderRadius: '50%', 
                  backgroundColor: palette.primary.dark, 
                  fontSize: { xs: '1.2rem', lg: '1rem' },
                  '&:hover': { backgroundColor: '#333' } 
                }}
              >
                <RemoveIcon sx={{ fontSize: { xs: 24, lg: 20 } }} />
              </Button>
              <Typography sx={{ 
                fontSize: { xs: '1.8rem', lg: '1.5rem' }, 
                fontWeight: 'bold', 
                minWidth: { xs: 80, lg: 60 }, 
                textAlign: 'center', 
                color: palette.primary.dark 
              }}>
                {betData.stake}
              </Typography>
              <Button
                variant="contained"
                onClick={() => setBetData({ ...betData, stake: Math.min(user?.betPoints || 0, betData.stake + 10) })}
                sx={{ 
                  minWidth: { xs: 48, lg: 44 }, 
                  width: { xs: 48, lg: 44 }, 
                  height: { xs: 48, lg: 44 }, 
                  borderRadius: '50%', 
                  backgroundColor: palette.primary.red, 
                  fontSize: { xs: '1.2rem', lg: '1rem' },
                  '&:hover': { backgroundColor: '#b01020' } 
                }}
              >
                <AddIcon sx={{ fontSize: { xs: 24, lg: 20 } }} />
              </Button>
            </Box>

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
                  width: { xs: 24, lg: 20 },
                  height: { xs: 24, lg: 20 },
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: `0px 0px 0px 8px rgba(208, 32, 47, 0.16)`,
                  },
                },
                '& .MuiSlider-rail': {
                  height: { xs: 8, lg: 4 },
                },
                '& .MuiSlider-track': {
                  height: { xs: 8, lg: 4 },
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
              <Typography sx={{ fontSize: { xs: '0.9rem', lg: '0.75rem' } }} color="text.secondary">0</Typography>
              <Typography sx={{ fontSize: { xs: '0.9rem', lg: '0.75rem' } }} color="text.secondary">Max: {user?.betPoints || 0}</Typography>
            </Box>
          </Box>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel sx={{ fontSize: { xs: '1.1rem', lg: '1rem' } }}>Votre pronostic</InputLabel>
            <Select
              value={betData.predictedWinner}
              onChange={(e) => setBetData({ ...betData, predictedWinner: e.target.value })}
              label="Votre pronostic"
              sx={{ fontSize: { xs: '1.1rem', lg: '1rem' } }}
            >
              <MenuItem value="TeamOne" sx={{ fontSize: { xs: '1.1rem', lg: '1rem' } }}>
                {selectedMatch?.teamOne?.school?.name || selectedMatch?.teamOne?.name || 'Équipe 1'} 
                {matchOdds && ` (Cote: ${matchOdds.odds?.teamOne?.toFixed(2)})`}
              </MenuItem>
              <MenuItem value="Draw" sx={{ fontSize: { xs: '1.1rem', lg: '1rem' } }}>
                Match nul
                {matchOdds && ` (Cote: ${matchOdds.odds?.draw?.toFixed(2)})`}
              </MenuItem>
              <MenuItem value="TeamTwo" sx={{ fontSize: { xs: '1.1rem', lg: '1rem' } }}>
                {selectedMatch?.teamTwo?.school?.name || selectedMatch?.teamTwo?.name || 'Équipe 2'}
                {matchOdds && ` (Cote: ${matchOdds.odds?.teamTwo?.toFixed(2)})`}
              </MenuItem>
            </Select>
          </FormControl>

          <Typography sx={{ mb: 1, fontWeight: 'bold', fontSize: { xs: '1.1rem', lg: '0.875rem' } }}>
            Score prédit (optionnel, bonus jusqu'à +100% de la mise si exact)
          </Typography>
          
          {/* Score prédit avec boutons +/- */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: { xs: 1, lg: 2 }, mb: 2 }}>
            {/* Score Équipe 1 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography sx={{ 
                mb: 0.5, 
                fontWeight: 'bold', 
                color: palette.primary.dark, 
                textAlign: 'center', 
                maxWidth: { xs: 80, lg: 100 }, 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                whiteSpace: 'nowrap',
                fontSize: { xs: '0.85rem', lg: '0.75rem' },
              }}>
                {selectedMatch?.teamOne?.school?.name?.split(' ')[0] || selectedMatch?.teamOne?.name?.split(' ')[0] || 'Équipe 1'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, lg: 1 } }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setBetData({ ...betData, predictedScoreTeamOne: Math.max(0, (parseInt(betData.predictedScoreTeamOne) || 0) - 1).toString() })}
                  sx={{ 
                    minWidth: { xs: 36, lg: 36 }, 
                    width: { xs: 36, lg: 36 }, 
                    height: { xs: 36, lg: 36 }, 
                    borderRadius: '50%', 
                    backgroundColor: palette.primary.dark, 
                    '&:hover': { backgroundColor: '#333' } 
                  }}
                >
                  <RemoveIcon sx={{ fontSize: { xs: 18, lg: 20 } }} />
                </Button>
                <Typography sx={{ 
                  fontSize: { xs: '1.4rem', lg: '1.5rem' }, 
                  fontWeight: 'bold', 
                  minWidth: { xs: 35, lg: 40 }, 
                  textAlign: 'center', 
                  color: palette.primary.dark 
                }}>
                  {betData.predictedScoreTeamOne || '0'}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setBetData({ ...betData, predictedScoreTeamOne: ((parseInt(betData.predictedScoreTeamOne) || 0) + 1).toString() })}
                  sx={{ 
                    minWidth: { xs: 36, lg: 36 }, 
                    width: { xs: 36, lg: 36 }, 
                    height: { xs: 36, lg: 36 }, 
                    borderRadius: '50%', 
                    backgroundColor: palette.primary.red, 
                    '&:hover': { backgroundColor: '#b01020' } 
                  }}
                >
                  <AddIcon sx={{ fontSize: { xs: 18, lg: 20 } }} />
                </Button>
              </Box>
            </Box>

            <Typography sx={{ 
              fontSize: { xs: '1.2rem', lg: '1.2rem' }, 
              fontWeight: 'bold', 
              color: palette.secondary.main, 
              mx: { xs: 0.5, lg: 1 } 
            }}>-</Typography>

            {/* Score Équipe 2 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography sx={{ 
                mb: 0.5, 
                fontWeight: 'bold', 
                color: palette.primary.dark, 
                textAlign: 'center', 
                maxWidth: { xs: 80, lg: 100 }, 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                whiteSpace: 'nowrap',
                fontSize: { xs: '0.85rem', lg: '0.75rem' },
              }}>
                {selectedMatch?.teamTwo?.school?.name?.split(' ')[0] || selectedMatch?.teamTwo?.name?.split(' ')[0] || 'Équipe 2'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, lg: 1 } }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setBetData({ ...betData, predictedScoreTeamTwo: Math.max(0, (parseInt(betData.predictedScoreTeamTwo) || 0) - 1).toString() })}
                  sx={{ 
                    minWidth: { xs: 36, lg: 36 }, 
                    width: { xs: 36, lg: 36 }, 
                    height: { xs: 36, lg: 36 }, 
                    borderRadius: '50%', 
                    backgroundColor: palette.primary.dark, 
                    '&:hover': { backgroundColor: '#333' } 
                  }}
                >
                  <RemoveIcon sx={{ fontSize: { xs: 18, lg: 20 } }} />
                </Button>
                <Typography sx={{ 
                  fontSize: { xs: '1.4rem', lg: '1.5rem' }, 
                  fontWeight: 'bold', 
                  minWidth: { xs: 35, lg: 40 }, 
                  textAlign: 'center', 
                  color: palette.primary.dark 
                }}>
                  {betData.predictedScoreTeamTwo || '0'}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setBetData({ ...betData, predictedScoreTeamTwo: ((parseInt(betData.predictedScoreTeamTwo) || 0) + 1).toString() })}
                  sx={{ 
                    minWidth: { xs: 36, lg: 36 }, 
                    width: { xs: 36, lg: 36 }, 
                    height: { xs: 36, lg: 36 }, 
                    borderRadius: '50%', 
                    backgroundColor: palette.primary.red, 
                    '&:hover': { backgroundColor: '#b01020' } 
                  }}
                >
                  <AddIcon sx={{ fontSize: { xs: 18, lg: 20 } }} />
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Affichage des gains potentiels */}
          {betData.stake > 0 && betData.predictedWinner && matchOdds && (
            <Alert severity="success" sx={{ mb: 2, fontSize: { xs: '1rem', lg: '0.875rem' } }}>
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

          {matchOdds && (
            <Alert severity="info" sx={{ fontSize: { xs: '1rem', lg: '0.875rem' } }}>
              <strong>Cotes actuelles:</strong><br />
              {selectedMatch?.teamOne?.school?.name || selectedMatch?.teamOne?.name}: {matchOdds.odds?.teamOne?.toFixed(2)} | 
              Nul: {matchOdds.odds?.draw?.toFixed(2)} | 
              {selectedMatch?.teamTwo?.school?.name || selectedMatch?.teamTwo?.name}: {matchOdds.odds?.teamTwo?.toFixed(2)}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2.5, lg: 2 } }}>
          <Button onClick={() => setBetDialogOpen(false)} sx={{ fontSize: { xs: '1.1rem', lg: '0.875rem' }, py: { xs: 1.25, lg: 0.75 } }}>
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={handlePlaceBet}
            disabled={betLoading || !betData.predictedWinner || betData.stake <= 0}
            sx={{
              backgroundColor: palette.primary.red,
              '&:hover': { backgroundColor: '#b01020' },
              fontSize: { xs: '1.1rem', lg: '0.875rem' },
              py: { xs: 1.25, lg: 0.75 },
              px: { xs: 3, lg: 2 },
            }}
          >
            {betLoading ? 'En cours...' : `Miser ${betData.stake} crédits`}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AccueilProno;
