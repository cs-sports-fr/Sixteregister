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
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  Search as SearchIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import NavbarParticipant from "../components/navbar/NavbarParticipant";
import palette from "../themes/palette";
import { getLeaderboard, getCurrentUser } from "../service/betService";
import { useSnackbar } from "../provider/snackbarProvider";

const ClassementProno = () => {
  const { showSnackbar } = useSnackbar();
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TrophyIcon sx={{ fontSize: 32, color: '#FFD700' }} />
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
                  Class
                </span>
                ement
              </Typography>
            </Box>
            {currentUser && (
              <Box sx={{ 
                backgroundColor: 'rgba(255,255,255,0.1)', 
                padding: '0.5rem 1rem', 
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <StarIcon sx={{ color: '#FFD700', fontSize: 20 }} />
                <Typography sx={{ fontWeight: 'bold' }}>
                  {currentUser.betPoints} pts
                </Typography>
              </Box>
            )}
          </Box>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1rem', mt: 1 }}>
            Top des meilleurs pronostiqueurs
          </Typography>
        </Box>

        {/* Search & Tabs */}
        <Box sx={{ padding: '1.5rem 3rem 0' }}>
          <TextField
            fullWidth
            placeholder="Rechercher un parieur ou une école..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              backgroundColor: 'white',
              borderRadius: '12px',
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#999' }} />
                </InputAdornment>
              ),
            }}
          />
          
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '0.95rem',
                borderRadius: '20px',
                minHeight: '40px',
                mr: 1,
              },
              '& .Mui-selected': {
                backgroundColor: palette.primary.main,
                color: 'white !important',
              },
              '& .MuiTabs-indicator': {
                display: 'none',
              },
            }}
          >
            <Tab label="👤 Parieurs" />
            <Tab label="🏫 Écoles" />
          </Tabs>
        </Box>

        {/* Podium */}
        <Box sx={{ padding: '1.5rem 3rem' }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'flex-end',
            gap: 2,
            mb: 3
          }}>
            {/* 2ème place */}
            {podium[1] && (
              <Box sx={{ textAlign: 'center', order: 1 }}>
                <Avatar
                  sx={{
                    width: 70,
                    height: 70,
                    border: `4px solid ${podiumColors[1]}`,
                    margin: '0 auto',
                    backgroundColor: palette.primary.light,
                    fontSize: '1.5rem',
                  }}
                >
                  {tabValue === 0 ? podium[1].name?.[0] : podium[1].name?.[0]}
                </Avatar>
                <Box
                  sx={{
                    position: 'relative',
                    mt: -1.5,
                    mx: 'auto',
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: podiumColors[1],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    color: '#333',
                  }}
                >
                  2
                </Box>
                <Typography sx={{ fontWeight: 'bold', mt: 1, fontSize: '0.9rem', color: palette.primary.dark }}>
                  {tabValue === 0 ? podium[1].name?.split(' ')[0] : podium[1].name}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#888' }}>
                  {tabValue === 0 ? podium[1].betPoints : podium[1].totalPoints} pts
                </Typography>
              </Box>
            )}

            {/* 1ère place */}
            {podium[0] && (
              <Box sx={{ textAlign: 'center', order: 2 }}>
                <TrophyIcon sx={{ color: podiumColors[0], fontSize: 28, mb: 0.5 }} />
                <Avatar
                  sx={{
                    width: 90,
                    height: 90,
                    border: `4px solid ${podiumColors[0]}`,
                    margin: '0 auto',
                    backgroundColor: palette.primary.main,
                    fontSize: '2rem',
                  }}
                >
                  {tabValue === 0 ? podium[0].name?.[0] : podium[0].name?.[0]}
                </Avatar>
                <Box
                  sx={{
                    position: 'relative',
                    mt: -1.5,
                    mx: 'auto',
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: podiumColors[0],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    color: '#333',
                  }}
                >
                  1
                </Box>
                <Typography sx={{ fontWeight: 'bold', mt: 1, fontSize: '1rem', color: palette.primary.dark }}>
                  {tabValue === 0 ? podium[0].name?.split(' ')[0] : podium[0].name}
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: palette.primary.main, fontWeight: 'bold' }}>
                  {tabValue === 0 ? podium[0].betPoints : podium[0].totalPoints} pts
                </Typography>
              </Box>
            )}

            {/* 3ème place */}
            {podium[2] && (
              <Box sx={{ textAlign: 'center', order: 3 }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    border: `4px solid ${podiumColors[2]}`,
                    margin: '0 auto',
                    backgroundColor: palette.primary.light,
                    fontSize: '1.3rem',
                  }}
                >
                  {tabValue === 0 ? podium[2].name?.[0] : podium[2].name?.[0]}
                </Avatar>
                <Box
                  sx={{
                    position: 'relative',
                    mt: -1.5,
                    mx: 'auto',
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    backgroundColor: podiumColors[2],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.7rem',
                    color: 'white',
                  }}
                >
                  3
                </Box>
                <Typography sx={{ fontWeight: 'bold', mt: 1, fontSize: '0.85rem', color: palette.primary.dark }}>
                  {tabValue === 0 ? podium[2].name?.split(' ')[0] : podium[2].name}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#888' }}>
                  {tabValue === 0 ? podium[2].betPoints : podium[2].totalPoints} pts
                </Typography>
              </Box>
            )}
          </Box>

          {/* Liste des classés */}
          <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ padding: '0 !important' }}>
              <Box sx={{ 
                padding: '1rem 1.5rem', 
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Typography sx={{ fontWeight: 'bold', color: palette.primary.dark }}>
                  {tabValue === 0 ? 'Classement parieurs' : 'Classement écoles'}
                </Typography>
                <StarIcon sx={{ color: '#FFD700', fontSize: 20 }} />
              </Box>

              {/* Liste scrollable */}
              <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
                {restOfList.map((item, index) => {
                  const rank = index + 4;
                  const isCurrentUser = tabValue === 0 && item.userId === currentUser?.id;
                  
                  return (
                    <Box
                      key={tabValue === 0 ? item.userId : item.name}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.75rem 1.5rem',
                        borderBottom: '1px solid #f5f5f5',
                        backgroundColor: isCurrentUser ? 'rgba(49, 140, 231, 0.1)' : 'transparent',
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: isCurrentUser ? 'rgba(49, 140, 231, 0.15)' : '#f9f9f9',
                        },
                      }}
                    >
                      {/* Rang */}
                      <Typography
                        sx={{
                          width: '30px',
                          fontWeight: 'bold',
                          color: isCurrentUser ? palette.primary.main : '#888',
                          fontSize: '0.9rem',
                        }}
                      >
                        {rank}
                      </Typography>

                      {/* Avatar */}
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          backgroundColor: isCurrentUser ? palette.primary.main : palette.primary.light,
                          fontSize: '1rem',
                          mr: 2,
                        }}
                      >
                        {tabValue === 0 ? item.name?.[0] : item.name?.[0]}
                      </Avatar>

                      {/* Nom et école */}
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ 
                          fontWeight: isCurrentUser ? 'bold' : 'medium', 
                          fontSize: '0.9rem',
                          color: isCurrentUser ? palette.primary.main : palette.primary.dark,
                        }}>
                          {tabValue === 0 ? (isCurrentUser ? `${item.name} (Vous)` : item.name) : item.name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#888' }}>
                          {tabValue === 0 ? item.school : `${item.participants} participants`}
                        </Typography>
                      </Box>

                      {/* Points */}
                      <Typography
                        sx={{
                          fontWeight: 'bold',
                          color: isCurrentUser ? palette.primary.main : palette.primary.dark,
                          fontSize: '0.95rem',
                        }}
                      >
                        {tabValue === 0 ? item.betPoints : item.totalPoints}
                        <span style={{ color: '#FFD700', marginLeft: '4px' }}>★</span>
                      </Typography>
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
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'rgba(49, 140, 231, 0.1)',
                    borderTop: '2px dashed #ddd',
                  }}
                >
                  <Typography sx={{ width: '30px', fontWeight: 'bold', color: palette.primary.main }}>
                    {currentUserRank}
                  </Typography>
                  <Avatar sx={{ width: 40, height: 40, backgroundColor: palette.primary.main, mr: 2 }}>
                    {currentUser?.firstname?.[0]}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 'bold', color: palette.primary.main }}>
                      {currentUser?.firstname} {currentUser?.lastname} (Vous)
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#888' }}>
                      {currentUser?.school?.name}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 'bold', color: palette.primary.main }}>
                    {currentUser?.betPoints}
                    <span style={{ color: '#FFD700', marginLeft: '4px' }}>★</span>
                  </Typography>
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
