import { Box, Typography } from "@mui/material";
import NavbarParticipant from "../components/navbar/NavbarParticipant";
import palette from "../themes/palette";

const EspaceParticipant = () => {
    return (
        <>
            <NavbarParticipant />
            <Box 
                sx={{ 
                    backgroundColor: 'white',
                    minHeight: '100vh',
                    paddingTop: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: { xs: '80px 2rem 2rem', md: '80px 4rem 4rem' }
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
        </>
    );
};

export default EspaceParticipant;
