import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Avatar,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  Search as SearchIcon,
  Star as StarIcon,
  SportsSoccer as SoccerIcon,
} from "@mui/icons-material";
import NavbarParticipant from "../components/navbar/NavbarParticipant";
import palette from "../themes/palette";
import { getLeaderboard, getCurrentUser } from "../service/betService";
import { useSnackbar } from "../provider/snackbarProvider";

const ClassementProno = () => {
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [schoolLeaderboard, setSchoolLeaderboard] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0); // 0 = Parieurs, 1 = Écoles

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [leaderboardData, userData] = await Promise.all([
        getLeaderboard(500),
        getCurrentUser(),
      ]);

      setLeaderboard(leaderboardData);
      setCurrentUser(userData);
      
      // Calculer le classement par école (somme des points des parieurs par école)
      const schoolMap = {};
      leaderboardData.forEach(user => {
        if (user.school) {
          if (!schoolMap[user.school]) {
            schoolMap[user.school] = { name: user.school, totalPoints: 0, participants: 0 };
          }
          schoolMap[user.school].totalPoints += user.betPoints;
          schoolMap[user.school].participants += 1;
        }
      });
      
      const sortedSchools = Object.values(schoolMap)
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .map((school, index) => ({ ...school, rank: index + 1 }));
      
      setSchoolLeaderboard(sortedSchools);

    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar('Erreur lors du chargement du classement', 3000, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer selon la recherche
  const filteredLeaderboard = leaderboard.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.school && user.school.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredSchools = schoolLeaderboard.filter(school =>
    school.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Trouver le rang de l'utilisateur courant
  const currentUserRank = leaderboard.findIndex(u => u.userId === currentUser?.id) + 1;

  // Les 3 premiers pour le podium
  const podium = tabValue === 0 ? filteredLeaderboard.slice(0, 3) : filteredSchools.slice(0, 3);
  const restOfList = tabValue === 0 ? filteredLeaderboard.slice(3) : filteredSchools.slice(3);

  // Couleurs du podium
  const podiumColors = {
    0: '#FFD700', // Or
    1: '#C0C0C0', // Argent
    2: '#CD7F32', // Bronze
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

  return (
    <>
      <NavbarParticipant />
      <Box
        sx={{
          background: `linear-gradient(135deg, ${palette.primary.dark} 0%, #1a1a2e 100%)`,
          minHeight: '100vh',
          height: '100vh',
          paddingTop: '80px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${palette.primary.red} 0%, #a01020 100%)`,
            padding: { xs: '1.5rem 1rem', lg: '2.5rem 3rem' },
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              right: '-50px',
              top: '-50px',
              width: '200px',
              height: '200px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '50%',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, lg: 2 } }}>
              <TrophyIcon sx={{ fontSize: { xs: 32, lg: 40 }, color: '#FFD700' }} />
              <Typography
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '1.5rem', lg: '2.2rem' },
                }}
              >
                <span
                  style={{
                    textDecoration: 'underline',
                    textDecorationColor: '#FFD700',
                    textDecorationThickness: '4px',
                    textUnderlineOffset: '8px',
                  }}
                >
                  Class
                </span>
                ement
              </Typography>
            </Box>
            {currentUser && (
              <Box sx={{ 
                backgroundColor: 'rgba(255,255,255,0.15)', 
                padding: { xs: '0.4rem 0.8rem', lg: '0.6rem 1.2rem' }, 
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                backdropFilter: 'blur(10px)',
              }}>
                <SoccerIcon sx={{ color: palette.primary.red, fontSize: { xs: 18, lg: 24 } }} />
                <Typography sx={{ fontWeight: 'bold', fontSize: { xs: '0.85rem', lg: '1.1rem' } }}>
                  {currentUser.betPoints} pts
                </Typography>
              </Box>
            )}
          </Box>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: { xs: '0.75rem', lg: '1rem' }, mt: 1 }}>
            Top des meilleurs pronostiqueurs
          </Typography>
        </Box>

        {/* Search & Tabs */}
        <Box sx={{ padding: { xs: '1rem', lg: '1.5rem 3rem 0' } }}>
          <Box sx={{ mb: { xs: 1.5, lg: 2 } }}>
            <TextField
              fullWidth
              placeholder={isMobile ? "Rechercher..." : "Rechercher un parieur ou une école..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  color: 'white',
                  fontSize: { xs: '0.9rem', lg: '1rem' },
                  padding: { xs: '4px 8px', lg: '8px 12px' },
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: palette.primary.red,
                  },
                },
                '& .MuiInputBase-input': {
                  padding: { xs: '10px 8px', lg: '14px 12px' },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(255, 255, 255, 0.5)',
                  opacity: 1,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: { xs: 20, lg: 24 } }} />
                  </InputAdornment>
                ),
              }}
            />
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: { xs: '0.65rem', lg: '0.75rem' }, mt: 0.5, ml: 1 }}>
              🔍 Recherche les scores de tes amis ou des écoles
            </Typography>
          </Box>
          
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: { xs: '0.75rem', lg: '0.95rem' },
                borderRadius: '20px',
                minHeight: { xs: '32px', lg: '40px' },
                minWidth: { xs: '80px', lg: 'auto' },
                mr: 1,
                color: 'rgba(255, 255, 255, 0.7)',
                padding: { xs: '4px 12px', lg: '6px 16px' },
              },
              '& .Mui-selected': {
                backgroundColor: palette.primary.red,
                color: 'white !important',
              },
              '& .MuiTabs-indicator': {
                display: 'none',
              },
            }}
          >
            <Tab label={isMobile ? "👤 Joueurs" : "👤 Parieurs"} />
            <Tab label="🏫 Écoles" />
          </Tabs>
        </Box>

        {/* Podium */}
        <Box sx={{ 
          padding: { xs: '1.5rem 1rem', lg: '2rem 3rem' },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'hidden',
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'flex-end',
            gap: { xs: 2, lg: 4 },
            mb: { xs: 2, lg: 2.5 },
            flexShrink: 0,
          }}>
            {/* 2ème place */}
            {podium[1] && (
              <Box sx={{ textAlign: 'center', order: 1 }}>
                <Avatar
                  sx={{
                    width: { xs: 65, lg: 85 },
                    height: { xs: 65, lg: 85 },
                    border: `4px solid ${podiumColors[1]}`,
                    margin: '0 auto',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    fontSize: { xs: '1.3rem', lg: '1.8rem' },
                    color: 'white',
                  }}
                >
                  {tabValue === 0 ? podium[1].name?.[0] : podium[1].name?.[0]}
                </Avatar>
                <Box
                  sx={{
                    position: 'relative',
                    mt: -1.5,
                    mx: 'auto',
                    width: { xs: 24, lg: 30 },
                    height: { xs: 24, lg: 30 },
                    borderRadius: '50%',
                    backgroundColor: podiumColors[1],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: { xs: '0.75rem', lg: '0.9rem' },
                    color: '#333',
                  }}
                >
                  2
                </Box>
                <Typography sx={{ fontWeight: 'bold', mt: 1, fontSize: { xs: '0.85rem', lg: '1.1rem' }, color: 'white' }}>
                  {tabValue === 0 ? podium[1].name?.split(' ')[0] : (isMobile ? podium[1].name?.slice(0, 8) : podium[1].name)}
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.75rem', lg: '0.95rem' }, color: 'rgba(255,255,255,0.7)' }}>
                  {tabValue === 0 ? podium[1].betPoints : podium[1].totalPoints} pts
                </Typography>
              </Box>
            )}

            {/* 1ère place */}
            {podium[0] && (
              <Box sx={{ textAlign: 'center', order: 2 }}>
                <TrophyIcon sx={{ color: podiumColors[0], fontSize: { xs: 28, lg: 36 }, mb: 0.5 }} />
                <Avatar
                  sx={{
                    width: { xs: 85, lg: 110 },
                    height: { xs: 85, lg: 110 },
                    border: `5px solid ${podiumColors[0]}`,
                    margin: '0 auto',
                    backgroundColor: palette.primary.red,
                    fontSize: { xs: '1.8rem', lg: '2.5rem' },
                    color: 'white',
                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)',
                  }}
                >
                  {tabValue === 0 ? podium[0].name?.[0] : podium[0].name?.[0]}
                </Avatar>
                <Box
                  sx={{
                    position: 'relative',
                    mt: -2,
                    mx: 'auto',
                    width: { xs: 28, lg: 36 },
                    height: { xs: 28, lg: 36 },
                    borderRadius: '50%',
                    backgroundColor: podiumColors[0],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: { xs: '0.85rem', lg: '1rem' },
                    color: '#333',
                    boxShadow: '0 2px 8px rgba(255, 215, 0, 0.5)',
                  }}
                >
                  1
                </Box>
                <Typography sx={{ fontWeight: 'bold', mt: 1, fontSize: { xs: '1rem', lg: '1.3rem' }, color: 'white' }}>
                  {tabValue === 0 ? podium[0].name?.split(' ')[0] : (isMobile ? podium[0].name?.slice(0, 10) : podium[0].name)}
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.85rem', lg: '1.1rem' }, color: '#FFD700', fontWeight: 'bold' }}>
                  {tabValue === 0 ? podium[0].betPoints : podium[0].totalPoints} pts
                </Typography>
              </Box>
            )}

            {/* 3ème place */}
            {podium[2] && (
              <Box sx={{ textAlign: 'center', order: 3 }}>
                <Avatar
                  sx={{
                    width: { xs: 55, lg: 75 },
                    height: { xs: 55, lg: 75 },
                    border: `4px solid ${podiumColors[2]}`,
                    margin: '0 auto',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    fontSize: { xs: '1.1rem', lg: '1.6rem' },
                    color: 'white',
                  }}
                >
                  {tabValue === 0 ? podium[2].name?.[0] : podium[2].name?.[0]}
                </Avatar>
                <Box
                  sx={{
                    position: 'relative',
                    mt: -1.5,
                    mx: 'auto',
                    width: { xs: 22, lg: 28 },
                    height: { xs: 22, lg: 28 },
                    borderRadius: '50%',
                    backgroundColor: podiumColors[2],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: { xs: '0.7rem', lg: '0.85rem' },
                    color: 'white',
                  }}
                >
                  3
                </Box>
                <Typography sx={{ fontWeight: 'bold', mt: 1, fontSize: { xs: '0.8rem', lg: '1rem' }, color: 'white' }}>
                  {tabValue === 0 ? podium[2].name?.split(' ')[0] : (isMobile ? podium[2].name?.slice(0, 8) : podium[2].name)}
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.7rem', lg: '0.85rem' }, color: 'rgba(255,255,255,0.7)' }}>
                  {tabValue === 0 ? podium[2].betPoints : podium[2].totalPoints} pts
                </Typography>
              </Box>
            )}
          </Box>

          {/* Liste des classés */}
          <Card sx={{ 
            borderRadius: '16px', 
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
          }}>
            <CardContent sx={{ padding: '0 !important', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              <Box sx={{ 
                padding: { xs: '0.75rem 1rem', lg: '1rem 1.5rem' }, 
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Typography sx={{ fontWeight: 'bold', color: 'white', fontSize: { xs: '0.9rem', lg: '1.1rem' } }}>
                  {tabValue === 0 ? (isMobile ? 'Classement' : 'Classement parieurs') : (isMobile ? 'Écoles' : 'Classement écoles')}
                </Typography>
                <SoccerIcon sx={{ color: palette.primary.red, fontSize: { xs: 18, lg: 22 } }} />
              </Box>

              {/* Liste scrollable - prend tout l'espace restant */}
              <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
                {restOfList.map((item, index) => {
                  const rank = index + 4;
                  const isCurrentUser = tabValue === 0 && item.userId === currentUser?.id;
                  
                  return (
                    <Box
                      key={tabValue === 0 ? item.userId : item.name}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: { xs: '0.5rem 1rem', lg: '0.75rem 1.5rem' },
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        backgroundColor: isCurrentUser ? 'rgba(207, 20, 39, 0.2)' : 'transparent',
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: isCurrentUser ? 'rgba(207, 20, 39, 0.25)' : 'rgba(255,255,255,0.05)',
                        },
                      }}
                    >
                      {/* Rang */}
                      <Typography
                        sx={{
                          width: { xs: '25px', lg: '30px' },
                          fontWeight: 'bold',
                          color: isCurrentUser ? palette.primary.red : 'rgba(255,255,255,0.6)',
                          fontSize: { xs: '0.75rem', lg: '0.9rem' },
                        }}
                      >
                        {rank}
                      </Typography>

                      {/* Avatar - caché sur mobile */}
                      {!isMobile && (
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            backgroundColor: isCurrentUser ? palette.primary.red : 'rgba(255,255,255,0.1)',
                            fontSize: '0.9rem',
                            mr: 2,
                            color: 'white',
                          }}
                        >
                          {tabValue === 0 ? item.name?.[0] : item.name?.[0]}
                        </Avatar>
                      )}

                      {/* Nom et école */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ 
                          fontWeight: isCurrentUser ? 'bold' : 'medium', 
                          fontSize: { xs: '0.75rem', lg: '0.9rem' },
                          color: isCurrentUser ? palette.primary.red : 'white',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {tabValue === 0 
                            ? (isCurrentUser 
                                ? (isMobile ? `${item.name?.split(' ')[0]} (Vous)` : `${item.name} (Vous)`)
                                : (isMobile ? item.name?.split(' ')[0] : item.name)
                              ) 
                            : (isMobile ? item.name?.slice(0, 15) : item.name)}
                        </Typography>
                        <Typography sx={{ fontSize: { xs: '0.6rem', lg: '0.75rem' }, color: 'rgba(255,255,255,0.5)' }}>
                          {tabValue === 0 
                            ? (isMobile ? item.school?.slice(0, 20) : item.school) 
                            : `${item.participants} participants`}
                        </Typography>
                      </Box>

                      {/* Points */}
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography
                          sx={{
                            fontWeight: 'bold',
                            color: isCurrentUser ? palette.primary.red : 'white',
                            fontSize: { xs: '0.75rem', lg: '0.95rem' },
                          }}
                        >
                          {tabValue === 0 ? item.betPoints : item.totalPoints}
                        </Typography>
                        <SoccerIcon sx={{ color: palette.primary.red, fontSize: { xs: 14, lg: 18 }, ml: 0.5 }} />
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              {/* Position de l'utilisateur courant si pas dans le top affiché */}
              {tabValue === 0 && currentUserRank > 3 && !restOfList.some(u => u.userId === currentUser?.id) && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: { xs: '0.5rem 1rem', lg: '0.75rem 1.5rem' },
                    backgroundColor: 'rgba(207, 20, 39, 0.2)',
                    borderTop: '2px dashed rgba(255,255,255,0.2)',
                  }}
                >
                  <Typography sx={{ 
                    width: { xs: '25px', lg: '30px' }, 
                    fontWeight: 'bold', 
                    color: palette.primary.red,
                    fontSize: { xs: '0.75rem', lg: '0.9rem' },
                  }}>
                    {currentUserRank}
                  </Typography>
                  {!isMobile && (
                    <Avatar sx={{ width: 36, height: 36, backgroundColor: palette.primary.red, mr: 2, color: 'white' }}>
                      {currentUser?.firstname?.[0]}
                    </Avatar>
                  )}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ 
                      fontWeight: 'bold', 
                      color: palette.primary.red,
                      fontSize: { xs: '0.75rem', lg: '0.9rem' },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {isMobile 
                        ? `${currentUser?.firstname} (Vous)` 
                        : `${currentUser?.firstname} ${currentUser?.lastname} (Vous)`}
                    </Typography>
                    <Typography sx={{ fontSize: { xs: '0.6rem', lg: '0.75rem' }, color: 'rgba(255,255,255,0.5)' }}>
                      {isMobile ? currentUser?.school?.name?.slice(0, 20) : currentUser?.school?.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 'bold', color: palette.primary.red, fontSize: { xs: '0.75rem', lg: '0.95rem' } }}>
                      {currentUser?.betPoints}
                    </Typography>
                    <SoccerIcon sx={{ color: palette.primary.red, fontSize: { xs: 14, lg: 18 }, ml: 0.5 }} />
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
};

export default ClassementProno;
