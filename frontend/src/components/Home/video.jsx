import React, { useRef, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import palette from '../../themes/palette';

const Video = ({ }) => {
    const videoRef = useRef(null);

    const handleMouseEnter = () => {
        if (videoRef.current) {
            videoRef.current.play();
        }
    };


    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.currentTime = 2; // Set initial time to 2 seconds
        }
    }, []);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' }, // Column on mobile, row on desktop
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '2rem',
                marginY: '4rem', // Vertical spacing
                paddingX: '2rem', // Horizontal padding
                backgroundColor: 'secondary.dark',
            }}
        >
            {/* Video on the left */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                }}
                onMouseEnter={handleMouseEnter}
            >
                <video
                    ref={videoRef}
                    style={{
                        width: '100%',
                        maxWidth: '100vh', // Max width of the video
                        borderRadius: '1rem', // Rounded corners
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)', // Shadow around the video
                    }}
                >
                    <source src="https://vid.hyris.tv/encode_tmp/720p/recap-sport-toss-2023.mp4" type="video/mp4" />
                    Your browser does not support video playback.
                </video>
            </Box>

            {/* Text on the right */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: { xs: 'center', md: 'flex-start' }, // Centered on mobile, left-aligned on desktop
                    textAlign: { xs: 'center', md: 'left' }, // Center text on mobile
                    color: 'white', // Text color
                }}
            >
                <Typography
                    sx={{
                        fontSize: { xs: '1.5rem', md: '2rem' },
                        color: 'primary.main', // Main color
                        marginBottom: '1rem',
                        textTransform: 'uppercase', // Uppercase text
                    }}
                >
                    RÉCAP SIXTE 2022
                </Typography>
                <Typography
                    sx={{
                        fontSize: { xs: '3rem', md: '4rem' },
                        fontWeight: 'bold',
                        lineHeight: '1.5',
                        marginBottom: '1rem',
                        textTransform: 'uppercase', // Uppercase text
                    }}
                >
                    TOUTES CES PROMESSES, C'EST TRÈS BIEN, MAIS LE SIXTE ÇA RESSEMBLE À QUOI ?
                </Typography>
                <Typography
                    sx={{
                        fontSize: { xs: '1rem', md: '1.2rem' },
                        color: 'secondary.light',
                        textTransform: 'uppercase', // Uppercase text
                    }}
                >
                    RÉCAPITULATIF DU SIXTE 2022 RÉALISÉ PAR L'ASSOCIATION HYRIS DE CENTRALESUPÉLEC.
                </Typography>
            </Box>
        </Box>
    );
};

export default Video;
