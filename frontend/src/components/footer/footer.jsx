import { Box, Typography, Link, Grid, useTheme, useMediaQuery } from '@mui/material';
import { blue, green, red } from "@mui/material/colors";
import palette from "../../themes/palette";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';


const Footer = ({ navigation }) => {
    const isDarkMode = true;
    const theme = useTheme();
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent:'center space-between',   
                    width:'100%',
                }}

            >
                <Grid container spacing={2} justifyContent="space-between" alignItems="flex-start" sx={{display: 'flex',width: '100%',backgroundColor:'secondary.dark' }}>
                    <Grid item sx={{
                        display : "flex",
                        lignItems: 'center',
                        justifyContent:'space-between',
                        gap:'1rem',
                        color:'white',
                        backgroundColor:'secondary.dark',
                        width:'65%',
                        
                    }}
                    >
                        <Grid container sx={{backgroundColor:'secondary.dark'}} >
                            <Grid item sx={{ marginLeft: '2rem', display: { xs: 'none', lg: 'block' } ,backgroundColor:'secondary.dark'}}>
                                <Box>
                                <h1>NOUS CONTACTER</h1>
                                <Box color="inherit" underline="none" sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1.2rem', xs: '0.6rem' } }}>3, rue Joliot-Curie,<br/>
                                Gif-sur-Yvette, 91190</Box>
                                <Box color="inherit" underline="none" sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1.2rem', xs: '0.6rem' } }}>
                                sixte@cs-sports.fr
                                </Box>
                                </Box>
                            </Grid>
                            <Grid item sx={{
                                display:'flex',  
                                backgroundColor: 'transparent',
                                marginLeft: '2rem',
                                gap:'1rem'
                            
                            }}
                            >
                                <Box sx={{  border:'2px white solid ',
                                    borderRadius:'100%',
                                    width:'3.5rem',
                                    height:'3.5rem',
                                    display: 'flex',
                                    justifyContent: 'center',  
                                    alignItems: 'center',
                                    backgroundColor: 'primary.main'     
                                }}>
                                    <Link href="https://www.instagram.com/bds_centralesupelec/?hl=fr" > 
                                    <InstagramIcon sx={{ fontSize: { sm: '2rem', xs: '1rem' } ,color:'white','&:hover':{opacity:'0.7'}}} />
                                    </Link>
                                </Box>
                                <Box sx={{
                                    border:'2px white solid ',
                                    borderRadius:'100%',
                                    width:'3.5rem',
                                    height:'3.5rem',
                                    display: 'flex',
                                    justifyContent: 'center', 
                                    alignItems: 'center',
                                    backgroundColor: 'primary.main' 
                                        
                                }}
                                >
                                    <Link href="https://www.facebook.com/CentraleSupelecSports/?locale=fr_FR" style={{}}> 
                                        <FacebookIcon sx={{ fontSize: { sm: '2rem', xs: '1rem' }, color:'white', '&:hover':{opacity:'0.7'} }} />
                                    </Link>
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container  sx={{backgroundColor:'secondary.dark'}}
                        >
                            <Grid item sx={{backgroundColor:'secondary.dark'}}>
                                <h1>LIENS</h1>   
                                <Link href="./pages/vitrine/Home.jsx" color="inherit" underline="none" sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1.2rem', xs: '0.6rem' } }}> Acceuil</Link>
                                <Link href=".pages/vitrine/Results.jsx" color="inherit" underline="none" sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1.2rem', xs: '0.6rem' } }}> Résultats</Link>
                                <Link href="./pages/vitrine/photo.jsx" color="inherit" underline="none" sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1.2rem', xs: '0.6rem' } }}> Galerie photo </Link>
                                <Link href=".pages/vitrine/Sponsor.jsx" color="inherit" underline="none" sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1.2rem', xs: '0.6rem' } }}>Nos partenaires</Link>
                                <Link href="" color="inherit" underline="none" sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1.2rem', xs: '0.6rem' } }}> Infos</Link>
                                <Link href="" color="inherit" underline="none" sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1.2rem', xs: '0.6rem' } }}> Espace Admin</Link>
                                <Link href="" color="inherit" underline="none" sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1.2rem', xs: '0.6rem' } }}> Règlement</Link>
                                <Link href="" color="inherit" underline="none" sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1.2rem', xs: '0.6rem' } }}> CGI</Link>
                            </Grid>
                        </Grid>
                        <Grid container sx={{
                                width: '100%', height: 'auto',
                                backgroundColor:'secondary.dark'
                        }}
                        >
                            <Grid item sx={{backgroundColor:'secondary.dark'}}>
                            <h1>NAVIGATION RAPIDE</h1>
                                <Link href="./pages/vitrine/Home.jsx" color="inherit" underline="none" sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1.2rem', xs: '0.6rem' } }}> Acceuil</Link>
                                <Link href="" color="inherit" underline="none" sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1.2rem', xs: '0.6rem' } }}> A propos</Link>
                                <Link href="" color="inherit" underline="none" sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1.2rem', xs: '0.6rem' } }}> Planning </Link>
                                <Link href="" color="inherit" underline="none" sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1.2rem', xs: '0.6rem' } }}>L'équipe</Link>
                                <Link href="" color="inherit" underline="none" sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1.2rem', xs: '0.6rem' } }}> Le récap 2024</Link>
                                <Link href="" color="inherit" underline="none" sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1.2rem', xs: '0.6rem' } }}>Nous contacter</Link>
                            </Grid> 
                        </Grid>
                    </Grid> 
                    <Grid item sx={{
                        backgroundColor: 'primary.main',
                        width: '30%',
                        
                        padding: '2rem'
                    }}
                    >
                        <img src="../images/Logo_BDS_Blanc.png" alt="logo bds" style={{ width: '60%', maxWidth: '100%' }}
                         />
                    </Grid>
                </Grid>  
            </Box>
        </>
    )
};



export default Footer