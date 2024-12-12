import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';


const NotFoundPage = () => {
    const navigation = useNavigate();

    const handleRedirect = () => {
        navigation('/', { replace: true });
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundImage: `url(/public/images/erreur404pics.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',  // L'image est centrée
                backgroundAttachment: 'fixed',
            }}
        >
            <Box
                sx={{
                    textAlign: 'center',
                    maxWidth: '40%',
                    height: '40%',
                    backgroundColor: (theme) => alpha(theme.palette.primary.dark, 0.7),
                    borderRadius: '1rem',
                    padding: '2rem',
                }}
            >
                <Typography variant="h1" sx={{
                    fontSize: { xs: '2rem', md: '3rem', lg: '4rem' },
                    marginBottom: '2rem'
                }}>
                    Erreur 404 :
                </Typography>
                <Typography variant="h1" sx={{ fontSize: { xs: '1rem', md: '2rem', lg: '3rem' }, marginBottom: '1rem' }}>
                    Oups, Cette page n&apos;existe pas
                </Typography>
                <Button variant="contained" color="primary" onClick={handleRedirect} startIcon={<ArrowBack />} sx={{ marginTop: '1rem' }}>
                    Retourner à l&apos;accueil
                </Button>
            </Box>
        </Box>
    );
};

export default NotFoundPage;
