import { Box, Typography } from "@mui/material";
import LayoutUnauthenticated from "../../components/layouts/LayoutUnauthenticated";
import Footer from "../../components/footer/footer";
const Photo = () => {
    const isDarkMode = false;

    return (
        <LayoutUnauthenticated isDarkMode={isDarkMode}>
            <Box>
                <Box sx={{height:'20vh',width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
                                <Typography
                                    variant="h2"
                                    sx={{
                                        mt: '8rem',
                                        fontWeight: 'bold',
                                        fontSize: '3rem',
                                        color: 'black',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    Photos du Sixte
                                </Typography>
                    </Box>
                
                <Box sx={{
                    width: '100%',
                    display:'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flexwrap: 'wrap',
                    gap: '3rem',
                    mt: '2rem',
                }}>
                    <Box sx={{display:'flex', gap: '2rem',alignItems: 'center', justifyContent: 'center'}}>
                    <img 
                        src="/images/Photo1.jpg" 
                        alt="Photo1" 
                        style={{
                            width: '40%',
                            height: 'auto',
                            objectFit: 'cover'
                        }} 
                    />
                    <img 
                        src="/images/Photo2.jpg" 
                        alt="Photo2" 
                        style={{
                            width: '40%',
                            height: 'auto',
                            objectFit: 'cover'
                        }} 
                    />
                    </Box>
                    <Box sx={{display:'flex', gap: '2rem',alignItems: 'center', justifyContent: 'center'}}>
                    <img 
                        src="/images/Photo3.jpg" 
                        alt="Photo3" 
                        style={{
                            width: '40%',
                            height: 'auto',
                            objectFit: 'cover'
                        }} 
                    />
                    <img 
                        src="/images/Photo5.jpg" 
                        alt="Photo5" 
                        style={{
                            width: '40%',
                            height: 'auto',
                            objectFit: 'cover'
                        }} 
                    />
                    </Box>
                </Box>
                <Box 
                    sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    marginTop: '2rem',
                    padding: '1rem',
                }}>
                        <Typography sx={{color:'black',mb:"3rem"}}>  Merci à Pics pour les magnifiques photos ! Retrouvez plus de photos du Sixte sur leur site !
                        </Typography>
                    <a href="https://galerie.pics/galerie/sixte-2023-2024">
                    <img 
                        src="/images/Logopics.png" 
                        alt="Pics Logo" 
                        style={{
                            width: '10rem',
                            height: 'auto',
                            objectFit: 'contain'
                        }}
                    />
                    </a>
                </Box>
                <Footer/>

            </Box>
        </LayoutUnauthenticated>
    );
};

export default Photo;