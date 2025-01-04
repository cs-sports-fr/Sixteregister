import React, { useState } from 'react';
import { Box, Typography, IconButton, Collapse, Link } from '@mui/material';
import LayoutUnauthenticated from '../../components/layouts/LayoutUnauthenticated';
import Footer from '../../components/footer/footer';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import palette from '../../themes/palette';

const FaqPractical = () => {
    const isDarkMode = false;
    const [expandedIndices, setExpandedIndices] = useState([]);

    const handleExpandClick = (index) => {
        setExpandedIndices((prevIndices) =>
            prevIndices.includes(index)
                ? prevIndices.filter((i) => i !== index)
                : [...prevIndices, index]
        );
    };

    const faqEntries = [
        {
            question: "Déroulement de la journée",
            answer: (
                <Box sx={{ mt: 2 }}>
                    <Typography
                        sx={{
                            color: palette.secondary.main,
                            mb: 2,
                            fontSize: { xs: '1.2rem', sm: '1.2rem', md: '1.2rem', lg: '1rem' },
                        }}
                    >
                        Le Tournoi se déroule sur toute la journée avec 32 équipes pour les hommes et 16 pour les femmes. Le matin se jouera la phase de poule, et l'après-midi auront lieu la phase finale et le tournoi de consolantes. 
                        Entre-temps, vous aurez l'occasion de reprendre des forces avec un repas chaud de qualité. 
                        L'après-midi, vous aurez aussi la possibilité d'une visite exceptionnelle du musée des Bleus, 
                        prendre des photos devant la coupe du monde...
                    </Typography>
                </Box>
            )
        },
        {
            question: "Comment accéder aux infrastructures ? ",
            answer: (
                <Box sx={{ mt: 2 }}>
                    <Typography
                        sx={{
                            color: palette.secondary.main,
                            mb: 2,
                            fontSize: { xs: '1.2rem', sm: '1.2rem', md: '1.2rem', lg: '1rem' },
                        }}
                    >
                        L’organisation ne prévoit pas de moyens de transports pour rejoindre le tournoi ; 
                        les participants doivent se rendre en voiture ou en car sur place 
                        (Château de Montjoye, 78120 Clairefontaine-en-Yvelines) (parking disponible).
                    </Typography>
                    <Box sx={{ width: '100%', height: '400px' }}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2637.6111544623736!2d1.9163921766155874!3d48.617285971300426!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e42f49b781a471%3A0xf4de842ec780a674!2sCentre%20National%20du%20Football!5e0!3m2!1sfr!2sfr!4v1734372630446!5m2!1sfr!2sfr"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </Box>
                </Box>
            )
        },
        {
            question: "Quel sont les tarifs et qu'incluent-ils ? ",
            answer: (
                <Box sx={{ mt: 2 }}>
                    <Typography
                        sx={{
                            color: palette.secondary.main,
                            fontSize: { xs: '1.2rem', sm: '1.2rem', md: '1.2rem', lg: '1rem' },
                        }}
                    >
                        L'inscription au tournoi est de <strong style={{ color: palette.primary.main }}>44€</strong> par participant.
                        <br />
                        Pour les boursiers, elle s'élève à <strong style={{ color: palette.primary.main }}>28€</strong> sous présentation du justificatif.
                        <br /><br />
                        Elle inclut la collation du matin, le repas, la visite du musée ou château et le tournoi 
                        avec ses diverses activités.
                    </Typography>
                </Box>
            )
        },
        {
            question: "Est-ce que les coachs et les supporters peuvent venir ?",
            answer: (
                <Box sx={{ mt: 2 }}>
                    <Typography
                        sx={{
                            color: palette.secondary.main,
                            fontSize: { xs: '1.2rem', sm: '1.2rem', md: '1.2rem', lg: '1rem' },
                        }}
                    >
                        Les coachs et les supporters <strong>ne peuvent pas</strong> venir au Sixte, seuls les 
                        joueurs étudiants le peuvent en s’inscrivant en équipe sur le site.
                    </Typography>
                </Box>
            )
        },
        {
            question: "Combien d’équipes une école peut-elle inscrire ?",
            answer: (
                <Box sx={{ mt: 2 }}>
                    <Typography
                        sx={{
                            color: palette.secondary.main,
                            fontSize: { xs: '1.2rem', sm: '1.2rem', md: '1.2rem', lg: '1rem' },
                        }}
                    >
                        Une école peut inscrire au plus deux équipes dans le tournoi féminin et deux dans le 
                        tournoi masculin. Si elle en inscrit deux dans un tournoi, l’équipe “deux” restera en 
                        liste d’attente et ne pourra être validée avant le 6 février, date à laquelle elle 
                        pourra être validée si son dossier est complet (paiement + chartes) et s’il reste 
                        de la place.
                    </Typography>
                </Box>
            )
        },
        {
            question: "L’inscription sur le site me réserve-t-elle la place ?",
            answer: (
                <Box sx={{ mt: 2 }}>
                    <Typography
                        sx={{
                            color: palette.secondary.main,
                            fontSize: { xs: '1.2rem', sm: '1.2rem', md: '1.2rem', lg: '1rem' },
                        }}
                    >
                        L’inscription ne peut être validée qu’une fois toutes les chartes signées 
                        et le paiement effectué, l’inscription seule ne réserve pas la place.
                    </Typography>
                </Box>
            )
        },
        {
            question: "Quel matériel prévoir ?",
            answer: (
                <Box sx={{ mt: 2 }}>
                    <Typography
                        sx={{
                            color: palette.secondary.main,
                            fontSize: { xs: '1.2rem', sm: '1.2rem', md: '1.2rem', lg: '1rem' },
                        }}
                    >
                        Le matériel que doivent prévoir les joueurs : chaussures à crampons moulés 
                        (les crampons vissés sont interdits sur terrains synthétiques), protège-tibias, 
                        ballons d’échauffement (ballons non prêtés).
                    </Typography>
                </Box>
            )
        },
        {
            question: "Qu’est-ce que propose la buvette ?",
            answer: (
                <Box sx={{ mt: 2 }}>
                    <Typography
                        sx={{
                            color: palette.secondary.main,
                            fontSize: { xs: '1.2rem', sm: '1.2rem', md: '1.2rem', lg: '1rem' },
                        }}
                    >
                        La buvette propose des boissons chaudes et froides.
                    </Typography>
                </Box>
            )
        },
        {
            question: "Une autre question ?",
            answer: (
                <Box sx={{ mt: 2 }}>
                    <Typography
                        sx={{
                            color: palette.secondary.main,
                            fontSize: { xs: '1.2rem', sm: '1.2rem', md: '1.2rem', lg: '1rem' },
                        }}
                    >
                        Envoie un mail à{" "}
                        <Link
                            href="mailto:sixte@cs-sports.fr"
                            sx={{ textDecoration: 'none' }}
                        >
                            sixte@cs-sports.fr
                        </Link>
                    </Typography>
                </Box>
            )
        },
    ];

    return (
        <LayoutUnauthenticated isDarkMode={isDarkMode}>
            <Box
                component="div"
                sx={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    backgroundPosition: 'center',
                    alignItems: 'center',
                    width: '100%',
                    overflow: 'hidden'
                }}
            >
                {/* Header Title */}
                <Box sx={{ height: '20vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                        Infos Pratiques
                    </Typography>
                </Box>

                {/* Collapsible FAQ Entries */}
                <Box sx={{ width: '80%', maxWidth: '1000px' }}>
                    {faqEntries.map((item, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                            <Box
                                onClick={() => handleExpandClick(index)}
                                sx={{
                                    p: 2,
                                    backgroundColor: expandedIndices.includes(index) ? 'grey.200' : 'transparent',
                                    borderRadius: '15px',
                                    ':hover': {
                                        backgroundColor: 'grey.200',
                                        cursor: 'pointer'
                                    }
                                }}
                            >
                                {/* Question row */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <IconButton sx={{ display: { xs: 'none', sm: 'flex' } }}>
                                        {expandedIndices.includes(index)
                                            ? <ExpandLessIcon sx={{ color: 'grey.800' }} />
                                            : <ExpandMoreIcon sx={{ color: 'grey.800' }} />
                                        }
                                    </IconButton>
                                    <Typography sx={{ color: 'grey.800', fontWeight: 'bold', fontSize: { xs: '1.2rem', md: '1.3rem' } }}>
                                        {item.question}
                                    </Typography>
                                </Box>

                                {/* Collapsible content */}
                                <Collapse in={expandedIndices.includes(index)} timeout="auto" unmountOnExit>
                                    <Box sx={{ mt: 2 }}>
                                        {item.answer}
                                    </Box>
                                </Collapse>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
            <Footer />
        </LayoutUnauthenticated>
    );
};

export default FaqPractical;
