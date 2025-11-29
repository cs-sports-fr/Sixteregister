import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText 
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const styles = {
  title: {
    color: 'white',
    fontSize: '1rem',
    fontWeight: '500',
    textTransform: 'uppercase',
    cursor: 'pointer',
    textDecoration: 'none',
    position: 'relative',
    padding: '0.5rem 0',
    transition: 'color 0.3s ease',
    "&:hover": {
      color: 'primary.red',
    },
    "&::after": {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '0%',
      height: '2px',
      backgroundColor: 'primary.red',
      transition: 'width 0.3s ease',
    },
    "&:hover::after": {
      width: '100%',
    },
  },
};

const NavbarVitrine = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigation = [
    { label: 'Infos Pratiques', href: '/infos' },
    { label: 'Résultat du tournoi', href: '/resultats' },
    { label: 'Galerie Photos', href: '/galerie' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: scrolled 
          ? { xs: '0.55rem 1rem', md: '0.6rem 3rem' }
          : { xs: '1.5rem 1rem', md: '2rem 3rem' },
        backgroundColor: "rgba(5, 25, 57, 0.95)",
        backdropFilter: 'blur(10px)',
        boxShadow: scrolled 
          ? '0 4px 20px rgba(0, 0, 0, 0.3)'
          : '0 2px 10px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        borderBottom: scrolled ? 'none' : '1px solid rgba(255, 255, 255, 0.79)',
      }}
    >
      {/* Logo */}
      <Box>
        <a href="/">
          <img
            src="/images/logo_sixte25.PNG"
            alt="Logo"
            width={scrolled ? 45 : 70}
            height={scrolled ? 50 : 90}
            style={{ 
              display: 'block',
              transition: 'width 0.3s ease, height 0.3s ease'
            }}
          />
        </a>
      </Box>

      {/* Center Section: Links (Visible on md and up) */}
      <Box
        sx={{
          display: { xs:'none',sm: 'none', md: 'none',lg:'flex' }, // Hidden on small screens
          gap: '2rem',
          flexGrow: 1,
          justifyContent: 'center',
        }}
      >
        {navigation.map((link) => (
          <Typography
            key={link.label}
            sx={styles.title}
            component="a"
            href={link.href}
          >
            {link.label}
          </Typography>
        ))}
      </Box>

      {/* S'INSCRIRE Button (Visible on md and up) */}
      <Box
        sx={{
          display: {xs:'none',sm: 'none', md: 'none',lg:'flex' }, // Hidden on small screens
        }}
      >
        <Button
          variant="outlined"
          href='/register'
          sx={{
            borderColor: 'primary.white',
            backgroundColor: 'primary.red',
            color: 'white',
            width: '9rem',
            fontWeight: 'bold',
            borderRadius: '25px',
            padding: '0.6rem 1.5rem',
            textTransform: 'uppercase',
            fontSize: '0.9rem',
            letterSpacing: '0.5px',
            boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
            transition: 'all 0.3s ease',
            ":hover": {
              backgroundColor: 'white',
              color: 'primary.red',
              borderColor: 'primary.red',
              boxShadow: '0 6px 20px rgba(255, 107, 107, 0.4)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          S&apos;INSCRIRE
        </Button>
      </Box>

      {/* Hamburger Icon (Visible on xs and sm) */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'flex',lg:'none' }, // Hidden on md and up
          alignItems: 'center',
        }}
      >
        <IconButton
          onClick={toggleDrawer(true)}
        >
          <MenuIcon sx={{ color: 'white',fontSize:'3rem' }}/>
        </IconButton>
      </Box>

      {/* Drawer for Mobile Navigation */}
      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 400}}
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
                      <Typography sx={{ fontWeight: 'bold',fontSize:'2rem',textAlign:'center' }}>
                        {link.label}
                      </Typography>
                    } 
                  />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding sx={{ }}>
            <ListItemButton
                  component="a"
                  href='/register'
                  sx={{
                    textAlign: 'left',
                  }}
                >
                  <ListItemText 
                    primary={
                      <Typography sx={{ fontWeight: 'bold',fontSize:'2rem',textAlign:'center' }}>
                        S'inscrire
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

export default NavbarVitrine;
