import React, { useState } from 'react';
import { Box, Typography, Fade } from '@mui/material';
import palette from '../../themes/palette';
import LayoutUnauthenticated from "../../components/layouts/LayoutUnauthenticated";

const ResultsPage = () => {
    const [selectedYear, setSelectedYear] = useState('2020M');


    const [isFading, setIsFading] = useState(false);
    const handleYearChange = (year) => {
        if (year !== selectedYear) {
            setIsFading(true); // Active le fade-out
            setTimeout(() => {
                setSelectedYear(year); // Change l'année après le fade-out
                setIsFading(false); // Réactive le fade-in
            }, 300); // Durée du fade-out
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
    };
    

    const years = ['2018M', '2018F', '2019M', '2019F', '2020M', '2020F', '2022M', '2022F', '2023M', '2023F'];

    const results = resultsData[selectedYear] || [];

    return (
        <LayoutUnauthenticated>
            {/* Title */}
            <Typography
                sx={{
                    fontSize: { xs: '2rem', md: '3rem', lg: '4rem' },
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginTop: '2rem',
                    marginBottom: '1rem',
                    color: 'secondary.dark'
                }}
            >
                RÉSULTATS DU SIXTE
            </Typography>

            {/* Years Navigation */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    backgroundColor: 'secondary.dark',
                    borderRadius: '2rem',
                    padding: '0.5rem',
                    marginY: '2rem',
                    maxWidth: { xs: '90%', sm: '40rem', lg: '50rem' },
                    marginX: 'auto',
                }}
            >
                {years.map((year) => (
                    <Box
                        key={year}
                        onClick={() => handleYearChange(year)}
                        sx={{
                            paddingX: '1rem',
                            paddingY: '0.5rem',
                            color: selectedYear === year ? 'white' : 'white',
                            backgroundColor: selectedYear === year ? 'primary.main' : 'transparent',
                            borderRadius: '1.5rem',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            textAlign: 'center',
                            transition: 'background-color 0.3s',
                            '&:hover': {
                                backgroundColor: selectedYear === year ? 'primary.main' : 'transparent',
                            },
                        }}
                    >
                        {year}
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
                flexWrap: 'wrap', // Wraps the boxes on smaller screens
                marginTop: '2rem',
            }}
        >
            {results.map((result, index) => (
                <Box
                    key={index}
                    sx={{
                        backgroundColor: 'secondary.dark',
                        color: 'white',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        textAlign: 'center',
                        width: { xs: '70%', sm: '14rem', md: '18rem' }, // Largeur responsive
                        height: { xs: 'auto', sm: '8rem', md: '10rem' }, // Hauteur responsive
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)', // Ombre pour un rendu élégant
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
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
