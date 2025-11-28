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
                    justifyContent:'center',   
                    width:'100%',
                    backgroundColor: 'white',
                    paddingTop: '4rem',
                }}
            >
                {/* Section Sponsors avec animation */}
                <Box sx={{ width: '100%', overflow: 'hidden', position: 'relative', paddingY: '2rem' }}>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: '600',
                            textAlign: 'center',
                            marginBottom: '3rem',
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            textTransform: 'uppercase',
                            color: palette.primary.red,
                            letterSpacing: '2px',
                        }}
                    >
                        Nos partenaires
                    </Typography>
                    
                    {/* Animation de défilement des logos */}
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '5rem',
                            animation: 'scroll 20s linear infinite',
                            '@keyframes scroll': {
                                '0%': { transform: 'translateX(0)' },
                                '100%': { transform: 'translateX(-50%)' },
                            },
                        }}
                    >
                        {/* Premier set de logos */}
                        <Box sx={{ display: 'flex', gap: '5rem', alignItems: 'center' }}>
                            <img style={{ height: '5rem', filter: 'grayscale(0%)', transition: 'all 0.3s ease' }} src="/images/logo_lydia.png" alt="Lydia" />
                            <img style={{ height: '5rem', filter: 'grayscale(0%)', transition: 'all 0.3s ease' }} src="/images/redbull_logo.png" alt="Red Bull" />
                            <img style={{ height: '5rem', filter: 'grayscale(0%)', transition: 'all 0.3s ease' }} src="/images/logo_lydia.png" alt="Lydia" />
                            <img style={{ height: '5rem', filter: 'grayscale(0%)', transition: 'all 0.3s ease' }} src="/images/redbull_logo.png" alt="Red Bull" />
                            <img style={{ height: '5rem', filter: 'grayscale(0%)', transition: 'all 0.3s ease' }} src="/images/logo_lydia.png" alt="Lydia" />
                            <img style={{ height: '5rem', filter: 'grayscale(0%)', transition: 'all 0.3s ease' }} src="/images/redbull_logo.png" alt="Red Bull" />
                        </Box>
                        {/* Duplication pour animation infinie */}
                        <Box sx={{ display: 'flex', gap: '5rem', alignItems: 'center' }}>
                            <img style={{ height: '5rem', filter: 'grayscale(0%)', transition: 'all 0.3s ease' }} src="/images/logo_lydia.png" alt="Lydia" />
                            <img style={{ height: '5rem', filter: 'grayscale(0%)', transition: 'all 0.3s ease' }} src="/images/redbull_logo.png" alt="Red Bull" />
                            <img style={{ height: '5rem', filter: 'grayscale(0%)', transition: 'all 0.3s ease' }} src="/images/logo_lydia.png" alt="Lydia" />
                            <img style={{ height: '5rem', filter: 'grayscale(0%)', transition: 'all 0.3s ease' }} src="/images/redbull_logo.png" alt="Red Bull" />
                            <img style={{ height: '5rem', filter: 'grayscale(0%)', transition: 'all 0.3s ease' }} src="/images/logo_lydia.png" alt="Lydia" />
                            <img style={{ height: '5rem', filter: 'grayscale(0%)', transition: 'all 0.3s ease' }} src="/images/redbull_logo.png" alt="Red Bull" />
                        </Box>
                    </Box>
                </Box>
                <Grid container sx={{display: 'flex',width: '100%', backgroundColor: 'secondary.dark'}}>
                    <Grid item xs={12} md={9} sx={{
                        display : "flex",
                        lignItems: 'center',
                        justifyContent:'space-between',
                        gap:'1rem',
                        color:'white',
                        backgroundColor:'secondary.dark',
                    }}
                    >
                        <Grid container sx={{backgroundColor:'secondary.dark',py:'1rem'}} >
                            <Grid item sx={{ marginLeft: '2rem',display:'flex',flexDirection:'column',gap:'1rem',backgroundColor:'secondary.dark'}}>
                                <Box>
                                    <Typography variant='h5' sx={{fontWeight:'bold',mb:'1rem'}}>NOUS CONTACTER</Typography>   
                                    <Box color="inherit" underline="none" sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1rem', xs: '0.6rem' } }}>3, rue Joliot-Curie,<br/>
                                    Gif-sur-Yvette, 91190</Box>
                                    <Box color="inherit" underline="none" sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1rem', xs: '0.6rem' } }}>
                                    laure.desurydaspermont@student-cs.fr
                                    mathurin.lebrun@student-cs.fr
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
                                        backgroundColor: 'primary.red'     
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
                                        backgroundColor: 'primary.red' 
                                            
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
                            </Grid>
                        </Grid>
                        <Grid container  sx={{display:{xs:'none',sm:'none',md:'block'},backgroundColor:'secondary.dark',py:'1rem'}} >

                            <Grid item sx={{backgroundColor:'secondary.dark',color:"grey.400"}}>
                            <Typography variant='h5' sx={{fontWeight:'bold',mb:'1rem'}}>NAVIGATION RAPIDE</Typography>   
                            <Link 
                                href="/#deroulement" 
                                color="inherit" 
                                underline="none" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    const element = document.getElementById('deroulement');
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    } else {
                                        window.location.href = '/#deroulement';
                                    }
                                }}
                                sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1rem', xs: '0.6rem' }, cursor: 'pointer' }}
                            > 
                                Planning 
                            </Link>
                            <Link 
                                href="/#sixtemen" 
                                color="inherit" 
                                underline="none"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const element = document.getElementById('sixtemen');
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    } else {
                                        window.location.href = '/#sixtemen';
                                    }
                                }}
                                sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1rem', xs: '0.6rem' }, cursor: 'pointer' }}
                            >
                                L&apos;équipe
                            </Link>
                            <Link 
                                href="/#video" 
                                color="inherit" 
                                underline="none"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const element = document.getElementById('video');
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    } else {
                                        window.location.href = '/#video';
                                    }
                                }}
                                sx={{ display: 'block',marginBottom: theme.spacing(1), fontSize: { sm: '1rem', xs: '0.6rem' }, cursor: 'pointer' }}
                            > 
                                Le récap 2025
                            </Link>
                            </Grid> 
                        </Grid>
                    </Grid> 
                    <Grid item xs={12} md={3} sx={{
                        backgroundColor: 'primary.red',
                        display: {xs:'none',md:'flex'},
                        justifyContent: 'center',
                        alignItems: 'center',                        
                    }}
                    >
                        <img src="../images/Logo_BDS_Blanc.png" alt="logo bds" style={{ width: '40%', maxWidth: '100%' }}
                         />
                    </Grid>
                </Grid>  
            </Box>
        </>
    )
};



export default Footer