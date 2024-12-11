import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import palette from '../../themes/palette';

const Apropos = ({  }) => {

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
          maxWidth: '800px',
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
          Ami footeux, depuis la victoire à la coupe du monde de 98 tu as toujours rêvé de jouer au centre d’entraînement de l’équipe de France ? Le BDS de CentraleSupélec réalise ce rêve et t’emmène au Sixte. Le Sixte est un tournoi de football à 7 étudiants sur les terrains du Centre National d’Entraînement à Clairefontaine. C’est dans ce cadre prestigieux que se retrouvent plus de 400 étudiants venus de toute la France pour un samedi de folie ! Le Sixte accueille pour la cinquième fois un tournoi de football à 7 féminin. Bref, aucune excuse pour ne pas s’inscrire à cette édition qui se déroulera le 10 Février. Le tarif individuel est de 44 euros par personne pour le tournoi et un repas de qualité fourni par les cuisines de Clairefontaine. Cette année, tu pourras (peut-être) visiter le château des Bleus, mais tu auras aussi l’opportunité de visiter le musée des Bleus.
        </Typography>
      </Box>
    </Box>

      </Box>
    )
};


export default Apropos