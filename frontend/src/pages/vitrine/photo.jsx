import { Box, Typography } from "@mui/material";
import LayoutUnauthenticated from "../../components/layouts/LayoutUnauthenticated";

const Photo = () => {
    const isDarkMode = false;

    return (
        <LayoutUnauthenticated isDarkMode={isDarkMode}>
            <Box>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Typography sx={{
                        color: "black",
                        fontSize : "5rem"
                    }}
                    > Galerie Photos
                    </Typography>
                </Box>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1rem',
                    padding: '1rem',
                    backgroundImage: 'url(/images/Background.jpg)',  
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    borderRadius: '0.5rem',
                }}>
                    <img 
                        src="/images/Photo1.jpg" 
                        alt="Photo1" 
                        style={{
                            width: '90%',
                            height: 'auto',
                            maxWidth: '30rem',
                            maxHeight: '20rem',
                            borderRadius: '0.5rem',
                            objectFit: 'cover'
                        }} 
                    />
                    <img 
                        src="/images/Photo2.jpg" 
                        alt="Photo2" 
                        style={{
                            width: '90%',
                            height: 'auto',
                            maxWidth: '30rem',
                            maxHeight: '20rem',
                            borderRadius: '0.5rem',
                            objectFit: 'cover'
                        }} 
                    />
                    <img 
                        src="/images/Photo3.jpg" 
                        alt="Photo3" 
                        style={{
                            width: '90%',
                            height: 'auto',
                            maxWidth: '30rem',
                            maxHeight: '20rem',
                            borderRadius: '0.5rem',
                            objectFit: 'cover'
                        }} 
                    />
                    <img 
                        src="/images/Photo5.jpg" 
                        alt="Photo5" 
                        style={{
                            width: '90%',
                            height: 'auto',
                            maxWidth: '30rem',
                            maxHeight: '20rem',
                            borderRadius: '0.5rem',
                            objectFit: 'cover'
                        }} 
                    />
                </Box>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    marginTop: '2rem',
                    padding: '1rem',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}>
                        Merci à <strong>Pics</strong> pour les magnifiques photos !
                    <img 
                        src="/images/Logopics.png" 
                        alt="Pics Logo" 
                        style={{
                            width: '10rem',
                            height: 'auto',
                            objectFit: 'contain'
                        }}
                    />
                </Box>
            </Box>
        </LayoutUnauthenticated>
    );
};

export default Photo;