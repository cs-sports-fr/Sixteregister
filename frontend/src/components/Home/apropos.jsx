import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import palette from '../../themes/palette';

const Apropos = () => {
  const [displayedText, setDisplayedText] = useState('pourquoi'); // 'pourquoi' or 'apropos'

  const handlePourquoiClick = () => {
    setDisplayedText('pourquoi');
  };

  const handleAproposClick = () => {
    setDisplayedText('apropos');
  };

  const pourquoiText = `Ami footeux, depuis la victoire à la coupe du monde de 98 tu as toujours rêvé de jouer au centre d’entrainement de l’équipe de France ?
Le BDS de CentraleSupélec réalise ce rêve et t’emmène au Sixte. Le Sixte est un tournoi de football à 7 étudiants sur les terrains du Centre National
d’Entrainement à Clairefontaine. C’est dans ce cadre prestigieux que se retrouvent plus de 400 étudiants venus de toute la France pour un samedi de folie !
Le Sixte accueille pour la cinquième fois un tournoi de football à 7 féminin. Bref, aucune excuse pour ne pas s’inscrire à cette édition qui se déroulera le 
10 Février. Le tarif individuel est de 44 euros par personne pour le tournoi et un repas de qualité fourni par les cuisines de Clairefontaine.
Cette année, tu pourras (peut-être) visiter le château des Bleus, mais tu auras aussi l'opportunité de visiter le musée des Bleus.`;

  const aproposText = `À tous les passionnés de sport, les amoureux de la compétition et même les sportifs du dimanche,
le Bureau des Sports de CentraleSupélec a tout ce qu’il vous faut pour vous satisfaire. Nous organisons des évènements à destination des étudiants de CS
comme la ROCS avec les Alumnis, le Week-End Sportif et la Bûche. Sensations fortes et rencontres incroyables garanties. Mais ce n’est pas tout, 
notre objectif est également de faire rayonner CS au-delà du campus. Nous organisons ainsi des évènements de plus grande envergure qui accueillent
des étudiants de toute la France et même d’Europe. Avec le Sixte par exemple, nous organisons un tournoi de foot à 7 sur les terrains du Centre National
de Clairefontaine. Enfin, l’évènement phare du BDS accueille plus de 4500 étudiants, ce qui en fait le plus grand tournoi omnisports étudiant de France : le TOSS.
Ce week-end de compétition inoubliable, et la plus grosse soirée de l’année qui va avec, n’attendent que vous !`;

  return (
    <Box sx={{ backgroundColor: 'white' }}>
      <Box
        sx={{
          paddingTop: '5rem',
          alignItems: 'stretch',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          height: '75vh',
        }}
      >
        <img
          src="./public/images/photoaccueil.png"
          alt="BDS"
          style={{
            borderRadius: '0.8rem',
            paddingTop: '2.2rem',
            paddingLeft: '5%',
            height: '50vh',
          }}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignSelf: 'flex-start',
            padding: '2rem',
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
          <Box
            sx={{
              backgroundColor: palette.secondary.dark,
              padding: '2rem',
              borderRadius: '0.2rem',
              maxWidth: '100%',
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
              {/* POURQUOI VENIR BUTTON */}
              <Button
                variant="contained"
                onClick={handlePourquoiClick}
                sx={{
                  backgroundColor:
                    displayedText === 'pourquoi' ? palette.secondary.dark : palette.primary.main,
                  color:
                    displayedText === 'pourquoi' ? palette.primary.main : palette.secondary.light,
                  padding: '0.75rem 1.5rem',
                  '&:hover': {
                    backgroundColor: palette.secondary.dark,
                    color: palette.primary.main,
                  },
                }}
              >
                POURQUOI VENIR ?
              </Button>

              {/* A PROPOS DE NOUS BUTTON */}
              <Button
                variant="contained"
                onClick={handleAproposClick}
                sx={{
                  backgroundColor:
                    displayedText === 'apropos' ? palette.secondary.dark : palette.primary.main,
                  color:
                    displayedText === 'apropos' ? palette.primary.main : palette.secondary.light,
                  padding: '0.75rem 1.5rem',
                  '&:hover': {
                    backgroundColor: palette.secondary.dark,
                    color: palette.primary.main,
                  },
                }}
              >
                A PROPOS DE NOUS
              </Button>
            </Box>
            <Typography
              sx={{
                fontSize: '1rem',
                color: palette.grey[400],
              }}
            >
              {displayedText === 'pourquoi' ? pourquoiText : aproposText}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Apropos;
