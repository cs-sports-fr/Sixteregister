import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import palette from '../../themes/palette';

import StarRoundedIcon from '@mui/icons-material/StarRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';

const Statistics = ({ }) => {
    const stats = [
        { icon: <StarRoundedIcon sx={{ fontSize: '3rem' }} />, label: 'ÉDITION', value: '30' },
        { icon: <GroupsRoundedIcon sx={{ fontSize: '3rem' }} />, label: 'NOTRE EFFECTIF', value: '42' },
        { icon: <CheckRoundedIcon sx={{ fontSize: '3rem' }} />, label: 'ÉQUIPES AYANT PARTICIPÉ', value: '946' },
        { icon: <EmojiEventsRoundedIcon sx={{ fontSize: '3rem' }} />, label: 'PARTICIPANTS', value: '450' },
    ];

    return (
        <Box
            sx={{
                // background: `linear-gradient(135deg, ${palette.primary.dark} 0%, #0a2540 100%)`,
                background: 'white',
                padding: { xs: '4rem 2rem', md: '5rem 3rem' },
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Header Section */}
            <Box
                sx={{
                    textAlign: 'center',
                    marginBottom: '4rem',
                }}
            >
                {/* <Typography
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
                    Nos chiffres
                </Typography> */}
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: 'bold',
                        fontSize: { xs: '2rem', sm: '3rem' },
                        color: palette.primary.dark,
                        textTransform: 'uppercase',
                    }}
                >
                    Le{' '}
                    <Box 
                        component="span" 
                        sx={{ 
                            color: palette.primary.red,
                            textShadow: '0 0 20px rgba(255, 107, 107, 0.4)',
                        }}
                    >
                        SIXTE
                    </Box>
                    {' '}en quelques chiffres
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { 
                        xs: 'repeat(2, 1fr)', 
                        sm: 'repeat(2, 1fr)', 
                        md: 'repeat(4, 1fr)' 
                    },
                    gap: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                    maxWidth: '1400px',
                    margin: '0 auto',
                }}
            >
                {stats.map((stat, index) => (
                    <Box
                        key={index}
                        sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '20px',
                            padding: { xs: '2rem 1.5rem', md: '2.5rem 2rem' },
                            textAlign: 'center',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                            transition: 'all 0.3s ease',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '4px',
                                background: `linear-gradient(90deg, ${palette.primary.red} 0%, transparent 100%)`,
                                transform: 'scaleX(0)',
                                transformOrigin: 'left',
                                transition: 'transform 0.3s ease',
                            },
                            '&:hover': {
                                transform: 'translateY(-10px)',
                                boxShadow: '0 20px 60px rgba(255, 107, 107, 0.3)',
                                border: `2px solid ${palette.primary.red}`,
                            },
                            '&:hover::before': {
                                transform: 'scaleX(1)',
                            },
                        }}
                    >
                        {/* Icon Circle */}
                        <Box
                            sx={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                backgroundColor: palette.primary.red,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: '0 auto 1.5rem',
                                boxShadow: '0 8px 25px rgba(255, 107, 107, 0.4)',
                                transition: 'all 0.3s ease',
                                color: 'white',
                                '&:hover': {
                                    transform: 'scale(1.1) rotate(10deg)',
                                    boxShadow: '0 12px 35px rgba(255, 107, 107, 0.6)',
                                },
                            }}
                        >
                            {stat.icon}
                        </Box>

                        {/* Label */}
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 'bold',
                                marginBottom: '0.8rem',
                                fontSize: '0.9rem',
                                color: palette.secondary.main,
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                            }}
                        >
                            {stat.label}
                        </Typography>

                        {/* Value */}
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 'bold',
                                fontSize: { xs: '3rem', md: '3.5rem' },
                                color: palette.primary.red,
                                lineHeight: 1,
                                textShadow: '0 2px 10px rgba(255, 107, 107, 0.2)',
                            }}
                        >
                            {stat.value}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    )
};


export default Statistics
