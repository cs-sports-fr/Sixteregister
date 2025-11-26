import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import palette from '../../themes/palette';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';


const PersonCard = ({ name, role, imageSrc, mail }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '30rem',
        height: '20rem',
        overflow: 'hidden',
        boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.2)',
        backgroundColor: 'black',
        '&:hover .mail-overlay': {
          bottom: 0,
        },
      }}
    >
      <Box
        component="img"
        src={imageSrc}
        alt={name}
        sx={{
          width: '70%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: name === 'Laure De Sury D\'Aspremont' ? 'center 30%' : 'center 53%',

        }}
      />

      {/* Overlay principal */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          bgcolor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '1rem',
          textAlign: 'center',
          transition: 'background-color 0.3s',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
          }}
        >
          {name}
        </Typography>
        <Typography
          sx={{
            textTransform: 'uppercase',
            color: 'grey.400',
          }}
        >
          {role}
        </Typography>
      </Box>

      {/* Overlay mail au survol */}
      <Box
        className="mail-overlay"
        sx={{
          position: 'absolute',
          bottom: '-4rem',
          left: 0,
          width: '100%',
          bgcolor: palette.primary.main,
          color: 'white',
          padding: '1rem',
          textAlign: 'center',
          transition: 'bottom 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
        }}
      >
        <EmailIcon />
        <Typography
          component="a"
          href={`mailto:${mail}`}
          sx={{
            color: 'white',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {mail}
        </Typography>
      </Box>
    </Box>
  );
};


const Sixtemen = () => {
  const people = [
    {
      name: 'Mathurin Le Brun',
      role: 'Sixteman',
      imageSrc: '/images/photo_matutu.jpg',
      mail: 'mathurin.lebrun@student-cs.fr' 
    },
    {
      name: 'Laure De Sury D\'Aspremont',
      role: 'Sixtewoman',
      imageSrc: '/images/photo_laure.jpg',
      mail: 'laure.desurydaspermont@student-cs.fr' 
    },

  ];

  return (
    <Box sx={{
      mt: '3rem',
      textAlign: 'center',
      width: '100%',
    }}>

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
        L'équipe
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
        La Sixteam
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: { xs: '2rem', lg: '10rem' },
          width: '100%',
          flexWrap: 'wrap',
          padding: '2rem 0',
        }}
      >
        {people.map((person, index) => (
          <PersonCard
            key={index}
            name={person.name}
            role={person.role}
            imageSrc={person.imageSrc}
            mail={person.mail}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Sixtemen;