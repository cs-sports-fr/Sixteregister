import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  CircularProgress,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  Home as HomeIcon,
  SportsFootball as SportsFootballIcon,
  EmojiEvents as EmojiEventsIcon,
  BarChart as BarChartIcon,
  Person as PersonIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
} from '@mui/icons-material';
import { ApiTossConnected } from '../service/axios';
import palette from '../themes/palette';

const FootballFeminin = () => {
  const [matches, setMatches] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [bottomNav, setBottomNav] = useState(0);
  const matchesPerPage = 3;

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      // Récupérer les matchs de football féminin
      const response = await ApiTossConnected.get('/matches?sport=football&gender=feminin');
      // S'assurer que c'est un tableau
      const matchesData = Array.isArray(response.data) ? response.data : response.data?.matches || [];
      setMatches(matchesData.length > 0 ? matchesData : mockMatches);
    } catch (err) {
      console.error('Erreur lors du chargement des matchs:', err);
      setError('Erreur lors du chargement des matchs');
      // Mock data pour le développement
      setMatches(mockMatches);
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = Array.isArray(matches) ? matches.filter((match) => {
    const query = searchQuery.toLowerCase();
    return (
      match.team1?.name?.toLowerCase().includes(query) ||
      match.team2?.name?.toLowerCase().includes(query) ||
      match.team1?.country?.toLowerCase().includes(query) ||
      match.team2?.country?.toLowerCase().includes(query)
    );
  }) : [];

  const paginatedMatches = filteredMatches.slice(
    currentPage * matchesPerPage,
    (currentPage + 1) * matchesPerPage
  );

  const totalPages = Math.ceil(filteredMatches.length / matchesPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getCountryFlag = (country) => {
    // Retourner le code ISO du pays pour afficher un emoji de drapeau
    const flags = {
      france: '🇫🇷',
      usa: '🇺🇸',
      spain: '🇪🇸',
      germany: '🇩🇪',
      italy: '🇮🇹',
      england: '🇬🇧',
      portugal: '🇵🇹',
      netherlands: '🇳🇱',
      belgium: '🇧🇪',
      sweden: '🇸🇪',
    };
    return flags[country?.toLowerCase()] || '⚽';
  };

  return (
    <Box sx={{ pb: 8, backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ pt: 8, pb: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            sx={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: palette.primary.red,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              mb: 2,
            }}
          >
            Paris en direct
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              color: 'white',
              mb: 1,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
            }}
          >
            Football <span style={{ color: palette.primary.red }}>Féminin</span>
          </Typography>

          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '1rem',
              maxWidth: '600px',
              mx: 'auto',
              mt: 2,
            }}
          >
            Les matchs à venir à Clairefontaine
          </Typography>
        </Box>

          {/* Search Bar */}
          <Box sx={{ mb: 6, maxWidth: '600px', mx: 'auto' }}>
            <TextField
              fullWidth
              placeholder="Rechercher une équipe"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(0);
              }}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: palette.primary.red, mr: 1 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                  },
                  '&:hover fieldset': {
                    borderColor: palette.primary.red,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: palette.primary.red,
                  },
                },
                '& .MuiOutlinedInput-input::placeholder': {
                  color: 'rgba(255, 255, 255, 0.5)',
                  opacity: 1,
                },
              }}
            />
          </Box>
        </Container>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress sx={{ color: palette.primary.red }} />
          </Box>
        )}

        {/* Error State */}
        {error && !loading && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Matches Cards */}
        {!loading && paginatedMatches.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 4, maxWidth: '1000px', mx: 'auto', px: 2 }}>
            {paginatedMatches.map((match) => (
              <Card
                key={match.id}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    borderColor: palette.primary.red,
                    boxShadow: `0 8px 24px rgba(${palette.primary.red}, 0.15)`,
                  },
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  {/* Time Badge */}
                  <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip
                      label={match.time || 'GROUPE A • 15'}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.7rem',
                        fontWeight: '500',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label="VEC"
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '0.7rem',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      />
                      <Chip
                        label="26 02 2026"
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '0.7rem',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Teams */}
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    {/* Team 1 */}
                    <Grid item xs={5}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ fontSize: '3rem', mb: 1 }}>
                          {match.team1?.logo || getCountryFlag(match.team1?.country)}
                        </Box>
                        <Typography
                          sx={{
                            color: 'white',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            mb: 1,
                            textAlign: 'center',
                          }}
                        >
                          {match.team1?.name || 'Équipe 1'}
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: palette.primary.red,
                            color: 'white',
                            width: '100%',
                            textTransform: 'none',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            padding: '8px 0',
                            borderRadius: '8px',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: '#e55a5a',
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          {match.team1?.odds || '2.18'}
                        </Button>
                      </Box>
                    </Grid>

                    {/* VS */}
                    <Grid item xs={2}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '100%',
                        }}
                      >
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.8rem' }}>
                          VS
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Team 2 */}
                    <Grid item xs={5}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ fontSize: '3rem', mb: 1 }}>
                          {match.team2?.logo || getCountryFlag(match.team2?.country)}
                        </Box>
                        <Typography
                          sx={{
                            color: 'white',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            mb: 1,
                            textAlign: 'center',
                          }}
                        >
                          {match.team2?.name || 'Équipe 2'}
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: palette.primary.red,
                            color: 'white',
                            width: '100%',
                            textTransform: 'none',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            padding: '8px 0',
                            borderRadius: '8px',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: '#e55a5a',
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          {match.team2?.odds || '2.96'}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Draw Button */}
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.15)',
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      padding: '8px',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: palette.primary.red,
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: palette.primary.red,
                      },
                    }}
                  >
                    Nul • {match.drawOdds || '3.21'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : !loading && filteredMatches.length === 0 ? (
          <Alert severity="info" sx={{ mt: 4 }}>
            Aucun match ne correspond à votre recherche.
          </Alert>
        ) : null}

        {/* Pagination Controls */}
        {!loading && filteredMatches.length > 0 && totalPages > 1 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 6,
              gap: 3,
              maxWidth: '1000px',
              mx: 'auto',
            }}
          >
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
              variant="outlined"
              startIcon={<NavigateBeforeIcon />}
              sx={{
                color: currentPage === 0 ? 'rgba(255, 255, 255, 0.3)' : 'white',
                borderColor: currentPage === 0 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
              }}
            >
              Précédent
            </Button>

            <Typography sx={{ color: 'white' }}>
              {currentPage + 1} / {totalPages}
            </Typography>

            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              variant="outlined"
              endIcon={<NavigateNextIcon />}
              sx={{
                color: currentPage === totalPages - 1 ? 'rgba(255, 255, 255, 0.3)' : 'white',
                borderColor: currentPage === totalPages - 1 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
              }}
            >
              Suivant
            </Button>
          </Box>
        )}

      {/* Bottom Navigation */}
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#16213e',
          borderTop: `1px solid ${palette.primary.red}`,
        }}
        elevation={3}
      >
        <BottomNavigation
          value={bottomNav}
          onChange={(event, newValue) => {
            setBottomNav(newValue);
          }}
          sx={{
            backgroundColor: '#16213e',
            '& .MuiBottomNavigationAction-root': {
              color: 'rgba(255, 255, 255, 0.5)',
              '&.Mui-selected': {
                color: palette.primary.red,
              },
            },
          }}
        >
          <BottomNavigationAction label="Accueil" icon={<HomeIcon />} />
          <BottomNavigationAction label="Paris" icon={<SportsFootballIcon />} />
          <BottomNavigationAction label="Podium" icon={<EmojiEventsIcon />} />
          <BottomNavigationAction label="Stats" icon={<BarChartIcon />} />
          <BottomNavigationAction label="Profil" icon={<PersonIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

// Mock data pour le développement
const mockMatches = [
  {
    id: 1,
    time: 'GROUPE A • 15',
    date: '26 02 2026',
    team1: {
      name: 'Allemagne',
      country: 'germany',
      logo: '🇩🇪',
      odds: '2.18',
    },
    team2: {
      name: 'Brésil',
      country: 'brazil',
      logo: '🇧🇷',
      odds: '2.96',
    },
    drawOdds: '3.21',
  },
  {
    id: 2,
    time: 'GROUPE A • 17',
    date: '26 02 2026',
    team1: {
      name: 'France',
      country: 'france',
      logo: '🇫🇷',
      odds: '1.85',
    },
    team2: {
      name: 'Espagne',
      country: 'spain',
      logo: '🇪🇸',
      odds: '3.45',
    },
    drawOdds: '3.50',
  },
  {
    id: 3,
    time: 'GROUPE B • 16',
    date: '26 02 2026',
    team1: {
      name: 'USA',
      country: 'usa',
      logo: '🇺🇸',
      odds: '2.40',
    },
    team2: {
      name: 'Pays-Bas',
      country: 'netherlands',
      logo: '🇳🇱',
      odds: '2.75',
    },
    drawOdds: '3.40',
  },
];

export default FootballFeminin;
