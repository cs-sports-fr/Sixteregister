import { Box, Typography } from "@mui/material";
import LayoutAuthenticated from "../components/layouts/LayoutAuthenticated";
import palette from "../themes/palette";

const EspaceParticipant = () => {
    const isDarkMode = false;

    return (
        <LayoutAuthenticated isDarkMode={isDarkMode}>
            <Box 
                sx={{ 
                    backgroundColor: 'white',
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: { xs: '2rem', md: '4rem' }
                }}
            >
                <Typography 
                    sx={{
                        fontSize: { xs: '3rem', md: '5rem' },
                        fontWeight: 'bold',
                        color: palette.primary.dark,
                        textAlign: 'center',
                        letterSpacing: '2px',
                    }}
                >
                    <span style={{ 
                        textDecoration: 'underline', 
                        textDecorationColor: palette.primary.red, 
                        textUnderlineOffset: '1rem', 
                        textDecorationThickness: '6px' 
                    }}>
                        Espace
                    </span>{' '}
                    Participant
                </Typography>
            </Box>
        </LayoutAuthenticated>
    );
};

export default EspaceParticipant;
