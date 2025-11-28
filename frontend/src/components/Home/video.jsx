import React, { useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import palette from '../../themes/palette';

const Video = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.currentTime = 2; 
        }
    }, []);

    return (
        <Box
            id="video"
            sx={{
                // background: `linear-gradient(135deg, ${palette.secondary.dark} 0%, #0a2540 100%)`,
                background: 'white',
                padding: { xs: '4rem 2rem', md: '5rem 3rem' },
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Header Section */}
            <Box sx={{ textAlign: 'center', marginBottom: '4rem' }}>
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
                    Récap Sixte 2025
                </Typography>
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: 'bold',
                        fontSize: { xs: '2rem', sm: '3rem' },
                        color: palette.primary.dark,
                        textTransform: 'uppercase',
                        marginBottom: '1rem',
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
                    {' '}ça ressemble à quoi ?
                </Typography>
            </Box>

            {/* Content Container */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: { xs: '3rem', md: '4rem' },
                    maxWidth: '1400px',
                    margin: '0 auto',
                }}
            >
                {/* Video Container with Modern Card Style */}
                <Box
                    sx={{
                        flex: 1,
                        width: '100%',
                        maxWidth: { xs: '100%', md: '600px' },
                    }}
                >
                    <Box
                        sx={{
                            borderRadius: '20px',
                            overflow: 'hidden',
                            boxShadow: '0 20px 60px rgba(255, 107, 107, 0.3)',
                            border: `2px solid ${palette.primary.red}`,
                            backgroundColor: 'black',
                            position: 'relative',
                            '&:hover': {
                                boxShadow: '0 25px 70px rgba(255, 107, 107, 0.4)',
                                transform: 'translateY(-5px)',
                                transition: 'all 0.3s ease',
                            },
                        }}
                    >
                        <video
                            ref={videoRef}
                            style={{
                                width: '100%',
                                display: 'block',
                            }}
                            controls
                            playsInline
                            preload="metadata"
                            controlsList="nodownload"
                        >
                            <source src="/images/recap-sixte.mp4" type="video/mp4" />
                            Votre navigateur ne supporte pas la lecture vidéo.
                        </video>
                    </Box>
                </Box>

                {/* Text Container */}
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: { xs: 'center', md: 'flex-start' },
                        textAlign: { xs: 'center', md: 'left' },
                        color: 'white',
                        maxWidth: { xs: '100%', md: '500px' },
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '20px',
                            padding: '2.5rem',
                            border: '2px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: { xs: '1rem', md: '1.1rem' },
                                lineHeight: 1.8,
                                color: 'white',
                                marginBottom: '2rem',
                            }}
                        >
                            Toutes ces promesses, c&apos;est très bien, mais concrètement à quoi ressemble le SIXTE ?
                            Découvre en vidéo l&apos;ambiance et les moments forts de l&apos;édition précédente !
                        </Typography>

                        <Box
                            sx={{
                                paddingTop: '1.5rem',
                                borderTop: `2px solid ${palette.primary.red}`,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: '0.85rem',
                                    textTransform: 'uppercase',
                                    color: palette.grey[400],
                                    letterSpacing: '1px',
                                    lineHeight: 1.6,
                                }}
                            >
                                Récapitulatif du Sixte 2025 réalisé par l&apos;association Hyris de CentraleSupélec
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Video;
