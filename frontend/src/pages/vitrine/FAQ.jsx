import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,Fade,Slide } from "@mui/material";
import LayoutUnauthenticated from "../../components/layouts/LayoutUnauthenticated";

const FAQ = () => {
    const isDarkMode = false;



    return (
        <LayoutUnauthenticated isDarkMode={isDarkMode}>
            <Box>
                <Box sx={{display : "flex"}}>
                    <Box sx={{display:'flex',flexDirection:'column', justifyContent:'center',alignItems:'center', width:"50%", padding:'4rem'}}>
                        <h1 sx={{fontWeight: 'bold'}}>La journée</h1>
                        <p sx={{className:"left-align"}}>Le Tournoi se déroule sur toute la journée avec 32 équipes pour les hommes et 16 pour les femmes. Le matin se jouera la phase de poule, et l'après-midi auront lieu la phase finale et le tournoi de consolantes. Entre-temps vous aurez l'occasion de reprendre des forces avec un repas chaud de qualité. L'après-midi vous aurez aussi la possibilité d'une visite exceptionnelle du musée des Bleus, prendre des photos devant la coupe du monde
                        </p>
                        <img src="../public/images/FAQ.jpg" alt="Photo de l'équipe" style={{height:"100%", width: "100%",objectFit: "cover"}}/>
                    </Box>
                    <Box sx={{display:'flex',flexDirection:'column', justifyContent:'center',alignItems:'center', width:"50%"}}>
                        <h1 sx={{fontWeight: "bold"}}>Acces</h1>
                        <Box sx={{height: '100px', width: '400px'}}>

                        </Box>
                        <p sx={{className:"left-align"}}>Domaine de Montjoye<br/>78120<br/>Clairefontaine-en-Yvelines
                        </p>
                    </Box>
                </Box>
                <Box sx={{display:'flex',flexDirection:'column', justifyContent:'center',alignItems:'center',paddingLeft:'4rem'}}>
                    <h1 sx={{fontWeight: "bold", margin:'0.01'}}>Les Tarifs</h1>
                    <p sx={{margin:'0.01'}}>L'inscription au tournoi est de <strong> 44€ </strong> par participant (pas déterminé précisément encore).
                    Pour les boursiers, elle s'élève à <strong>28€</strong> sous présentation du justificatif</p>
                    <p sx={{}}>Elle inclut la collation du matin, le repas, la visite du musée ou château et le tournoi avec ses diverses activités</p>
                    <h1 sx={{fontWeight: "bold"}}>F.A.Q</h1>
                </Box>
                <Box sx={{textAlign: 'left',paddingLeft:'4rem'}}>
                    <h1 sx={{fontWeight: "bold", textAlign: 'left'}}>Inscriptions</h1>
                </Box>
                <Box sx={{display:'flex',flexDirection:'column', justifyContent:'center',alignItems:'center', paddingLeft:'4rem'}}>
                    <Box sx={{display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'center'}}>
                        <h2 sx={{fontWeight: "bold", margin:'0.1'}}>Est-ce que les coachs et les supporters peuvent venir?</h2>
                        <p sx={{}}>Les coachs et les supporters <strong>ne peuvent pas</strong> venir au Sixte, seuls les joueurs étudiants le peuvent en s’inscrivant en équipe sur le site.</p>
                    </Box>
                    <Box sx={{display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'center', padding:'4rem'}}>
                        <h2 sx={{fontWeight: "bold", margin:'0.1'}}>Combien d’équipes une école peut-elle inscrire ?</h2>
                        <p sx={{textAlign:'Center'}}>Une école peut inscrire au plus deux équipes dans le tournoi féminin et deux dans le tournoi masculin ; si elle en inscrit deux dans un tournoi, l’équipe “deux” restera en liste d’attente et ne pourra être validée avant le 6 février, date à laquelle elle pourra être validée si son dossier est complet (paiement + chartes) et s’il reste de la place.</p>
                    </Box>
                    <Box sx={{display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'center', padding:'4rem'}}>
                        <h2 sx={{fontWeight: "bold", margin:'0.1'}}>L’inscription sur le site me réserve-t-elle la place ?</h2>
                        <p sx={{}}>L’inscription ne peut être validée qu’une fois toutes les chartes signées et le paiement effectué, l’inscription seule ne réserve pas la place.</p>
                    </Box>
                    <Box sx={{display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'center', padding:'4rem'}}>
                        <h2 sx={{fontWeight: "bold", margin:'0.1'}}>Qu’est ce qui est compris dans le tarif ?</h2>
                        <p sx={{}}>Le tarif indiviuel pour le Sixte 2024 est de 44 euros. Sport, déjeuner, boisson chaude offerte, accès aux actis. La visite du musée des Bleus et/ou le château des bleus sera accessible.</p>
                    </Box>
                </Box>
                <Box sx={{textAlign: 'left',paddingLeft:'4rem'}}>
                    <h1 sx={{fontWeight: "bold", textAlign: 'left'}}>Aspects pratiques</h1>
                </Box>
                <Box sx={{display:'flex',flexDirection:'column', justifyContent:'center',alignItems:'center',paddingLeft:'4rem'}}>
                    <Box sx={{padding:'2rem', display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'center'}}>
                        <h2 sx={{fontWeight: "bold"}}>Comment se rendre au Sixte ?</h2>
                        <p sx={{}}>L’organisation ne prévoit pas de moyens de transports pour rejoindre le tournoi ; les participants doivent se rendre en voiture/ car sur place (Château de Montjoye, 78120 Clairefontaine-en-Yvelines) (parking disponible).</p>
                    </Box>
                    <Box sx={{padding:'2rem', display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'center'}}>
                        <h2 sx={{fontWeight: "bold", margin:'0.1'}}>Quel matériel prévoir ?</h2>
                        <p sx={{}}>Le matériel que doivent prévoir les joueurs : chaussures à crampons moulés, les crampons vissés sont interdits (terrains synthétiques), protèges-tibias, ballons d’échauffement (ballons non prêtés)</p>
                    </Box>
                    <Box sx={{padding:'2rem', display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'center'}}>
                        <h2 sx={{fontWeight: "bold", margin:'0.1'}}>Qu’est-ce que propose la buvette ?</h2>
                        <p sx={{}}>La buvette propose des boissons chaudes et froides.</p>
                    </Box>
                </Box>
                <Box sx={{textAlign: 'left',paddingLeft:'4rem'}}>
                    <p sx={{}}>Une autre question ? Envoie un mail à <a href="sixte@cs-sports.fr" style={{ textDecoration: 'none' }}>sixte@cs-sports.fr</a></p>
                </Box>
            </Box>
        </LayoutUnauthenticated>
    );
};

export default FAQ;