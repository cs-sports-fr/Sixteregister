import { Box, Button, Typography, ThemeProvider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,Fade,Slide, colors } from "@mui/material";
import LayoutUnauthenticated from "../../components/layouts/LayoutUnauthenticated";

import palette from '../../themes/palette';



const FAQ = () => {
    const isDarkMode = false;

    return (
        <LayoutUnauthenticated isDarkMode={isDarkMode}>
            <Box sx={{color: palette.secondary.dark}}>
            
                <Box sx={{display : "flex"}}>
                    <Box sx={{display:'flex',flexDirection:'column',alignItems:'center', width:"50%", padding:'4rem'}}>
                        <h1 sx={{ fontWeight: 'bold', textAlign: 'center', color: palette.secondary.dark}}>LA JOURNÉE</h1>
                        <Typography variant="p" sx={{className:"left-align", color: palette.secondary.main, paddingBottom: '2rem'}}>Le Tournoi se déroule sur toute la journée avec 32 équipes pour les hommes et 16 pour les femmes. Le matin se jouera la phase de poule, et l'après-midi auront lieu la phase finale et le tournoi de consolantes. Entre-temps vous aurez l'occasion de reprendre des forces avec un repas chaud de qualité. L'après-midi vous aurez aussi la possibilité d'une visite exceptionnelle du musée des Bleus, prendre des photos devant la coupe du monde
                        </Typography>
                        <img src="../public/images/FAQ.jpg" alt="Photo de l'équipe" style={{height:"100%", width: "100%",objectFit: "cover"}}/>
                    </Box>
                    <Box sx={{display:'flex',flexDirection:'column',alignItems:'center', width:"50%", padding:'4rem'}}>
                        <h1 sx={{ fontWeight: "bold", textAlign: 'center'}}>ACCÈS</h1>
                        <Box sx={{height: '3rem'}}></Box>
                        <Box sx={{ width: '100%', height: '100%', marginTop: '2rem', marginBottom:'3rem' }}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2637.6111544623736!2d1.9163921766155874!3d48.617285971300426!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e42f49b781a471%3A0xf4de842ec780a674!2sCentre%20National%20du%20Football!5e0!3m2!1sfr!2sfr!4v1734372630446!5m2!1sfr!2sfr"
                            width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                        </Box>
                        
                        <Typography sx={{textAlign:'left', color: palette.secondary.main}}>Domaine de Montjoye<br/>78120<br/>Clairefontaine-en-Yvelines
                        </Typography>
                    </Box>
                
                </Box>
                <Box sx={{width: '80%', paddingLeft:'10%', textAlign:'center'}}>
                <Box sx={{display:'flex',flexDirection:'column', justifyContent:'center',alignItems:'center'}}>
                <Box sx={{textAlign: 'center', color:palette.primary.main}}>
                    <h1 sx={{fontWeight: "bold"}}>Les tarifs</h1>
                </Box>
                    <Typography sx={{margin:'0.01', color: palette.secondary.main, textAlign:'center'}}>L'inscription au tournoi est de <Box component="strong" sx={{ color: palette.primary.main }}>44€</Box>  par participant (pas déterminé précisément encore).<br/>
                    Pour les boursiers, elle s'élève à <Box component="strong" sx={{ color: palette.primary.main }}>28€</Box>  sous présentation du justificatif.<br/><br/>Elle inclut la collation du matin, le repas, la visite du musée ou château et le tournoi avec ses diverses activités</Typography>
                </Box>
                <Box sx={{textAlign: 'center', color:palette.primary.main}}>
                    <h1 sx={{fontWeight: "bold"}}>FAQ - Inscriptions</h1>
                </Box>
                <Box sx={{display:'flex',flexDirection:'column', justifyContent:'center',alignItems:'center'}}>
                    <Box sx={{display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'center'}}>
                        <h2 sx={{fontWeight: "bold", margin:'0.1'}}>Est-ce que les coachs et les supporters peuvent venir?</h2>
                        <Typography sx={{color: palette.secondary.main, marginBottom:'2rem'}}>Les coachs et les supporters <strong>ne peuvent pas</strong> venir au Sixte, seuls les joueurs étudiants le peuvent en s’inscrivant en équipe sur le site.</Typography>
                    </Box>
                    <Box sx={{display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'center'}}>
                        <h2 sx={{fontWeight: "bold", margin:'0.1'}}>Combien d’équipes une école peut-elle inscrire ?</h2>
                        <Typography sx={{ color: palette.secondary.main, marginBottom:'2rem'}}>Une école peut inscrire au plus deux équipes dans le tournoi féminin et deux dans le tournoi masculin ; si elle en inscrit deux dans un tournoi, l’équipe “deux” restera en liste d’attente et ne pourra être validée avant le 6 février, date à laquelle elle pourra être validée si son dossier est complet (paiement + chartes) et s’il reste de la place.</Typography>
                    </Box>
                    <Box sx={{display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'center'}}>
                        <h2 sx={{fontWeight: "bold", margin:'0.1'}}>L’inscription sur le site me réserve-t-elle la place ?</h2>
                        <Typography sx={{color: palette.secondary.main, marginBottom:'2rem'}}>L’inscription ne peut être validée qu’une fois toutes les chartes signées et le paiement effectué, l’inscription seule ne réserve pas la place.</Typography>
                    </Box>
                    <Box sx={{display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'center'}}>
                        <h2 sx={{fontWeight: "bold", margin:'0.1'}}>Qu’est ce qui est compris dans le tarif ?</h2>
                        <Typography sx={{color: palette.secondary.main, marginBottom:'2rem'}}>Le tarif indiviuel pour le Sixte 2024 est de 44 euros. Sport, déjeuner, boisson chaude offerte, accès aux actis. La visite du musée des Bleus et/ou le château des bleus sera accessible.</Typography>
                    </Box>
                </Box>
                <Box sx={{textAlign: 'center', color:palette.primary.main}}>
                    <h1 sx={{fontWeight: "bold", textAlign: 'left', color:palette.primary.main}}>FAQ - Aspects pratiques</h1>
                </Box>
                <Box sx={{display:'flex',flexDirection:'column', justifyContent:'center',alignItems:'center'}}>
                    <Box sx={{ display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'center'}}>
                        <h2 sx={{fontWeight: "bold"}}>Comment se rendre au Sixte ?</h2>
                        <Typography sx={{color: palette.secondary.main, marginBottom:'2rem'}}>L’organisation ne prévoit pas de moyens de transports pour rejoindre le tournoi ; les participants doivent se rendre en voiture/ car sur place (Château de Montjoye, 78120 Clairefontaine-en-Yvelines) (parking disponible).</Typography>
                    </Box>
                    <Box sx={{ display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'center'}}>
                        <h2 sx={{fontWeight: "bold", margin:'0.1'}}>Quel matériel prévoir ?</h2>
                        <Typography sx={{color: palette.secondary.main, marginBottom:'2rem'}}>Le matériel que doivent prévoir les joueurs : chaussures à crampons moulés, les crampons vissés sont interdits (terrains synthétiques), protèges-tibias, ballons d’échauffement (ballons non prêtés)</Typography>
                    </Box>
                    <Box sx={{ display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'center'}}>
                        <h2 sx={{fontWeight: "bold", margin:'0.1'}}>Qu’est-ce que propose la buvette ?</h2>
                        <Typography sx={{color: palette.secondary.main, marginBottom:'2rem'}}>La buvette propose des boissons chaudes et froides.</Typography>
                    </Box>
                </Box>
                <Box sx={{textAlign: 'left', paddingTop:'2rem', paddingBottom:'2rem'}}>
                <Typography sx={{color: palette.secondary.main}}>
                    Une autre question ? Envoie un mail à 
                    <Link href="mailto:sixte@cs-sports.fr" sx={{ textDecoration: 'none' }}>
                        sixte@cs-sports.fr
                    </Link>
                </Typography>
                </Box>
                </Box>
                

            </Box>
        </LayoutUnauthenticated>
    );
};

export default FAQ; 
