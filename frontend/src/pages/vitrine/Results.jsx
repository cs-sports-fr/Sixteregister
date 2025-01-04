import React, { useState } from 'react';
import { Box, Typography, Fade, useMediaQuery } from '@mui/material';
import LayoutUnauthenticated from "../../components/layouts/LayoutUnauthenticated";

const ResultsPage = () => {
    const [selectedYear, setSelectedYear] = useState('2020M');
    const [isFading, setIsFading] = useState(false);

    const handleYearChange = (year) => {
        if (year !== selectedYear) {
            setIsFading(true); // Start fade-out
            setTimeout(() => {
                setSelectedYear(year); // Change year after fade-out
                setIsFading(false); // Start fade-in
            }, 300); // Duration of fade-out
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
    };


    const years = ['2018M', '2018F', '2019M', '2019F', '2020M', '2020F', '2022M', '2022F', '2023M', '2023F', '2024M', '2024F'];
    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm')); // Adjust based on your theme

    // Only display the last 4 years on small screens
    const visibleYears = isSmallScreen ? years.slice(-4) : years;

    const results = resultsData[selectedYear] || [];

    return (
        <LayoutUnauthenticated>
            <Box sx={{ height: '20vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography
                    variant="h2"
                    sx={{
                        mt: '8rem',
                        fontWeight: 'bold',
                        fontSize: '3rem',
                        color: 'black',
                        textTransform: 'uppercase',
                    }}
                >
                    Resultats du Sixte
                </Typography>
            </Box>

            {/* Years Navigation */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'secondary.dark',
                    borderRadius: '1.5rem',
                    padding: '0.25rem',
                    width: 'fit-content',
                    marginX: 'auto',
                    marginY: '2rem',
                }}
            >
                {visibleYears.map((year) => (
                    <Box
                        key={year}
                        onClick={() => handleYearChange(year)}
                        sx={{
                            cursor: 'pointer',
                            borderRadius: '1.5rem',
                            paddingX: '1rem',
                            paddingY: '0.5rem',
                            backgroundColor: selectedYear === year ? 'primary.main' : 'transparent',
                            transition: 'background-color 0.3s',
                        }}
                    >
                        <Typography
                            sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                            }}
                        >
                            {year}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* Results Display */}
            <Fade in={!isFading} timeout={300}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '2rem',
                        flexWrap: 'wrap',
                        marginTop: '2rem',
                    }}
                >
                    {results.map((result, index) => (
                        <Box
                            key={index}
                            sx={{
                                mt: '1rem',
                                backgroundColor: 'secondary.dark',
                                color: 'white',
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                textAlign: 'center',
                                width: { xs: '70%', sm: '14rem', md: '18rem' },
                                height: { xs: 'auto', sm: '8rem', md: '10rem' },
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 'medium', color: 'white' }}>
                                {result.rank}
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                {result.team}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Fade>
        </LayoutUnauthenticated>
    );
};

export default ResultsPage;
