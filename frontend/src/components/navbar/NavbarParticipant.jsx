import React from 'react';
import { Box, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import palette from "../../themes/palette";

const NavbarParticipant = () => {
  const navigate = useNavigate();

  const navigation = [
    { label: 'Mes équipes', href: '/mes-equipes' },
    { label: 'Inscrire une équipe', href: '/inscrire-equipe' },
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: { xs: '0.8rem 1.5rem', md: '1rem 3rem' },
        backgroundColor: palette.primary.dark,
        borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
      }}
    >
      {/* Logo / Titre */}
      <Box
        onClick={() => navigate('/')}
        sx={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <img
          src="/images/logo_sixte252.PNG"
          alt="Logo"
          style={{
            height: '50px',
            display: 'block',
          }}
        />
      </Box>

      {/* Navigation Links */}
      <Box
        sx={{
          display: 'flex',
          gap: { xs: '0.5rem', md: '1rem' },
          alignItems: 'center',
        }}
      >
        {navigation.map((link) => (
          <Button
            key={link.label}
            href={link.href}
            sx={{
              color: 'white',
              fontSize: { xs: '0.75rem', md: '0.9rem' },
              fontWeight: '500',
              textTransform: 'none',
              padding: { xs: '0.4rem 0.8rem', md: '0.5rem 1.2rem' },
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: palette.primary.red,
              },
            }}
          >
            {link.label}
          </Button>
        ))}
        <Button
          href="/"
          sx={{
            color: 'white',
            fontSize: { xs: '0.75rem', md: '0.9rem' },
            fontWeight: '500',
            textTransform: 'none',
            padding: { xs: '0.4rem 0.8rem', md: '0.5rem 1.2rem' },
            borderRadius: '8px',
            border: `1px solid ${palette.primary.red}`,
            backgroundColor: palette.primary.red,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'white',
              color: palette.primary.red,
              borderColor: palette.primary.red,
            },
          }}
        >
          Revenir à l'accueil
        </Button>
      </Box>
    </Box>
  );
};

export default NavbarParticipant;
