import React from 'react';
import { Box, Typography } from '@mui/material';
import palette from '../../themes/palette';
import { Group } from '@mui/icons-material';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import RoomIcon from '@mui/icons-material/MeetingRoom';


const cardData = [
    {
        icon: <Group sx={{ fontSize: { md: '6rem', lg: '9rem' }, color: palette.primary.red, marginBottom: '1rem' }} />,
        title: 'DES ÉQUIPES DE TOUTE LA FRANCE',
        text: '32 équipes masculines et 16 équipes féminines !',
    },
    {
        icon: <DirectionsRunIcon sx={{ fontSize: { md: '6rem', lg: '9rem' }, color: palette.primary.red, marginBottom: '1rem' }} />,
        title: 'UN CADRE INCROYABLE',
        text: 'Pouvoir jouer sur les pelouses qu’ont foulé l’équipe de France : que rêver de mieux ?',
    },
    {
        icon: <RoomIcon sx={{ fontSize: { md: '6rem', lg: '9rem' }, color: palette.primary.red, marginBottom: '1rem' }} />,
        title: 'UNE VISITE DE CLAIREFONTAINE',
        text: 'Pour satisfaire ta passion jusqu’au bout, tu pourras visiter le musée des Bleus et leur vestiaire !',
    },
];

const Card = ({ icon, title, text }) => (
    <Box
        sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '3rem 2rem',
            textAlign: 'center',
            flex: 1,
            marginTop: { xs: 0, sm: 0, md: 0, lg: '-10rem' },
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
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
        <Box sx={{ 
            transition: 'transform 0.3s ease',
            display: 'inline-block',
            '&:hover': { transform: 'scale(1.1) rotate(5deg)' }
        }}>
            {icon}
        </Box>
        <Typography
            variant="h5"
            sx={{
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: palette.primary.dark,
                fontSize: { xs: '1.2rem', md: '1.4rem' },
                transition: 'color 0.3s ease',
            }}
        >
            {title}
        </Typography>
        <Typography sx={{ 
            color: palette.secondary.main,
            fontSize: { sm: '1.1rem', md: '1.1rem', lg: '1rem' },
            lineHeight: 1.6,
        }}>
            {text}
        </Typography>
    </Box>
);

const IconsInscription = () => {
    return (
        <Box sx={{ height: 'auto' }}>
            <Box
                sx={{
                    height: { md: '7rem', lg: '13rem' },
                    py: '3rem',
                    textAlign: 'center',
                    width: '100%',
                    position: 'relative',
                }}
            >
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: '600',
                        alignSelf: 'flex-start',
                        marginBottom: '0.5rem',
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        textTransform: 'uppercase',
                        color: palette.primary.red,
                        letterSpacing: '2px',
                    }}
                >
                    Présentation
                </Typography>
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: 'bold',
                        fontSize: { xs: '2rem', sm: '3rem' },
                        alignSelf: 'flex-start',
                        marginBottom: '1rem',
                        color: palette.primary.dark,
                        textTransform: 'uppercase',
                    }}
                >
                    Pourquoi venir au{' '}
                    <Box 
                        component="span" 
                        sx={{ 
                            color: palette.primary.red,
                            textShadow: '0 0 20px rgba(255, 107, 107, 0.3)',
                        }}
                    >
                        SIXTE
                    </Box>
                    {' '}?
                </Typography>
            </Box>
            <Box
                sx={{
                    // background: `linear-gradient(135deg, ${palette.primary.dark} 0%, #0a2540 100%)`,
                    background: 'white',
                    color: palette.primary.dark,
                    padding: { xs: '4rem 2rem', sm: '6rem 2rem' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { sm: 'column', lg: 'row' },
                        justifyContent: 'space-between',
                        gap: '2rem',
                        width: '100%',
                        marginBottom: '4rem',
                    }}
                >
                    {cardData.map((card, index) => (
                        <Card key={index} icon={card.icon} title={card.title} text={card.text} />
                    ))}
                </Box>

                {/* Section Date d'Inscription */}
                <Box
                    sx={{
                        textAlign: 'center',
                        width: '100%',
                        marginTop: '2rem',
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            marginBottom: '3rem',
                            fontWeight: 'bold',
                            fontSize: { xs: '1.5rem', sm: '2rem' },
                            color: 'white',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                        }}
                    >
                        Pour ne pas rater ça, tout se joue lors de l&apos;ouverture des inscriptions
                    </Typography>
                    
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '15px',
                            padding: '2rem 3rem',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                            maxWidth: '600px',
                            margin: '0 auto',
                        }}
                    >
                        <Typography 
                            sx={{ 
                                color: 'white', 
                                fontSize: { xs: '1.2rem', md: '1.5rem' },
                                fontWeight: '400',
                                letterSpacing: '1px',
                            }}
                        >
                            Ouverture des inscriptions le
                        </Typography>
                        <Typography 
                            sx={{ 
                                color: palette.primary.red,
                                fontSize: { xs: '2rem', md: '3rem' },
                                fontWeight: 'bold',
                                textShadow: '0 0 20px rgba(255, 107, 107, 0.5)',
                                letterSpacing: '2px',
                            }}
                        >
                            15 DÉCEMBRE 2025
                        </Typography>
                    </Box>
                </Box>
                
                {/* Section "Inscription" - Commented for later */}
                {/* <Box
                    sx={{
                        textAlign: 'center',
                        width: '100%',
                        marginTop: '2rem',
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            marginBottom: '2rem',
                            fontWeight: 'bold',
                            fontSize: { xs: '1.5rem', sm: '2.5rem' },
                            color: 'white',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                        }}
                    >
                        Qu&apos;attends-tu pour t&apos;inscrire ?
                    </Typography>
                    <Button
                        variant="outlined"
                        href="/register"
                        sx={{
                            borderColor: palette.primary.red,
                            backgroundColor: palette.primary.red,
                            color: 'white',
                            fontWeight: 'bold',
                            borderRadius: '30px',
                            padding: '1.2rem 3rem',
                            fontSize: '1.1rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1.5px',
                            boxShadow: '0 8px 30px rgba(255, 107, 107, 0.4)',
                            transition: 'all 0.3s ease',
                            ':hover': {
                                backgroundColor: 'white',
                                color: palette.primary.red,
                                borderColor: 'white',
                                transform: 'translateY(-5px)',
                                boxShadow: '0 12px 40px rgba(255, 107, 107, 0.5)',
                            },
                        }}
                    >
                        S&apos;inscrire
                    </Button>
                </Box> */}
            </Box>
        </Box>
    );
};

export default IconsInscription;
