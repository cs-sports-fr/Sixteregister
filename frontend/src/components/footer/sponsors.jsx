import { Box, Typography } from '@mui/material';
import palette from "../../themes/palette";

const Sponsors = () => {
    return (
        <>
            <Box sx={{ width: '100%', overflow: 'hidden', position: 'relative', paddingY: '2rem' }}>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: '600',
                            textAlign: 'center',
                            marginBottom: '3rem',
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            textTransform: 'uppercase',
                            color: palette.primary.red,
                            letterSpacing: '2px',
                        }}
                    >
                        Nos partenaires
                    </Typography>
                    
                    {/* Animation de défilement des logos */}
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '5rem',
                            animation: 'scroll 20s linear infinite',
                            '@keyframes scroll': {
                                '0%': { transform: 'translateX(0)' },
                                '100%': { transform: 'translateX(-50%)' },
                            },
                        }}
                    >
                        {/* Premier set de logos */}
                        <Box sx={{ display: 'flex', gap: '5rem', alignItems: 'center' }}>
                            <img style={{ height: '5rem', filter: 'grayscale(0%)', transition: 'all 0.3s ease' }} src="/images/logo_lydia.png" alt="Lydia" />
                            <img style={{ height: '5rem', filter: 'grayscale(0%)', transition: 'all 0.3s ease' }} src="/images/redbull_logo.png" alt="Red Bull" />
                            <img style={{ height: '5rem', filter: 'grayscale(0%)', transition: 'all 0.3s ease' }} src="/images/logo_lydia.png" alt="Lydia" />
                            <img style={{ height: '5rem', filter: 'grayscale(0%)', transition: 'all 0.3s ease' }} src="/images/redbull_logo.png" alt="Red Bull" />
                            <img style={{ height: '5rem', filter: 'grayscale(0%)', transition: 'all 0.3s ease' }} src="/images/logo_lydia.png" alt="Lydia" />
                            <img style={{ height: '5rem', filter: 'grayscale(0%)', transition: 'all 0.3s ease' }} src="/images/redbull_logo.png" alt="Red Bull" />
                        </Box>
                        {/* Duplication pour animation infinie */}
                        <Box sx={{ display: 'flex', gap: '5rem', alignItems: 'center' }}>
                            <img style={{ height: '5rem', filter: 'grayscale(0%)', transition: 'all 0.3s ease' }} src="/images/logo_lydia.png" alt="Lydia" />
                            <img style={{ height: '5rem', filter: 'grayscale(0%)', transition: 'all 0.3s ease' }} src="/images/redbull_logo.png" alt="Red Bull" />
                            <img style={{ height: '5rem', filter: 'grayscale(0%)', transition: 'all 0.3s ease' }} src="/images/logo_lydia.png" alt="Lydia" />
                            <img style={{ height: '5rem', filter: 'grayscale(0%)', transition: 'all 0.3s ease' }} src="/images/redbull_logo.png" alt="Red Bull" />
                            <img style={{ height: '5rem', filter: 'grayscale(0%)', transition: 'all 0.3s ease' }} src="/images/logo_lydia.png" alt="Lydia" />
                            <img style={{ height: '5rem', filter: 'grayscale(0%)', transition: 'all 0.3s ease' }} src="/images/redbull_logo.png" alt="Red Bull" />
                        </Box>
                    </Box>
                </Box>
                </>
);
};export default Sponsors