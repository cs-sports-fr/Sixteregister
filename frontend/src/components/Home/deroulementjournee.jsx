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
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '2rem',
        flexWrap: 'wrap',
        my: '2rem',
        alignItems: 'center',
        width: '100%',
        height: 'auto',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          color: 'white',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'medium',
            alignSelf: 'flex-start',
            marginBottom: '1rem',
            fontSize: { xs: '1.2rem', sm: '1.5rem' },
            textTransform: 'uppercase',
            color: palette.primary.main,
          }}
        >
          Déroulement de la journée
        </Typography>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '2rem', sm: '3rem' },
            alignSelf: 'flex-start',
            marginBottom: '1rem',
            color: 'black',
            textTransform: 'uppercase',
          }}
        >
          Quelles activités puis-je faire ?
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'secondary.dark',
            borderRadius: '1.5rem',
            padding: '0.25rem',
            width: 'fit-content',
            marginX: 'auto',
            marginY: '2rem',
          }}
        >
          {/* SPORT Segment */}
          <Box
            onClick={() => setSelectedCategory('SPORT')}
            sx={{
              cursor: 'pointer',
              borderRadius: '1.5rem',
              paddingX: '1rem',
              paddingY: '0.5rem',
              backgroundColor: selectedCategory === 'SPORT' ? 'primary.main' : 'transparent',
              transition: 'background-color 0.3s',
            }}
          >
            <Typography
              sx={{
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              SPORT
            </Typography>
          </Box>

          {/* ACTIS Segment */}
          <Box
            onClick={() => setSelectedCategory('ACTIS')}
            sx={{
              cursor: 'pointer',
              borderRadius: '1.5rem',
              paddingX: '1rem',
              paddingY: '0.5rem',
              backgroundColor: selectedCategory === 'ACTIS' ? 'primary.main' : 'transparent',
              transition: 'background-color 0.3s',
            }}
          >
            <Typography
              sx={{
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              ACTIS
            </Typography>
          </Box>
        </Box>

        {/* Activities Cards */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'column', md: 'column', lg: 'row' }, alignItems: 'center', justifyContent: 'center', gap: '2rem', mb: 2 }}>
          {activities.map((activity, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: 'secondary.dark',
                color: '#fff',
                borderRadius: '0.2rem',
                padding: '1.5rem',
                textAlign: 'center',
                width: '20rem',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  fontSize: '1.2rem',
                }}
              >
                {activity.time}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  color: 'primary.main',
                }}
              >
                {activity.title}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Deroulementjournee;
