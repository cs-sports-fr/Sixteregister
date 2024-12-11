import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import palette from '../../themes/palette';
import LayoutUnauthenticated from "../../components/layouts/LayoutUnauthenticated";

const ResultsPage = () => {
    const [selectedYear, setSelectedYear] = useState('2020M');

    const handleYearChange = (year) => {
        setSelectedYear(year);
    };

    const resultsData = {
        "2018M": [
            { rank: "1ÈRE PLACE", team: "Centrale Nantes" },
            { rank: "2NDE PLACE", team: "École Polytechnique" },
            { rank: "3ÈME PLACE", team: "ISEP" },
        ],
        "2018F": [
            { rank: "1ÈRE PLACE", team: "Paris Sciences et Lettres" },
            { rank: "2NDE PLACE", team: "ENTPE" },
            { rank: "3ÈME PLACE", team: "Centrale Nantes" },
        ],
        "2019M": [
            { rank: "1ÈRE PLACE", team: "EFREI" },
            { rank: "2NDE PLACE", team: "HEC" },
            { rank: "3ÈME PLACE", team: "CentraleSupélec" },
        ],
        "2019F": [
            { rank: "1ÈRE PLACE", team: "ENTPE" },
            { rank: "2NDE PLACE", team: "CentraleSupélec" },
            { rank: "3ÈME PLACE", team: "Audencia" },
        ],
        "2020M": [
            { rank: "1ÈRE PLACE", team: "CentraleSupélec" },
            { rank: "2NDE PLACE", team: "Centrale Nantes" },
            { rank: "3ÈME PLACE", team: "HEI" },
        ],
        "2020F": [
            { rank: "1ÈRE PLACE", team: "STAPS Nancy" },
            { rank: "2NDE PLACE", team: "Université PSL" },
            { rank: "3ÈME PLACE", team: "Bordeaux SA" },
        ],
        "2022M": [
            { rank: "1ÈRE PLACE", team: "Mines d'Alès" },
            { rank: "2NDE PLACE", team: "Supméca" },
            { rank: "3ÈME PLACE", team: "Centrale Lille" },
        ],
        "2022F": [
            { rank: "1ÈRE PLACE", team: "Université PSL" },
            { rank: "2NDE PLACE", team: "CentraleSupélec" },
            { rank: "3ÈME PLACE", team: "UBM Foot" },
        ],
        "2023M": [
            { rank: "1ÈRE PLACE", team: "ESSEC" },
            { rank: "2NDE PLACE", team: "IMT Nord Europe" },
            { rank: "3ÈME PLACE", team: "Paris XI" },
        ],
        "2023F": [
            { rank: "1ÈRE PLACE", team: "CentraleSupélec" },
            { rank: "2NDE PLACE", team: "STAPS Nancy" },
            { rank: "3ÈME PLACE", team: "Bordeaux Montaigne" },
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
                    color: 'palette.secondary.dark'
                }}
            >
                Résultats du Sixte
            </Typography>

            {/* Years Navigation */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    backgroundColor: 'palette.secondary.dark',
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
                            color: selectedYear === year ? 'white' : '',
                            backgroundColor: selectedYear === year ? 'palette.primary.main' : 'transparent',
                            borderRadius: '1.5rem',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            textAlign: 'center',
                            transition: 'background-color 0.3s',
                            '&:hover': {
                                backgroundColor: selectedYear === year ? 'palette.primary.main' : '#333333',
                            },
                        }}
                    >
                        {year}
                    </Box>
                ))}
            </Box>

            {/* Results Display */}
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
                        sx={{backgroundColor: 'palette.secondary.dark',
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
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color : 'white'}}>
                            {result.rank}
                        </Typography>
                        <Typography variant="h5" sx={{ color: 'palette.primary.main' }}>
                            {result.team}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </LayoutUnauthenticated>
    );
};

export default ResultsPage;
