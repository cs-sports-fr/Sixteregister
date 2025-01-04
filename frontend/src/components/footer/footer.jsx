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
                    flexDirection:'column',
                    gap:'2rem',
                    alignItems: 'center',
                    justifyContent:'center space-between',   
                    width:'100%',
                }}

            >
                <Box sx={{display:{xs:'flex',md:'flex',lg:'none'},flexDirection:'row',gap:'5rem',overflow:'hidden',mb:'2rem'}}>
                    <img style={{height:'5rem'}} src="/images/logo_lydia.png" alt="" />
                    <img style={{height:'5rem'}} src="/images/redbull_logo.png" alt="" />
                </Box>
                <Box sx={{display:{xs:'none',md:'none',lg:'flex'},flexDirection:'row',gap:'5rem',overflow:'hidden',mb:'2rem'}}>
                    <img style={{height:'5rem'}} src="/images/logo_lydia.png" alt="" />
                    <img style={{height:'5rem'}} src="/images/redbull_logo.png" alt="" />
                    <img style={{height:'5rem'}} src="/images/logo_lydia.png" alt="" />
                    <img style={{height:'5rem'}} src="/images/redbull_logo.png" alt="" />
                    <img style={{height:'5rem'}} src="/images/logo_lydia.png" alt="" />
                    <img style={{height:'5rem'}} src="/images/redbull_logo.png" alt="" />
                    <img style={{height:'5rem'}} src="/images/logo_lydia.png" alt="" />
                    <img style={{height:'5rem'}} src="/images/redbull_logo.png" alt="" />
                    <img style={{height:'5rem'}} src="/images/logo_lydia.png" alt="" />
                </Box>
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
                        <Grid container sx={{backgroundColor:'secondary.dark',py:'1rem'}} >
                            <Grid item sx={{ marginLeft: '2rem',display:'flex',flexDirection:'column',gap:'1rem',backgroundColor:'secondary.dark'}}>
                                <Box>
                                    <Typography variant='h5' sx={{fontWeight:'bold',mb:'1rem'}}>NOUS CONTACTER</Typography>   
                                    <Box color="inherit" underline="none" sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1rem', xs: '0.6rem' } }}>3, rue Joliot-Curie,<br/>
                                    Gif-sur-Yvette, 91190</Box>
                                    <Box color="inherit" underline="none" sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1rem', xs: '0.6rem' } }}>
                                    garance.asselin-de-williencourt@student-cs.fr
                                    alexandru.state@student-cs.fr
                                    </Box>
                                </Box>
                                <Box sx={{display:'flex',flexDirection:'rox',gap:'1rem'}}>
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
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container  sx={{display:{xs:'none',sm:'none',md:'block'},backgroundColor:'secondary.dark',py:'1rem'}}
                        >
                            <Grid item sx={{backgroundColor:'secondary.dark',color:"grey.400"}}>
                                <Typography variant='h5' sx={{fontWeight:'bold',mb:'1rem'}}>LIENS</Typography>   
                                <Link href="/resultats" color="inherit" underline="none" sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1rem', xs: '0.6rem' } }}> Résultats</Link>
                                <Link href="/galerie" color="inherit" underline="none" sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1rem', xs: '0.6rem' } }}> Galerie photo </Link>
                                <Link href="/partenaires" color="inherit" underline="none" sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1rem', xs: '0.6rem' } }}>Nos partenaires</Link>
                                <Link href="/infos" color="inherit" underline="none" sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1rem', xs: '0.6rem' } }}> Infos</Link>
                                <Link href="" color="inherit" underline="none" sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1rem', xs: '0.6rem' } }}> Règlement</Link>
                                <Link href="" color="inherit" underline="none" sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1rem', xs: '0.6rem' } }}> CGI</Link>
                            </Grid>
                        </Grid>
                        <Grid container  sx={{display:{xs:'none',sm:'none',md:'block'},backgroundColor:'secondary.dark',py:'1rem'}} >

                            <Grid item sx={{backgroundColor:'secondary.dark',color:"grey.400"}}>
                            <Typography variant='h5' sx={{fontWeight:'bold',mb:'1rem'}}>NAVIGATION RAPIDE</Typography>   
                            <Link href="./pages/vitrine/Home.jsx" color="inherit" underline="none" sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1rem', xs: '0.6rem' } }}> Acceuil</Link>
                                <Link href="" color="inherit" underline="none" sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1rem', xs: '0.6rem' } }}> A propos</Link>
                                <Link href="" color="inherit" underline="none" sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1rem', xs: '0.6rem' } }}> Planning </Link>
                                <Link href="" color="inherit" underline="none" sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1rem', xs: '0.6rem' } }}>L'équipe</Link>
                                <Link href="" color="inherit" underline="none" sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1rem', xs: '0.6rem' } }}> Le récap 2024</Link>
                            </Grid> 
                        </Grid>
                    </Grid> 
                    <Grid item sx={{
                        backgroundColor: 'primary.main',
                        width: '30%',
                        display: {xs:'none',md:'flex'},
                        justifyContent: 'center',
                        alignItems: 'center',                        
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