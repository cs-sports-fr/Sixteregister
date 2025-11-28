import React, { useState } from 'react';
import { Box, Typography, Fade, useMediaQuery } from '@mui/material';
import LayoutUnauthenticated from "../../components/layouts/LayoutUnauthenticated";
import palette from "../../themes/palette";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const ResultsPage = () => {
    const [selectedYear, setSelectedYear] = useState('2025M');
    const [isFading, setIsFading] = useState(false);

    const handleYearChange = (year) => {
        if (year !== selectedYear) {
            setIsFading(true);
            setTimeout(() => {
                setSelectedYear(year);
                setIsFading(false);
            }, 300);
        }
    };

    const resultsData = {
        "2018M": [
            { rank: "1ÈRE PLACE", team: "CENTRALE NANTES" },
            { rank: "2NDE PLACE", team: "ÉCOLE POLYTECHNIQUE" },
            { rank: "3ÈME PLACE", team: "ISEP" },
        ],
        "2018F": [
            { rank: "1ÈRE PLACE", team: "PARIS SCIENCES ET LETTRES" },
            { rank: "2NDE PLACE", team: "ENTPE" },
            { rank: "3ÈME PLACE", team: "CENTRALE NANTES" },
        ],
        "2019M": [
            { rank: "1ÈRE PLACE", team: "EFREI" },
            { rank: "2NDE PLACE", team: "HEC" },
            { rank: "3ÈME PLACE", team: "CENTRALESUPÉLEC" },
        ],
        "2019F": [
            { rank: "1ÈRE PLACE", team: "ENTPE" },
            { rank: "2NDE PLACE", team: "CENTRALESUPÉLEC" },
            { rank: "3ÈME PLACE", team: "AUDENCIA" },
        ],
        "2020M": [
            { rank: "1ÈRE PLACE", team: "CENTRALESUPÉLEC" },
            { rank: "2NDE PLACE", team: "CENTRALE NANTES" },
            { rank: "3ÈME PLACE", team: "HEI" },
        ],
        "2020F": [
            { rank: "1ÈRE PLACE", team: "STAPS NANCY" },
            { rank: "2NDE PLACE", team: "UNIVERSITÉ PSL" },
            { rank: "3ÈME PLACE", team: "BORDEAUX SA" },
        ],
        "2022M": [
            { rank: "1ÈRE PLACE", team: "MINES D'ALÈS" },
            { rank: "2NDE PLACE", team: "SUPMÉCA" },
            { rank: "3ÈME PLACE", team: "CENTRALE LILLE" },
        ],
        "2022F": [
            { rank: "1ÈRE PLACE", team: "UNIVERSITÉ PSL" },
            { rank: "2NDE PLACE", team: "CENTRALESUPÉLEC" },
            { rank: "3ÈME PLACE", team: "UBM FOOT" },
        ],
        "2023M": [
            { rank: "1ÈRE PLACE", team: "ESSEC" },
            { rank: "2NDE PLACE", team: "IMT NORD EUROPE" },
            { rank: "3ÈME PLACE", team: "PARIS XI" },
        ],
        "2023F": [
            { rank: "1ÈRE PLACE", team: "CENTRALESUPÉLEC" },
            { rank: "2NDE PLACE", team: "STAPS NANCY" },
            { rank: "3ÈME PLACE", team: "BORDEAUX MONTAIGNE" },
        ],
        "2024M": [
            { rank: "1ÈRE PLACE", team: "ESSEC" },
            { rank: "2NDE PLACE", team: "CENTRALE MARSEILLE" },
            { rank: "3ÈME PLACE", team: "PARIS XI" },
        ],
        "2024F": [
            { rank: "1ÈRE PLACE", team: "ESPCI" },
            { rank: "2NDE PLACE", team: "PÔLE LEONARD DE VINCI" },
            { rank: "3ÈME PLACE", team: "BORDEAUX MONTAIGNE" },
        ],
        "2025M": [
            { rank: "1ÈRE PLACE", team: "IFMKNF" },
            { rank: "2NDE PLACE", team: "INSA ROUEN" },
            { rank: "3ÈME PLACE", team: "MINES D'ALES" },
        ],
        "2025F": [
            { rank: "1ÈRE PLACE", team: "PÔLE LEONARD DE VINCI" },
            { rank: "2NDE PLACE", team: "AMOS LILLE" },
            { rank: "3ÈME PLACE", team: "DROIT AIX" },
        ],
    };


    const years = ['2018M', '2018F', '2019M', '2019F', '2020M', '2020F', '2022M', '2022F', '2023M', '2023F', '2024M', '2024F', '2025M', '2025F'];
    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm')); // Adjust based on your theme

    // Only display the last 4 years on small screens
    const visibleYears = isSmallScreen ? years.slice(-4) : years;

    const results = resultsData[selectedYear] || [];

    return (
        <LayoutUnauthenticated>
            {/* Header Section with modern styling */}
            <Box 
                sx={{ 
                    height: 'auto',
                    width: '100%', 
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center',
                    paddingTop: { xs: '10rem', md: '12rem' },
                    paddingBottom: '3rem',
                    textAlign: 'center',
                }}
            >
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
                    Palmarès
                </Typography>
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: 'bold',
                        fontSize: { xs: '2rem', sm: '3rem' },
                        color: palette.primary.dark,
                        textTransform: 'uppercase',
                    }}
                >
                    Résultats du{' '}
                    <Box 
                        component="span" 
                        sx={{ 
                            color: palette.primary.red,
                            textShadow: '0 0 20px rgba(255, 107, 107, 0.3)',
                        }}
                    >
                        SIXTE
                    </Box>
                </Typography>
            </Box>

            {/* Years Navigation with glassmorphism */}
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(5, 25, 57, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    padding: '0.5rem',
                    width: { xs: '95%', sm: 'fit-content' },
                    maxWidth: '95%',
                    marginX: 'auto',
                    marginY: '3rem',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    gap: '0.5rem',
                }}
            >
                {visibleYears.map((year) => (
                    <Box
                        key={year}
                        onClick={() => handleYearChange(year)}
                        sx={{
                            cursor: 'pointer',
                            borderRadius: '15px',
                            paddingX: { xs: '0.8rem', sm: '1rem', md: '1.5rem' },
                            paddingY: { xs: '0.6rem', md: '0.75rem' },
                            backgroundColor: selectedYear === year ? palette.primary.red : 'transparent',
                            transition: 'all 0.3s ease',
                            boxShadow: selectedYear === year ? '0 5px 20px rgba(255, 107, 107, 0.4)' : 'none',
                            '&:hover': {
                                backgroundColor: selectedYear === year ? palette.primary.red : 'rgba(255, 255, 255, 0.1)',
                                transform: 'translateY(-2px)',
                            },
                        }}
                    >
                        <Typography
                            sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                                letterSpacing: '0.5px',
                            }}
                        >
                            {year}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* Results Display with Podium Layout */}
            <Fade in={!isFading} timeout={300}>
                <Box
                    sx={{
                        // background: `linear-gradient(135deg, ${palette.primary.dark} 0%, #0a2540 100%)`,
                        padding: { xs: '4rem 2rem', md: '6rem 4rem' },
                        minHeight: '60vh',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            justifyContent: 'center',
                            alignItems: { xs: 'center', md: 'flex-end' },
                            gap: { xs: '1.5rem', md: '1rem' },
                            maxWidth: '1200px',
                            margin: '0 auto',
                            width: '100%',
                        }}
                    >
                        {results.length >= 3 && (
                            <>
                                {/* 2nd Place - Left */}
                                <Box
                                    sx={{
                                        order: { xs: 2, md: 1 },
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        animation: 'slideInLeft 0.6s ease-out',
                                        '@keyframes slideInLeft': {
                                            '0%': { opacity: 0, transform: 'translateX(-50px)' },
                                            '100%': { opacity: 1, transform: 'translateX(0)' },
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            backgroundColor: 'rgba(192, 192, 192, 0.95)',
                                            backdropFilter: 'blur(10px)',
                                            borderRadius: '20px',
                                            padding: { xs: '2rem 1.5rem', md: '3rem 2rem' },
                                            textAlign: 'center',
                                            width: { xs: '90%', sm: '80%', md: '100%' },
                                            maxWidth: { xs: '350px', md: 'none' },
                                            minHeight: { xs: '180px', md: '280px' },
                                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                                            border: '3px solid rgba(192, 192, 192, 0.5)',
                                            transition: 'all 0.3s ease',
                                            position: 'relative',
                                            '&:hover': {
                                                transform: 'translateY(-10px)',
                                                boxShadow: '0 20px 60px rgba(192, 192, 192, 0.4)',
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '6px',
                                                background: 'linear-gradient(90deg, rgba(192, 192, 192, 1) 0%, transparent 100%)',
                                            },
                                        }}
                                    >
                                        <EmojiEventsIcon sx={{ fontSize: { xs: '3rem', md: '4rem' }, color: '#C0C0C0', marginBottom: '1rem' }} />
                                        <Typography 
                                            variant="h4" 
                                            sx={{ 
                                                fontWeight: 'bold', 
                                                color: '#333',
                                                marginBottom: { xs: '1rem', md: '1.5rem' },
                                                fontSize: { xs: '1.3rem', md: '2rem' },
                                            }}
                                        >
                                            2ÈME
                                        </Typography>
                                        <Typography 
                                            variant="h5" 
                                            sx={{ 
                                                fontWeight: 'bold',
                                                color: palette.primary.dark,
                                                fontSize: { xs: '1rem', md: '1.5rem' },
                                                textTransform: 'uppercase',
                                                lineHeight: 1.3,
                                            }}
                                        >
                                            {results[1]?.team}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* 1st Place - Center (Tallest) */}
                                <Box
                                    sx={{
                                        order: { xs: 1, md: 2 },
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        animation: 'slideInUp 0.6s ease-out',
                                        '@keyframes slideInUp': {
                                            '0%': { opacity: 0, transform: 'translateY(50px)' },
                                            '100%': { opacity: 1, transform: 'translateY(0)' },
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            backgroundColor: 'rgba(255, 215, 0, 0.95)',
                                            backdropFilter: 'blur(10px)',
                                            borderRadius: '20px',
                                            padding: { xs: '2.5rem 1.5rem', md: '3rem 2rem' },
                                            textAlign: 'center',
                                            width: { xs: '90%', sm: '80%', md: '100%' },
                                            maxWidth: { xs: '350px', md: 'none' },
                                            minHeight: { xs: '220px', md: '360px' },
                                            boxShadow: '0 15px 60px rgba(255, 215, 0, 0.5)',
                                            border: '3px solid rgba(255, 215, 0, 0.8)',
                                            transition: 'all 0.3s ease',
                                            position: 'relative',
                                            '&:hover': {
                                                transform: 'translateY(-10px) scale(1.02)',
                                                boxShadow: '0 25px 80px rgba(255, 215, 0, 0.6)',
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '8px',
                                                background: 'linear-gradient(90deg, rgba(255, 215, 0, 1) 0%, transparent 100%)',
                                            },
                                        }}
                                    >
                                        <EmojiEventsIcon sx={{ fontSize: { xs: '3.5rem', md: '5rem' }, color: '#FFD700', marginBottom: '1rem' }} />
                                        <Typography 
                                            variant="h3" 
                                            sx={{ 
                                                fontWeight: 'bold', 
                                                color: '#333',
                                                marginBottom: { xs: '1rem', md: '1.5rem' },
                                                fontSize: { xs: '1.8rem', md: '2.5rem' },
                                            }}
                                        >
                                            1ÈRE
                                        </Typography>
                                        <Typography 
                                            variant="h4" 
                                            sx={{ 
                                                fontWeight: 'bold',
                                                color: palette.primary.dark,
                                                fontSize: { xs: '1.3rem', md: '1.8rem' },
                                                textTransform: 'uppercase',
                                                lineHeight: 1.3,
                                            }}
                                        >
                                            {results[0]?.team}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* 3rd Place - Right */}
                                <Box
                                    sx={{
                                        order: { xs: 3, md: 3 },
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        animation: 'slideInRight 0.6s ease-out',
                                        '@keyframes slideInRight': {
                                            '0%': { opacity: 0, transform: 'translateX(50px)' },
                                            '100%': { opacity: 1, transform: 'translateX(0)' },
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            backgroundColor: 'rgba(205, 127, 50, 0.95)',
                                            backdropFilter: 'blur(10px)',
                                            borderRadius: '20px',
                                            padding: { xs: '2rem 1.5rem', md: '3rem 2rem' },
                                            textAlign: 'center',
                                            width: { xs: '90%', sm: '80%', md: '100%' },
                                            maxWidth: { xs: '350px', md: 'none' },
                                            minHeight: { xs: '180px', md: '240px' },
                                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                                            border: '3px solid rgba(205, 127, 50, 0.5)',
                                            transition: 'all 0.3s ease',
                                            position: 'relative',
                                            '&:hover': {
                                                transform: 'translateY(-10px)',
                                                boxShadow: '0 20px 60px rgba(205, 127, 50, 0.4)',
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '6px',
                                                background: 'linear-gradient(90deg, rgba(205, 127, 50, 1) 0%, transparent 100%)',
                                            },
                                        }}
                                    >
                                        <EmojiEventsIcon sx={{ fontSize: { xs: '3rem', md: '3.5rem' }, color: '#CD7F32', marginBottom: '1rem' }} />
                                        <Typography 
                                            variant="h4" 
                                            sx={{ 
                                                fontWeight: 'bold', 
                                                color: '#333',
                                                marginBottom: { xs: '1rem', md: '1.5rem' },
                                                fontSize: { xs: '1.3rem', md: '2rem' },
                                            }}
                                        >
                                            3ÈME
                                        </Typography>
                                        <Typography 
                                            variant="h5" 
                                            sx={{ 
                                                fontWeight: 'bold',
                                                color: palette.primary.dark,
                                                fontSize: { xs: '1rem', md: '1.5rem' },
                                                textTransform: 'uppercase',
                                                lineHeight: 1.3,
                                            }}
                                        >
                                            {results[2]?.team}
                                        </Typography>
                                    </Box>
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>
            </Fade>
        </LayoutUnauthenticated>
    );
};

export default ResultsPage;
