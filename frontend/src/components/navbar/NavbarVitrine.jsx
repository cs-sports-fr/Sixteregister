// NavbarVitrine.jsx

import React from 'react';
import { Box, Typography, Button } from "@mui/material";

/**
 * Styles for the navigation titles.
 */
const styles = {
    title: {
        color: 'white',
        fontSize: '1rem',
        textTransform: 'uppercase',
        cursor: 'pointer', // Adds a pointer cursor on hover
        textDecoration: 'none', // Removes underline from links
        "&:hover": {
            color: 'primary.main', // Changes color on hover
        },
    }
};


const NavbarVitrine = () => {
    // Define the navigation links within the component
    const navigation = [
        { label: 'Accueil', href: '/' },
        { label: 'Infos Pratiques', href: '/infos' },
        { label: 'Résultat du tournoi', href: '/resultats' },
        { label: 'Galerie Photos', href: '/galerie' },
        { label: 'Nos Partenaires', href: '/partenaires' },
    ];

    return (
        <Box
            sx={{
                position: 'fixed',
                left: 0,
                right: 0,
                zIndex: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 2rem',
                py: '1rem',
                backgroundColor: "secondary.dark",
            }}
        >
            {/* Left Section: Logo */}
            <Box>
                <a href="/">
                    <img
                        src="/images/logo_sixte.png"
                        alt="Logo Toss"
                        width={50}
                        height={50}
                        style={{ display: 'block' }} // Ensures no extra space below the image
                    />
                </a>
            </Box>

            {/* Center Section: Navigation Links */}
            <Box
                sx={{
                    display: 'flex',
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

            {/* Right Section: Register Button */}
            <Box>
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
                        textTransform: 'none', // Keeps the button text as is
                        ":hover": {
                            backgroundColor: 'primary.main', // Darker shade on hover
                            borderColor: 'white',
                        },
                    }}
                >
                    <Typography sx={{ color: 'white', fontSize: '1rem' }}>
                        S'INSCRIRE
                    </Typography>
                </Button>
            </Box>
        </Box>
    );
};

export default NavbarVitrine;
