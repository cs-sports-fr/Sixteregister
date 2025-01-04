import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import palette from '../../themes/palette';
import { SportsSoccer, Group } from '@mui/icons-material';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import CastleRoundedIcon from '@mui/icons-material/CastleRounded';

const IconsInscription = () => {
    return (
        <Box sx={{height:'auto'}}>
            <Box
                sx={{
                    height: {xs:'5rem',md:'13rem'},
                    py: '3rem',
                    textAlign: 'center',
                    width: '100%',
                }}
            >
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: 'medium',
                        alignSelf: 'flex-start',
                        marginBottom: '1rem',
                        fontSize: { xs: '1.2rem', sm: '1.5rem' },
                        textTransform: 'uppercase',
                        color: palette.primary.main,
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
                        color: 'black',
                        textTransform: 'uppercase',
                    }}
                >
                    Pourquoi venir au sixte ?
                </Typography>
            </Box>
            <Box
                sx={{
                    backgroundColor: palette.secondary.dark,
                    color: palette.secondary.light,
                    padding: { xs: '2rem', sm: '4rem 2rem' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        gap: '2rem',
                        width: '100%',
                        marginBottom: '4rem',
                    }}
                >
                    {/* Carte 1 */}
                    <Box
                        sx={{
                            backgroundColor: palette.secondary.light,
                            borderRadius: '0.2rem',
                            padding: '2rem',
                            textAlign: 'center',
                            flex: 1,
                            marginTop: {xs:0,md:'-10rem'},
                            height: '20rem',
                        }}
                    >
                        <Group
                            sx={{
                                fontSize: { xs: '6rem', sm: '9rem' },
                                color: palette.primary.main,
                                marginBottom: '1rem',
                            }}
                        />
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 'bold',
                                marginBottom: '0.5rem',
                                color: palette.secondary.dark,
                            }}
                        >
                            DES ÉQUIPES DE TOUTE LA FRANCE
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#555' }}>
                            32 équipes masculines et 16 équipes féminines !
                        </Typography>
                    </Box>

                    {/* Carte 2 */}
                    <Box
                        sx={{
                            backgroundColor: palette.secondary.light,
                            borderRadius: '0.2rem',
                            padding: '2rem',
                            textAlign: 'center',
                            flex: 1,
                            marginTop: {xs:0,md:'-10rem'},
                        }}
                    >
                        <DirectionsRunIcon
                            sx={{
                                fontSize: { xs: '6rem', sm: '9rem' },
                                color: palette.primary.main,
                                marginBottom: '1rem',
                            }}
                        />
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 'bold',
                                marginBottom: '0.5rem',
                                color: palette.secondary.dark,
                            }}
                        >
                            UN CADRE INCROYABLE
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#555' }}>
                            Pouvoir jouer sur les pelouses qu’ont foulé l’équipe de France : que rêver de mieux ?
                        </Typography>
                    </Box>

                    {/* Carte 3 */}
                    <Box
                        sx={{
                            backgroundColor: palette.secondary.light,
                            borderRadius: '0.2rem',
                            padding: '2rem',
                            textAlign: 'center',
                            flex: 1,
                            marginTop: {xs:0,md:'-10rem'},
                        }}
                    >
                        <CastleRoundedIcon
                            sx={{
                                fontSize: { xs: '6rem', sm: '9rem' },
                                color: palette.primary.main,
                                marginBottom: '1rem',
                            }}
                        />
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 'bold',
                                marginBottom: '0.5rem',
                                color: palette.secondary.dark,
                            }}
                        >
                            UNE VISITE DE CLAIREFONTAINE
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#555' }}>
                            Pour satisfaire ta passion jusqu’au bout, tu pourras éventuellement visiter le château et le musée des Bleus !
                        </Typography>
                    </Box>
                </Box>

                {/* Section "Inscription" */}
                <Box
                    sx={{
                        textAlign: 'center',
                        width: '100%',
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            marginBottom: '1rem',
                            fontWeight: 'bold',
                            fontSize: { xs: '1.5rem', sm: '2rem' },
                            mb: 4,
                        }}
                    >
                        QU'ATTENDS-TU POUR T'INSCRIRE ?
                    </Typography>
                    <Button
                        variant="outlined"
                        href="/register"
                        sx={{
                            borderColor: 'white',
                            backgroundColor: 'primary.main',
                            color: 'white',
                            fontWeight: 'bold',
                            borderRadius: '8px',
                            padding: '1.6rem',
                            width: { xs: '8rem', sm: '10rem' },
                            py: '1.5rem',
                            ':hover': {
                                backgroundColor: 'primary.main',
                                borderColor: 'white',
                            },
                        }}
                    >
                        <Typography sx={{ color: 'white', fontSize: '1.1rem' }}>
                            S'INSCRIRE
                        </Typography>
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default IconsInscription;
