import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,Fade,Slide, Container } from "@mui/material";
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
                                        paddingTop: {md:'3rem', xs:'1rem', lg:'10rem'},

                                    }}
                                >
                                 Nos Partenaires
                                </Typography>
                            </Box>
              
               <Container maxWidth="lg" sx={{ paddingY: '4rem' }}>
                   {/* Red Bull Section */}
                   <Box sx={{
                       display:'flex',
                       alignItems: "center",
                       justifyContent: "space-between",
                       paddingTop: {md:'3rem', xs:'1rem', lg:'10rem'},
                       paddingBottom: "6rem",
                       gap: '3rem',
                       flexDirection: { xs: 'column', md: 'row' }
                   }}>
                       <Box
                           component="img"
                           src="/images/redbull_logo.png"
                           alt="Red Bull Logo"
                           sx={{
                               height: { xs: '5rem', sm: '7rem', md: '10rem', lg: '12rem' },
                               width: 'auto',
                               objectFit: 'contain',
                               flex: '0 0 auto'
                           }}
                       />
                       <Box sx={{
                           flex: '1 1 auto',
                           fontSize: { xs: '1rem', md: '1.1rem', lg: '1.25rem' },
                           lineHeight: 1.6,
                           textAlign: { xs: 'center', md: 'left' }
                       }}>
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

                   {/* Lydia Section */}
                   <Box sx={{
                       display:'flex',
                       alignItems: "center",
                       justifyContent: "space-between",
                       marginBottom: "2.5rem",
                       gap: '3rem',
                       flexDirection: { xs: 'column-reverse', md: 'row' }
                   }}>
                       <Box sx={{
                           flex: '1 1 auto',
                           fontSize: { xs: '1rem', md: '1.1rem', lg: '1.25rem' },
                           lineHeight: 1.6,
                           textAlign: { xs: 'center', md: 'left' }
                       }}>
Lydia est une entreprise française fondée en 2013 par Cyril Chiche et 
Antoine Porte, spécialisée dans les solutions de paiement mobile. Initialement
connue pour son application permettant d’effectuer des paiements entre particuliers 
de manière simple et rapide, Lydia s’est rapidement imposée comme un acteur majeur de la fintech en France.
Aujourd’hui, Lydia propose une large gamme de services financiers : gestion de comptes bancaires, 
paiements sans contact, cartes bancaires virtuelles, prêts instantanés, et même des solutions d’épargne. 
Plébiscitée par les jeunes générations, elle se distingue par son interface intuitive et sa capacité à 
innover dans le secteur des paiements numériques. Avec des millions d’utilisateurs en Europe, Lydia 
continue de redéfinir la manière dont nous interagissons avec l'argent au quotidien.
                       </Box>
                       <Box sx={{ flex: '0 0 auto' }}>
                           <Box
                               component="img"
                               src='images/logo_lydia.png'
                               alt='Logo Lydia'
                               sx={{
                                   height: { xs: '5rem', sm: '7rem', md: '10rem', lg: '12rem' },
                                   width: 'auto',
                                   objectFit: 'contain'
                               }}
                           />
                       </Box>
                   </Box>
               </Container>

               <Box sx={{
                   display:'flex',
                   alignItems:'center',
                   justifyContent:'center',
                   marginTop: "5.25rem",
                   paddingBottom: "2.5rem",
                   fontSize: { xs: '1rem', md: '1.25rem' },
                   flexDirection: { xs: 'column', sm: 'row' },
                   gap: 1
               }}>
                   <Typography component="span">Contact partenaires:</Typography>{' '}
                   <a href="mailto:contact-partenaires@cs-sports.fr" target="_blank" rel="noreferrer">contact-partenaires@cs-sports.fr</a>
               </Box>
               <Footer/>

            </Box>
        </LayoutUnauthenticated>
    );
};

export default Sponsor;
