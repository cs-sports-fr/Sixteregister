import React, { useState } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ScrollingImages = () => {
  const navigate = useNavigate();
  
  // Images for the carousel with associated text
  const slides = [
    {
      image: './public/images/home1.jpg',
      title: '10 Février 2024',
      subtitle: 'TOURNOI DE FOOTBALL À 7',
    },
    {
      image: './public/images/home2.jpg',
      title: '10 Février 2024',
      subtitle: 'LE SIXTE SE DEROULE A CLAIREFONTAINE',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Handlers for navigation
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Image Carousel */}
      <Box
        component="img"
        src={slides[currentIndex].image}
        alt={`carousel-${currentIndex}`}
        sx={{
          width: '100%',
          height: '100vh',
          objectFit: 'cover',
          position: 'absolute',
          zIndex: -2,
        }}
      />

      {/* Dark Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust opacity to control the darkness
          zIndex: -1,
        }}
      />

      {/* Overlay Content */}
      <Box
        sx={{
          textAlign: 'center',
          color: 'white',
          zIndex: 1,
          position: 'relative',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          {slides[currentIndex].title}
        </Typography>
        <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 4 }}>
          {slides[currentIndex].subtitle}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            sx={{
                borderColor: 'white',
              backgroundColor: 'primary.main',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '8px',
              padding: '1.6rem',
              width: '15rem',
              py:"2rem",
              ":hover": {
                backgroundColor: 'primary.main',
                borderColor: 'white',

              },    
            }}
          >
            S'INSCRIRE
          </Button>
          <Button
            variant="outlined"
            sx={{
                borderColor: 'white',

              backgroundColor:'white',
              fontWeight: 'bold',
              borderRadius: '8px',
              padding: '1.6rem',
              width: '15rem',
              py:"2rem",
              fontcolor:'black',
              ":hover": {
                backgroundColor: 'white',
                borderColor: 'white',

              },            
            }}
          >
            <Typography sx={{color:'black',fontWeight:'bold'}}>
            SE CONNECTER
            </Typography>
          </Button>
        </Box>
      </Box>

      {/* Navigation Arrows */}
      <IconButton
        onClick={handlePrev}
        sx={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'white',
          backgroundColor: 'transparent',
          '&:hover': { backgroundColor: 'transparent' },
        }}
      >
        <ArrowBackIos />
      </IconButton>
      <IconButton
        onClick={handleNext}
        sx={{
          position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'white',
          backgroundColor: 'transparent',
          '&:hover': { backgroundColor: 'transparent' },
        }}
      >
        <ArrowForwardIos />
      </IconButton>
    </Box>
  );
};

export default ScrollingImages;