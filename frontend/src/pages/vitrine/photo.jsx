import { Box, Typography } from "@mui/material";
import LayoutUnauthenticated from "../../components/layouts/LayoutUnauthenticated";
import Footer from "../../components/footer/footer";
import palette from "../../themes/palette";

const Photo = () => {
    const isDarkMode = false;

    const photos = [
        { src: "/images/Background.jpg", alt: "Photo Sixte Background" },
        { src: "/images/compressed-20250308-100934-3374-Maxime-Monel.jpg", alt: "Photo Sixte 1" },
        { src: "/images/compressed-20250308-171323-4842-Maxime-Monel.jpg", alt: "Photo Sixte 6" },

        // { src: "/images/compressed-20250308-111737-3631-Maxime-Monel.jpg", alt: "Photo Sixte 2" },
        { src: "/images/compressed-20250308-130523-3739-Maxime-Monel.jpg", alt: "Photo Sixte 3" },
        { src: "/images/compressed-20250308-165013-4687-Maxime-Monel.jpg", alt: "Photo Sixte 5" },
        { src: "/images/compressed-20250308-131838-3864-Maxime-Monel.jpg", alt: "Photo Sixte 4" },

    ];

    return (
        <LayoutUnauthenticated isDarkMode={isDarkMode}>
            <Box sx={{ backgroundColor: 'white', minHeight: '100vh' }}>
                {/* Header Section */}
                <Box 
                    sx={{
                        paddingTop: { xs: '8rem', md: '12rem' },
                        paddingBottom: { xs: '2rem', md: '4rem' },
                        paddingX: { xs: '1.5rem', md: '3rem' },
                        textAlign: 'center',
                        backgroundColor: 'white',
                    }}
                >
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: '600',
                            marginBottom: '0.5rem',
                            fontSize: { xs: '0.8rem', sm: '1rem' },
                            textTransform: 'uppercase',
                            color: palette.primary.red,
                            letterSpacing: '2px',
                        }}
                    >
                        Galerie
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 'bold',
                            fontSize: { xs: '1.5rem', sm: '2.5rem', md: '3rem' },
                            color: palette.primary.dark,
                            textTransform: 'uppercase',
                            lineHeight: 1.2,
                        }}
                    >
                        Photos du{' '}
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

                {/* Photos Grid */}
                <Box 
                    sx={{
                        width: { xs: '90%', md: '90%', lg: '100%' },
                        maxWidth: '1400px',
                        margin: '0 auto',
                        padding: { xs: '2rem 1rem', md: '3rem 0.5rem', lg: '3rem 2rem' },
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: { xs: '1rem', sm: '1.5rem', md: '2rem' },
                    }}
                >
                    {photos.map((photo, index) => (
                        <Box
                            key={index}
                            sx={{
                                position: 'relative',
                                overflow: 'hidden',
                                borderRadius: '20px',
                                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s ease',
                                border: '2px solid rgba(255, 255, 255, 0.3)',
                                aspectRatio: '4/3',
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
                                    zIndex: 1,
                                },
                                '&:hover': {
                                    transform: 'translateY(-10px)',
                                    boxShadow: '0 20px 60px rgba(255, 107, 107, 0.3)',
                                    border: `2px solid ${palette.primary.red}`,
                                },
                                '&:hover::before': {
                                    transform: 'scaleX(1)',
                                },
                                '&:hover img': {
                                    transform: 'scale(1.05)',
                                },
                            }}
                        >
                            <Box
                                component="img"
                                src={photo.src}
                                alt={photo.alt}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.3s ease',
                                }}
                            />
                        </Box>
                    ))}
                </Box>

                {/* Pics Section */}
                <Box 
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        padding: { xs: '3rem 1.5rem', md: '5rem 3rem' },
                        backgroundColor: 'white',
                        gap: '2rem',
                    }}
                >
                    <Typography 
                        sx={{
                            color: palette.primary.dark,
                            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem' },
                            textAlign: 'center',
                            maxWidth: '800px',
                            lineHeight: 1.8,
                            paddingX: { xs: '1rem', md: '0' },
                        }}
                    >
                        Merci à{' '}
                        <Box 
                            component="span" 
                            sx={{ 
                                color: palette.primary.red,
                                fontWeight: 'bold',
                            }}
                        >
                            Pics
                        </Box>
                        {' '}pour les magnifiques photos !
                    </Typography>
                    
                    <Typography 
                        sx={{
                            color: palette.primary.dark,
                            fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
                            textAlign: 'center',
                            fontWeight: 'bold',
                            marginTop: '1rem',
                            paddingX: { xs: '1rem', md: '0' },
                        }}
                    >
                        Retrouvez la galerie complète sur leur site :
                    </Typography>

                    <Box
                        component="a"
                        href="https://galerie.pics/galerie/sixte-2023-2024"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: { xs: '1.5rem 2rem', md: '2rem 3rem' },
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '20px',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                            transition: 'all 0.3s ease',
                            textDecoration: 'none',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden',
                            width: { xs: '90%', sm: 'auto' },
                            maxWidth: { xs: '400px', md: 'none' },
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
                        <Box
                            component="img"
                            src="/images/Logopics.png"
                            alt="Pics Logo"
                            sx={{
                                width: { xs: '8rem', md: '10rem' },
                                height: 'auto',
                                objectFit: 'contain',
                            }}
                        />
                        <Typography
                            sx={{
                                color: palette.primary.red,
                                fontWeight: 'bold',
                                fontSize: { xs: '0.9rem', md: '1rem' },
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                            }}
                        >
                            Cliquez pour voir toutes les photos →
                        </Typography>
                    </Box>
                </Box>

                <Footer/>

            </Box>
        </LayoutUnauthenticated>
    );
};

export default Photo;