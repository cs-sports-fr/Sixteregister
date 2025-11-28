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
        width: { xs: '100%', sm: '28rem', md: '30rem' },
        height: '22rem',
        overflow: 'hidden',
        borderRadius: '25px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
        backgroundColor: 'white',
        transition: 'all 0.3s ease',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        '&:hover': {
          transform: 'translateY(-10px)',
          boxShadow: '0 20px 60px rgba(255, 107, 107, 0.3)',
          border: `2px solid ${palette.primary.red}`,
        },
        '&:hover .mail-overlay': {
          bottom: 0,
        },
        '&:hover .image-container': {
          transform: 'scale(1.05)',
        },
      }}
    >
      {/* Barre rouge en haut */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '4px',
          background: `linear-gradient(90deg, ${palette.primary.red} 0%, transparent 100%)`,
        }}
      />

      <Box
        className="image-container"
        component="img"
        src={imageSrc}
        alt={name}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: name === 'Laure De Sury D\'Aspremont' ? 'center 20%' : 'center 40%',
          transition: 'transform 0.3s ease',
        }}
      />

      {/* Overlay principal avec glassmorphism */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          backgroundColor: 'rgba(5, 25, 57, 0.95)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          padding: '1.5rem',
          textAlign: 'center',
          transition: 'all 0.3s ease',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
            fontWeight: 'bold',
            fontSize: '1.3rem',
            letterSpacing: '1px',
          }}
        >
          {name}
        </Typography>
        <Typography
          sx={{
            textTransform: 'uppercase',
            color: palette.primary.red,
            fontWeight: '600',
            fontSize: '0.95rem',
            letterSpacing: '1.5px',
          }}
        >
          {role}
        </Typography>
      </Box>

      {/* Overlay mail au survol avec style moderne */}
      <Box
        className="mail-overlay"
        sx={{
          position: 'absolute',
          bottom: '-5rem',
          left: 0,
          width: '100%',
          backgroundColor: palette.primary.red,
          color: 'white',
          padding: '1.2rem',
          textAlign: 'center',
          transition: 'bottom 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.8rem',
          boxShadow: '0 -5px 20px rgba(255, 107, 107, 0.4)',
        }}
      >
        <EmailIcon sx={{ fontSize: '1.5rem' }} />
        <Typography
          component="a"
          href={`mailto:${mail}`}
          sx={{
            color: 'white',
            textDecoration: 'none',
            fontWeight: '500',
            fontSize: '0.95rem',
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
      backgroundColor: 'white',
      padding: { xs: '4rem 2rem', md: '5rem 3rem' },
      textAlign: 'center',
      width: '100%',
    }}>

      {/* Header Section */}
      <Box sx={{ marginBottom: '4rem' }}>
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
          L&apos;équipe
        </Typography>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '2rem', sm: '3rem' },
            marginBottom: '1rem',
            color: palette.secondary.dark,
            textTransform: 'uppercase',
          }}
        >
          La{' '}
          <Box 
            component="span" 
            sx={{ 
              color: palette.primary.red,
              textShadow: '0 0 20px rgba(255, 107, 107, 0.3)',
            }}
          >
            SIXTEAM
          </Box>
        </Typography>
      </Box>

      {/* Cards Container */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          justifyContent: 'center',
          alignItems: 'center',
          gap: { xs: '3rem', lg: '4rem' },
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
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