import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

const ScrollingImages = () => {
  // Images for the carousel with associated text
  const slides = [
    {
      image: '/images/equipe_etoile.jpg',
      title: 'Samedi 8 Février 2026',
      subtitle: 'TOURNOI DE FOOTBALL À 7',
    },
    {
      image: '/images/entree.jpg',
      title: 'Vivez l\'expérience Clairefontaine',
      subtitle: 'JOUEZ LÀ OÙ LES LÉGENDES SE SONT ENTRAÎNÉES',
    },
    {
      image: '/images/jeu 1.jpg',
      title: 'Affrontez les meilleures écoles',
      subtitle: 'UNE COMPÉTITION INTENSE ET CONVIVIALE',
    },
    {
      image: '/images/coupe.jpg',
      title: 'Des souvenirs inoubliables',
      subtitle: 'REJOIGNEZ L\'AVENTURE DU SIXTE 2026',
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
        height: '80vh',
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
          objectPosition: 'center 50%',
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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <Box
          sx={{
            minHeight: '120px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            mb: 5,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
            {slides[currentIndex].title}
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
            {slides[currentIndex].subtitle}
          </Typography>
        </Box>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
            padding: '1rem 1.5rem',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            minWidth: '500px',
            minHeight: '150px',
          }}
        >
          <Typography 
            sx={{ 
              color: 'white', 
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              fontWeight: '400',
              letterSpacing: '1px',
            }}
          >
            Ouverture des inscriptions le
          </Typography>
          <Typography 
            sx={{ 
              color: 'primary.red',
              fontSize: { xs: '1.5rem', md: '2rem' },
              fontWeight: 'bold',
              textShadow: '0 0 20px rgba(255, 107, 107, 0.5)',
              letterSpacing: '2px',
            }}
          >
            15 DÉCEMBRE 2025
          </Typography>
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
