import { Box } from "@mui/material";
import { blue, green, red } from "@mui/material/colors";
import palette from "../../themes/palette";



const Footer = ({ navigation }) => {
    const isDarkMode = true;

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent:'center space-between',   
                    backgroundColor:'grey'
                }}

            >
                <Box sx={{
                    display : "flex",
                    lignItems: 'center',
                    justifyContent:'center',
                    justifyContent:'space-between',  
                }}
                >
                    <Box>
                        <h1>NOUS CONTACTER</h1>
                        <p>3, rue Joliot-Curie,
                        Gif-sur-Yvette, 91190</p>
                        <p>
                        sixte@cs-sports.fr
                        </p>
                        <Box sx={{
                            display:"grid",
                            gridTemplateColumns:"1fr 1fr "
                            }}
                        >
                            <Box sx={{ backgroundColor:'primary.main'

                                
                                
                            }}>
                            <a href="https://www.instagram.com/bds_centralesupelec/?hl=fr" style={{height:'100%',width:'100%', objectFit: 'cover',}}> <img src="" alt="notre instagram" /></a>
                            </Box>
                            <Box sx={{
                                border:'2px white solid ',
                                borderRadius:'100%',
                                width:'5rem',
                                height:'5rem'

                                
                                
                            }}
                            >
                            <a href="https://www.facebook.com/CentraleSupelecSports/?locale=fr_FR" style={{}}> <img src="" alt="notre facebook" /></a>
                            </Box>
                        </Box>
                    </Box>
                    <Box>
                        <h1>LIENS</h1>
                        <li>
                            <ul>
                                <a href="" style={{textDecoration:'none', color: 'inherit'}}> Acceuil</a>
                            </ul>
                            <ul>
                                <a href="" style={{textDecoration:'none', color: 'inherit'}}> Résultats</a>
                            </ul>
                            <ul>
                                <a href="" style={{textDecoration:'none', color: 'inherit'}}> Galerie photo </a>
                            </ul>
                            <ul>
                                <a href="" style={{textDecoration:'none', color: 'inherit'}}>Nos partenaires</a>
                            </ul>
                            <ul>
                                <a href="" style={{textDecoration:'none', color: 'inherit'}}> Infos</a>
                            </ul>
                            <ul>
                                <a href="" style={{textDecoration:'none', color: 'inherit'}}> Espace Admin</a>
                            </ul>
                            <ul>
                                <a href="" style={{textDecoration:'none', color: 'inherit'}}> Règlement</a>
                            </ul>
                            <ul>
                                <a href="" style={{textDecoration:'none', color: 'inherit'}}> CGI</a>
                            </ul>
                        </li>
                    
                    </Box>
                    <Box sx={{
                            width: '100%', height: 'auto'
                    }}
                    >
                    <h1>NAVIGATION RAPIDE</h1>
                        <li>
                            <ul>
                                <a href="" style={{textDecoration:'none', color: 'inherit'}}> Acceuil</a>
                            </ul>
                            <ul>
                                <a href="" style={{textDecoration:'none', color: 'inherit'}}> A propos</a>
                            </ul>
                            <ul>
                                <a href="" style={{textDecoration:'none', color: 'inherit'}}> Planning </a>
                            </ul>
                            <ul>
                                <a href="" style={{textDecoration:'none', color: 'inherit'}}>L'équipe</a>
                            </ul>
                            <ul>
                                <a href="" style={{textDecoration:'none', color: 'inherit'}}> Le récap 2024</a>
                            </ul>
                            <ul>
                                <a href="" style={{textDecoration:'none', color: 'inherit'}}>Nous contacter</a>
                            </ul>
                            
                        </li> 
                    </Box>
                </Box> 
                <Box sx={{
                    backgroundColor: 'blue',
                    width: '40vw',
                    height: '100%'
                }}
                >
                    <img src="../images/Logo_BDS_Blanc.png" alt="logo bds" style={{
                       height:'100%',width:'100%', objectFit: 'cover',}} />
                </Box>  
            </Box>
        </>
    )
};



export default Footer