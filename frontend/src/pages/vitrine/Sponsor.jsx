import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,Fade,Slide } from "@mui/material";
import LayoutUnauthenticated from "../../components/layouts/LayoutUnauthenticated";
import Footer from "../../components/footer/footer";
const Sponsor = () => {
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
                                 Nos Partenaires
                                </Typography>
                            </Box>
              
               <Box sx={{display:'flex',
    alignItems: "center",
    justifyContent: "space-between"}}>
                <Box>
                <img sx={{maxWidth: "100%", height: "auto",}} src='/images/redbull_logo.png' alt='Logo Redbull'/>
                </Box>
                <Box sx={{paddingRight:'9.375rem',fontSize:'1.25rem'}}>
Red Bull est une entreprise 
autrichienne fondée en 1984 par Dietrich 
Mateschitz et Chaleo Yoovidhya, mondialement connue pour son 
emblématique boisson énergisante. Elle a révolutionné l'industrie 
des boissons en lançant le premier produit énergisant de grande 
consommation en 1987, avec pour slogan "Red Bull donne des ailes".
Au-delà de ses produits, 
Red Bull est une marque à forte identité, 
associée à l'innovation, l'audace et la performance. Elle s'investit 
dans le sponsoring sportif, les événements extrêmes, les associations étudiantes et détient des 
équipes de renom comme Red Bull Racing en Formule 1 et des clubs de 
football tels que le RB Leipzig. Son influence dépasse le simple domaine 
des boissons, en faisant une référence incontournable dans le lifestyle et le sport.
                </Box>
               </Box>
               <Box sx={{display:'flex',
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "2.5rem",}}>
                <Box sx={{paddingLeft:'9.375rem',paddingRight:'2.5rem',fontSize:'1.25rem'}}>
Lydia est une entreprise française fondée en 2013 par Cyril Chiche et 
Antoine Porte, spécialisée dans les solutions de paiement mobile. Initialement
connue pour son application permettant d’effectuer des paiements entre particuliers 
de manière simple et rapide, Lydia s’est rapidement imposée comme un acteur majeur de la fintech en France.
Aujourd’hui, Lydia propose une large gamme de services financiers : gestion de comptes bancaires, 
paiements sans contact, cartes bancaires virtuelles, prêts instantanés, et même des solutions d’épargne. 
Plébiscitée par les jeunes générations, elle se distingue par son interface intuitive et sa capacité à 
innover dans le secteur des paiements numériques. Avec des millions d’utilisateurs en Europe, Lydia 
continue de redéfinir la manière dont nous interagissons avec l’argent au quotidien.
                </Box>
                <Box sx={{paddingRight:'9.375rem'}}>
                    <img sx={{width:'100%',height:'50%'}}src='images/logo_lydia.png' alt='Logo Lydia'/>
                </Box>
               </Box>
               <Box sx={{display:'flex',alignItems:'center',justifyContent:'center',marginTop: "1.25rem",
                paddingBottom: "2.5rem",fontSize:'1.25rem'}}>
                Contact partenaires: <a href="mailto:contact-partenaires@cs-sports.fr" target="_blank">contact-partenaires@cs-sports.fr</a>
               </Box>
               <Footer/>

            </Box>
        </LayoutUnauthenticated>
    );
};

export default Sponsor;
