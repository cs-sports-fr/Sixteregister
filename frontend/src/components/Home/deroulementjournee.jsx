import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import palette from '../../themes/palette';

const Deroulementjournee = () => {
  const activities = [
    { time: '08H00 - 12H00', title: 'Phases de poule' },
    { time: '12H00 - 14H00', title: 'Repas (Cantine de l’EDF)' },
    { time: '14H00 - 18H00', title: 'Phases finales' },
    { time: '14H00 - 18H00', title: 'Tournoi de consolante' },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        flexWrap: 'wrap',
        marginTop: '2rem',
      }}
    >
        <Box
           sx={{
             backgroundColor: 'white', // Couleur de fond noire
             color: 'white',
             textAlign: 'center',
             width:'100%',
             boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
           }}
            >
           <Typography
        variant="h2"
        sx={{
          fontWeight: 'bold',
          alignSelf: 'flex-start',
          marginBottom: '1rem',
          fontSize:'1.5rem',
          color: palette.primary.main,
        }}
      >
        Déroulement de la journée
        </Typography>
        <Typography
        variant="h2"
        sx={{
          fontWeight: 'bold',
          fontSize: '3rem',
          alignSelf: 'flex-start',
          marginBottom: '1rem',
          color: 'black',
        }}
      >
        Des activités et du fun à gogo
        </Typography>

      {activities.map((activity, index) => (
        <Box
          key={index}
          sx={{
            backgroundColor: '#212121', // Couleur de fond noire
            color: '#fff',
            borderRadius: '0.2rem',
            padding: '1.5rem',
            textAlign: 'center',
            width: '250px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              fontSize: '1rem',
            }}
          >
            {activity.time}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: '#1565c0', // Couleur bleue pour le texte du titre
            }}
          >

            {activity.title}
          </Typography>
          
        </Box>
      ))}
    </Box>
    </Box>
  )
};


export default Deroulementjournee;

/*const Deroulementjournee = ({  }) => {

    return (
        <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Box
      component="img"
      src="./public/images/photoaccueil.png" 
      alt="BDS"
      sx={{
        width: '30%', 
        height: 'auto',
      }}
    />
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'flex-start',
        padding: '2rem',
        backgroundColor: palette.secondary.light,
        minHeight: '100vh',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          color: palette.primary.main,
          fontWeight: 'bold',
          marginBottom: '1rem',
        }}
      >
        A PROPOS
      </Typography>
      <Typography
        variant="h2"
        sx={{
          fontWeight: 'bold',
          alignSelf: 'flex-start',
          marginBottom: '1rem',
          color: palette.secondary.dark,
        }}
      >
        BIENVENUE SUR LE SITE DU SIXTE!
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: '1.25rem',
          marginBottom: '2rem',
          color: palette.secondary.main,
        }}
      >
        Les inscriptions pour la 28ème édition sont ouvertes jusqu'au 14 Janvier
      </Typography>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          color: palette.secondary.dark,
          marginBottom: '2rem',
        }}
      >
        L’évènement est passé...
      </Typography>
      <Box
        sx={{
          backgroundColor: palette.secondary.dark,
          padding: '2rem',
          borderRadius: '0.2rem',
          maxWidth: '20%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            borderColor: palette.primary.main,
            color: palette.secondary.light,
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: palette.primary.main,
              color: palette.secondary.light,
              padding: '0.75rem 1.5rem',
              '&:hover': {
                backgroundColor: palette.secondary.dark,
                color: palette.primary.main
              },
            }}
          >
            POURQUOI VENIR ?
          </Button>
          <Button
            variant="contained"
            sx={{
              borderColor: palette.primary.main,
              color: palette.secondary.light,
              padding: '0.75rem 1.5rem',
              '&:hover': {
                backgroundColor: palette.secondary.dark,
                color: palette.primary.main
              },
            }}
          >
            A PROPOS DE NOUS
          </Button>
        </Box>
        <Typography
          variant="body2"
          sx={{
            fontSize: '1rem',
            color: palette.secondary.main,
            lineHeight: '1.6',
          }}
        >
          Phase de poule
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: '1rem',
            color: palette.secondary.main,
            lineHeight: '1.6',
          }}
        >
          08h00 - 12h00
        </Typography>
      </Box>
    </Box>

      </Box>
    )
}; */