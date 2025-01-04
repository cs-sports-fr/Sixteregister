import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import palette from '../../themes/palette';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';


const PersonCard = ({ name, role, imageSrc }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '30rem',
        height: '20rem',
        overflow: 'hidden',
        boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.2)',
      }}
    >
      <Box
        component="img"
        src={imageSrc}
        alt={name}
        sx={{
          width: '100%',
          objectFit: 'crop',
        }}
      />

      {/* Overlay */}
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
    </Box>
  );
};


const Sixtemen = () => {
  const people = [
    {
      name: 'Alexandru State',
      role: 'Sixteman',
      imageSrc: '/images/photo_alex.jpg', // Ensure the path is correct
    },
    {
      name: 'Garance Asselin',
      role: 'Sixtewoman',
      imageSrc: '/images/photo_garance.jpg', // Ensure the path is correct
    },

  ];

  return (
    <Box sx={{
      mt: '5rem',
      textAlign: 'center',
      width: '100%',
      }}>

    <Typography
          variant="h2"
          sx={{
            fontWeight: 'medium',
            alignSelf: 'flex-start',
            marginBottom: '1rem',
            fontSize: '1.5rem',
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
            fontSize: '3rem',
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
        gap: {xs:'2rem',md:'10rem'},
        width: '100%',
        flexWrap: 'wrap', // Allows wrapping on smaller screens
        padding: '2rem 0',
      }}
    >
      {people.map((person, index) => (
        <PersonCard
          key={index}
          name={person.name}
          role={person.role}
          imageSrc={person.imageSrc}
        />
      ))}
    </Box>
    </Box>
  );
};

export default Sixtemen;