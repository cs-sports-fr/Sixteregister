import React, { useState } from 'react';
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
    textTransform: 'uppercase',
    cursor: 'pointer',
    textDecoration: 'none',
    "&:hover": {
      color: 'primary.main',
    },
  },
};

const NavbarVitrine = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigation = [
    { label: 'Infos Pratiques', href: '/infos' },
    { label: 'Résultat du tournoi', href: '/resultats' },
    { label: 'Galerie Photos', href: '/galerie' },
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
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: { xs: '0.55rem', md: '0.6rem 2rem' },
        backgroundColor: "secondary.dark",
      }}
    >
      {/* Logo */}
      <Box>
        <a href="/">
          <img
            src="/images/logo_sixte.png"
            alt="Logo Toss"
            width={50}
            height={50}
            style={{ display: 'block' }}
          />
        </a>
      </Box>

      {/* Center Section: Links (Visible on md and up) */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' }, // Hidden on small screens
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
          display: { xs:'none',sm: 'none', md: 'flex' }, // Hidden on small screens
        }}
      >
        <Button
          variant="outlined"
          href='/register'
          sx={{
            borderColor: 'white',
            backgroundColor: 'primary.main',
            color: 'white',
            width: '8rem',
            fontWeight: 'bold',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            textTransform: 'none',
            ":hover": {
              backgroundColor: 'primary.main',
              borderColor: 'white',
            },
          }}
        >
          S'INSCRIRE
        </Button>
      </Box>

      {/* Hamburger Icon (Visible on xs and sm) */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' }, // Hidden on md and up
          alignItems: 'center',
        }}
      >
        <IconButton
          onClick={toggleDrawer(true)}
          sx={{ color: 'white' }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Drawer for Mobile Navigation */}
      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 250 }}
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
                      <Typography sx={{ fontWeight: 'bold' }}>
                        {link.label}
                      </Typography>
                    } 
                  />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding sx={{ marginTop: '1rem' }}>
              <Button
                variant="outlined"
                href='/register'
                sx={{
                  borderColor: 'white',
                  backgroundColor: 'primary.main',
                  color: 'white',
                  width: '100%',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  textTransform: 'none',
                  ":hover": {
                    backgroundColor: 'primary.main',
                    borderColor: 'white',
                  },
                }}
              >
                S'INSCRIRE
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default NavbarVitrine;
