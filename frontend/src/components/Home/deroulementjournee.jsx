import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import palette from '../../themes/palette';

const Deroulementjournee = () => {
  // Two different sets of activities
  const sportsActivities = [
    { time: '08H00 - 11H30', title: 'Phases de poule' },
    { time: '11H30 - 13H30', title: 'Repas (Cantine de l’EDF)' },
    { time: '13H30 - 18H00', title: 'Phases finales' },
    { time: '13H30 - 18H00', title: 'Tournoi de consolante' },
  ];

  const actiActivities = [
    { time: '08H00 - 17H00', title: "Village d'acti" },
    { time: '11H30 - 13H30', title: 'Visite du vestiaire des bleus' },
    { time: '15H00 - 18H00', title: 'Visite musée des bleus' },
    { time: 'TOUTE LA JOURNEE', title: 'Photos de Clairefontaine' },

  ];

  // Make sure the initial state matches the format you are checking in your toggle.
  const [selectedCategory, setSelectedCategory] = useState('SPORT');

  // Update the logic below to use the same keys ('SPORT' and 'ACTIS')
  const activities = selectedCategory === 'SPORT' ? sportsActivities : actiActivities;

  return (
    <Box id="deroulement" sx={{ height: 'auto', backgroundColor: '#f8f9fa', padding: { xs: '3rem 1rem', md: '5rem 3rem' } }}>
      {/* Header Section */}
      <Box
        sx={{
          textAlign: 'center',
          marginBottom: '4rem',
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: '600',
            marginBottom: '0.5rem',
            fontSize: { xs: '0.9rem', sm: '1rem' },
            textTransform: 'uppercase',
            color: palette.primary.red,
            letterSpacing: '2px',
          }}
        >
          Déroulement de la journée
        </Typography>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '2rem', sm: '3rem' },
            marginBottom: '1rem',
            color: palette.primary.dark,
            textTransform: 'uppercase',
          }}
        >
          Quelles activités puis-je faire ?
        </Typography>

        {/* Toggle Section with Images */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: '1rem', md: '3rem' },
            marginTop: '2rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Left Image - Frappe */}
          <Box
            component="img"
            src="/images/frappe.PNG"
            alt="Sport"
            sx={{
              width: { xs: '80px', md: '120px' },
              height: { xs: '80px', md: '120px' },
              borderRadius: '20px',
              objectFit: 'cover',
              boxShadow: selectedCategory === 'SPORT' 
                ? '0 15px 40px rgba(255, 107, 107, 0.5)' 
                : '0 10px 30px rgba(255, 107, 107, 0.3)',
              border: `3px solid ${palette.primary.red}`,
              transition: 'all 0.3s ease',
              transform: selectedCategory === 'SPORT' 
                ? 'scale(1.15) rotate(-5deg)' 
                : 'scale(1)',
              objectPosition: '35% 90%',
            }}
          />

          {/* Toggle Buttons with Glassmorphism */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(5, 25, 57, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '25px',
              padding: '0.5rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
              border: '2px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* SPORT Button */}
            <Box
              onClick={() => setSelectedCategory('SPORT')}
              sx={{
                cursor: 'pointer',
                borderRadius: '20px',
                paddingX: '2.5rem',
                paddingY: '0.8rem',
                backgroundColor: selectedCategory === 'SPORT' ? palette.primary.red : 'transparent',
                transition: 'all 0.3s ease',
                boxShadow: selectedCategory === 'SPORT' ? '0 4px 15px rgba(255, 107, 107, 0.4)' : 'none',
                '&:hover': {
                  backgroundColor: selectedCategory === 'SPORT' ? palette.primary.red : 'rgba(255, 107, 107, 0.2)',
                },
              }}
            >
              <Typography
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  letterSpacing: '1px',
                }}
              >
                SPORT
              </Typography>
            </Box>

            {/* ACTIS Button */}
            <Box
              onClick={() => setSelectedCategory('ACTIS')}
              sx={{
                cursor: 'pointer',
                borderRadius: '20px',
                paddingX: '2.5rem',
                paddingY: '0.8rem',
                backgroundColor: selectedCategory === 'ACTIS' ? palette.primary.red : 'transparent',
                transition: 'all 0.3s ease',
                boxShadow: selectedCategory === 'ACTIS' ? '0 4px 15px rgba(255, 107, 107, 0.4)' : 'none',
                '&:hover': {
                  backgroundColor: selectedCategory === 'ACTIS' ? palette.primary.red : 'rgba(255, 107, 107, 0.2)',
                },
              }}
            >
              <Typography
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  letterSpacing: '1px',
                }}
              >
                ACTIS
              </Typography>
            </Box>
          </Box>

          {/* Right Image - Red Bull */}
          <Box
            component="img"
            src="/images/redbull.PNG"
            alt="Activités"
            sx={{
              width: { xs: '80px', md: '120px' },
              height: { xs: '80px', md: '120px' },
              borderRadius: '20px',
              objectFit: 'cover',
              boxShadow: selectedCategory === 'ACTIS' 
                ? '0 15px 40px rgba(255, 107, 107, 0.5)' 
                : '0 10px 30px rgba(255, 107, 107, 0.3)',
              border: `3px solid ${palette.primary.red}`,
              transition: 'all 0.3s ease',
              transform: selectedCategory === 'ACTIS' 
                ? 'scale(1.15) rotate(5deg)' 
                : 'scale(1)',
            }}
          />
        </Box>
      </Box>

      {/* Activities Cards with Modern Design */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'column', md: 'column', lg: 'row' }, 
          alignItems: 'stretch',
          justifyContent: 'center', 
          gap: '2rem',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {activities.map((activity, index) => (
          <Box
            key={index}
            sx={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '2.5rem 2rem',
              textAlign: 'center',
              flex: 1,
              minWidth: '250px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
              border: '2px solid transparent',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                background: `linear-gradient(90deg, ${palette.primary.red} 0%, transparent 100%)`,
                transform: 'scaleX(0)',
                transformOrigin: 'left',
                transition: 'transform 0.3s ease',
              },
              '&:hover': {
                transform: 'translateY(-10px)',
                boxShadow: '0 20px 60px rgba(255, 107, 107, 0.2)',
                border: `2px solid ${palette.primary.red}`,
              },
              '&:hover::before': {
                transform: 'scaleX(1)',
              },
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: 'bold',
                marginBottom: '1rem',
                fontSize: '1.1rem',
                color: palette.secondary.main,
                letterSpacing: '0.5px',
              }}
            >
              {activity.time}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: palette.primary.red,
                fontSize: { xs: '1.2rem', md: '1.3rem' },
                lineHeight: 1.3,
              }}
            >
              {activity.title}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Deroulementjournee;
