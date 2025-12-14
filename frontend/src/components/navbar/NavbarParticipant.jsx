import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText,
  Typography 
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import palette from "../../themes/palette";

const NavbarParticipant = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigation = [
    { label: 'Mes équipes', href: '/mes-equipes' },
    { label: 'Inscrire une équipe', href: '/inscrire-equipe' },
  ];

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

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

      {/* Navigation Links - Desktop */}
      <Box
        sx={{
          display: { xs: 'none', md: 'none', lg: 'flex' },
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        {navigation.map((link) => (
          <Button
            key={link.label}
            href={link.href}
            sx={{
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: '500',
              textTransform: 'none',
              padding: '0.5rem 1.2rem',
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
          href="/logout"
          sx={{
            color: 'white',
            fontSize: '0.9rem',
            fontWeight: '500',
            textTransform: 'none',
            padding: '0.5rem 1.2rem',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: palette.primary.red,
            },
          }}
        >
          Se déconnecter
        </Button>
        <Button
          href="/"
          sx={{
            color: 'white',
            fontSize: '0.9rem',
            fontWeight: '500',
            textTransform: 'none',
            padding: '0.5rem 1.2rem',
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

      {/* Hamburger Icon - Mobile */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'flex', lg: 'none' },
          alignItems: 'center',
        }}
      >
        <IconButton onClick={toggleDrawer(true)}>
          <MenuIcon sx={{ color: 'white', fontSize: '3rem' }} />
        </IconButton>
      </Box>

      {/* Drawer for Mobile Navigation */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 400 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '1rem',
            }}
          >
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {navigation.map((link) => (
              <ListItem key={link.label} disablePadding>
                <ListItemButton
                  component="a"
                  href={link.href}
                  sx={{
                    textAlign: 'left',
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: 'bold', fontSize: '2rem', textAlign: 'center' }}>
                        {link.label}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <ListItemButton
                component="a"
                href="/logout"
                sx={{
                  textAlign: 'left',
                }}
              >
                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: 'bold', fontSize: '2rem', textAlign: 'center' }}>
                      Se déconnecter
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component="a"
                href="/"
                sx={{
                  textAlign: 'left',
                }}
              >
                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: 'bold', fontSize: '2rem', textAlign: 'center' }}>
                      Revenir à l'accueil
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default NavbarParticipant;
