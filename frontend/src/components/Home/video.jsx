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
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' }, 
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '2rem',
                marginY: '4rem', 
                py: '2rem', 
                backgroundColor: 'secondary.dark',
                
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    py:'1rem',
                }}
            >
                <video
                    ref={videoRef}
                    style={{
                        width: '100%',
                        maxWidth: '100vh', // Max width of the video
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)', // Shadow around the video
                    }}
                    controls // Enable native video controls
                    // Optional attributes:
                    // autoPlay // Uncomment to autoplay the video
                    // loop // Uncomment to loop the video
                    // muted // Uncomment to mute the video (required for autoplay in many browsers)
                >
                    <source src="https://vid.hyris.tv/encode_tmp/720p/recap-sport-toss-2023.mp4" type="video/mp4" />
                    Your browser does not support video playback.
                </video>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: { xs: 'center', md: 'flex-start' }, 
                    textAlign: { xs: 'center', md: 'left' }, 
                    color: 'white', 
                }}
            >
                 <Typography
                variant="h2"
                sx={{
                    fontWeight: 'medium',
                    textAlign:'center',
                    marginBottom: '1rem',
                    fontSize: '1.5rem',
                    textTransform: 'uppercase',
                    color: palette.primary.main,
                }}
                >
                Recap Sixte 2024
                </Typography>
                <Typography
                          variant="h2"
                          sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '3rem',
                            alignSelf: 'flex-start',
                            marginBottom: '1rem',
                            textTransform: 'uppercase',
                          }}
                        >
                          Toutes ces promesses, c'est très bien, mais le Sixte ça ressemble à quoi ?

                        </Typography>
               
                    <Typography
                    
                        sx={{
                            mt: '2rem',
                            fontSize: { xs: '0.8rem', md: '0.8rem' },
                            textTransform: 'uppercase', 
                            color: palette.grey[400],
                        }}
                    >
                        RÉCAPITULATIF DU SIXTE 2023 RÉALISÉ PAR L'ASSOCIATION HYRIS DE CENTRALESUPÉLEC.
                    </Typography>
            </Box>
        </Box>
    );
};

export default Video;
