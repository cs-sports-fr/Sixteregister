import React, { useState } from 'react';
import { Box, Typography, IconButton, Collapse, Link, Button } from '@mui/material';
import LayoutUnauthenticated from '../../components/layouts/LayoutUnauthenticated';
import Footer from '../../components/footer/footer';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
            question: "Règlements officiels du tournoi",
            answer: (
                <Box sx={{ mt: 2 }}>
                    <Typography
                        sx={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: { xs: '1rem', md: '1.1rem' },
                            lineHeight: 1.8,
                            marginBottom: '1.5rem',
                        }}
                    >
                        Consultez les règlements officiels du tournoi pour connaître toutes les modalités de participation :
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Button
                            variant="contained"
                            href="/CGI/Reglement_F_2026_SIXTE.pdf"
                            target="_blank"
                            sx={{
                                backgroundColor: palette.primary.red,
                                color: 'white',
                                padding: '0.75rem 1.5rem',
                                '&:hover': {
                                    backgroundColor: '#e55a5a',
                                },
                            }}
                        >
                            📄 Télécharger le Règlement Féminin 2026
                        </Button>
                        <Button
                            variant="contained"
                            href="/CGI/Reglement_M_2026_SIXTE.pdf"
                            target="_blank"
                            sx={{
                                backgroundColor: palette.primary.red,
                                color: 'white',
                                padding: '0.75rem 1.5rem',
                                '&:hover': {
                                    backgroundColor: '#e55a5a',
                                },
                            }}
                        >
                            📄 Télécharger le Règlement Masculin 2026
                        </Button>
                    </Box>
                </Box>
            )
        },
        {
            question: "Déroulement de la journée",
            answer: (
                <Box sx={{ mt: 2 }}>
                    <Typography
                        sx={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            mb: 2,
                            fontSize: { xs: '1rem', md: '1.1rem' },
                            lineHeight: 1.8,
                        }}
                    >
                        Le Tournoi se déroule sur toute la journée avec 32 équipes pour les hommes et 16 pour les femmes. Le matin se jouera la phase de poule, et l&apos;après-midi auront lieu la phase finale et le tournoi de consolantes.
                        Entre-temps, vous aurez l&apos;occasion de reprendre des forces avec un repas chaud de qualité.
                        L&apos;après-midi, vous aurez aussi la possibilité d&apos;une visite exceptionnelle du musée des Bleus,
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
                            color: 'rgba(255, 255, 255, 0.9)',
                            mb: 2,
                            fontSize: { xs: '1rem', md: '1.1rem' },
                            lineHeight: 1.8,
                        }}
                    >
                        L&apos;organisation ne prévoit pas de moyens de transports pour rejoindre le tournoi ;
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
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: { xs: '1rem', md: '1.1rem' },
                            lineHeight: 1.8,
                        }}
                    >
                        L&apos;inscription au tournoi est de <strong style={{ color: palette.primary.red }}>48€</strong> par participant.
                        <br />
                        Pour les boursiers, elle s&apos;élève à <strong style={{ color: palette.primary.red }}>30€</strong> sous présentation du justificatif.
                        <br />
                        Pour les électrocentraliens, elle s&apos;élève à <strong style={{ color: palette.primary.red }}>37€</strong> sous présentation du justificatif.
                        <br />
                        <br />

                        Elle inclut la collation du matin, le repas, la visite du musée ou vestiaire des bleus et le tournoi
                        avec ses diverses activités.
                        <br /><br />
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
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: { xs: '1rem', md: '1.1rem' },
                            lineHeight: 1.8,
                        }}
                    >
                        Les coachs et les supporters <strong>ne peuvent pas</strong> venir au Sixte, seuls les
                        joueurs étudiants le peuvent en s&apos;inscrivant en équipe sur le site.
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
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: { xs: '1rem', md: '1.1rem' },
                            lineHeight: 1.8,
                        }}
                    >
                        Une école peut inscrire au plus deux équipes dans le tournoi féminin et deux dans le
                        tournoi masculin. Si elle en inscrit deux dans un tournoi, l&apos;équipe &quot;deux&quot; restera en
                        liste d&apos;attente et ne pourra être validée avant le 15 janvier, date à laquelle elle
                        pourra être validée si son dossier est complet (paiement + chartes) et s&apos;il reste
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
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: { xs: '1rem', md: '1.1rem' },
                            lineHeight: 1.8,
                        }}
                    >
                        L&apos;inscription ne peut être validée qu&apos;une fois toutes les chartes signées
                        et les justificatifs de bourses envoyés par mail, l&apos;inscription seule ne réserve pas la place.
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
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: { xs: '1rem', md: '1.1rem' },
                            lineHeight: 1.8,
                        }}
                    >
                        Le matériel que doivent prévoir les joueurs : chaussures à crampons moulés
                        (les crampons vissés sont interdits sur terrains synthétiques), protège-tibias,
                        ballons d&apos;échauffement (ballons non prêtés).
                    </Typography>
                </Box>
            )
        },
        {
            question: "Que propose la buvette ?",
            answer: (
                <Box sx={{ mt: 2 }}>
                    <Typography
                        sx={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: { xs: '1rem', md: '1.1rem' },
                            lineHeight: 1.8,
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
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: { xs: '1rem', md: '1.1rem' },
                            lineHeight: 1.8,
                        }}
                    >
                        Envoie un mail à{" "}
                        <Link
                            href="mailto:mathurin.le-brun@student-cs.fr"
                            sx={{ 
                                textDecoration: 'none',
                                color: palette.primary.red,
                                fontWeight: 'bold',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                        >
                            mathurin.le-brun@student-cs.fr
                        </Link>
                        {" "}ou{" "}
                        <Link
                            href="mailto:laure.desurydaspremont@student-cs.fr"
                            sx={{ 
                                textDecoration: 'none',
                                color: palette.primary.red,
                                fontWeight: 'bold',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                        >
                            laure.desurydaspremont@student-cs.fr
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
                    background: `linear-gradient(135deg, ${palette.primary.dark} 0%, #0a2540 100%)`,
                    alignItems: 'center',
                    width: '100%',
                    overflow: 'hidden'
                }}
            >
                {/* Header Title */}
                <Box 
                    sx={{ 
                        height: 'auto',
                        width: '100%', 
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center', 
                        alignItems: 'center',
                        paddingTop: { xs: '10rem', md: '12rem' },
                        paddingBottom: '3rem',
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: '600',
                            marginBottom: '0.5rem',
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            textTransform: 'uppercase',
                            color: palette.primary.red,
                            letterSpacing: '2px',
                        }}
                    >
                        FAQ
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 'bold',
                            fontSize: { xs: '2rem', sm: '3rem' },
                            color: 'white',
                            textTransform: 'uppercase',
                        }}
                    >
                        Infos{' '}
                        <Box 
                            component="span" 
                            sx={{ 
                                color: palette.primary.red,
                                textShadow: '0 0 20px rgba(255, 107, 107, 0.3)',
                            }}
                        >
                            PRATIQUES
                        </Box>
                    </Typography>
                </Box>

                {/* Collapsible FAQ Entries */}
                <Box sx={{ width: '90%', maxWidth: '1200px', paddingBottom: '4rem' }}>
                    {faqEntries.map((item, index) => (
                        <Box 
                            key={index} 
                            sx={{ 
                                mb: 3,
                                animation: `fadeIn 0.5s ease-out ${index * 0.1}s`,
                                animationFillMode: 'backwards',
                                '@keyframes fadeIn': {
                                    '0%': { opacity: 0, transform: 'translateY(20px)' },
                                    '100%': { opacity: 1, transform: 'translateY(0)' },
                                },
                            }}
                        >
                            <Box
                                onClick={() => handleExpandClick(index)}
                                sx={{
                                    p: { xs: 2, md: 3 },
                                    backgroundColor: expandedIndices.includes(index) 
                                        ? 'rgba(255, 255, 255, 0.15)' 
                                        : 'rgba(255, 255, 255, 0.05)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '20px',
                                    border: expandedIndices.includes(index)
                                        ? `2px solid ${palette.primary.red}`
                                        : '2px solid rgba(255, 255, 255, 0.1)',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    boxShadow: expandedIndices.includes(index)
                                        ? '0 10px 40px rgba(255, 107, 107, 0.3)'
                                        : '0 5px 20px rgba(0, 0, 0, 0.2)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 15px 50px rgba(255, 107, 107, 0.4)',
                                        border: `2px solid ${palette.primary.red}`,
                                    }
                                }}
                            >
                                {/* Question row */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <IconButton 
                                        sx={{ 
                                            display: { xs: 'none', sm: 'flex' },
                                            color: palette.primary.red,
                                            transition: 'transform 0.3s ease',
                                            transform: expandedIndices.includes(index) ? 'rotate(180deg)' : 'rotate(0deg)',
                                        }}
                                    >
                                        <ExpandMoreIcon sx={{ fontSize: '2rem' }} />
                                    </IconButton>
                                    <Typography 
                                        sx={{ 
                                            color: 'white', 
                                            fontWeight: 'bold', 
                                            fontSize: { xs: '1.1rem', md: '1.3rem' },
                                            letterSpacing: '0.5px',
                                        }}
                                    >
                                        {item.question}
                                    </Typography>
                                </Box>

                                {/* Collapsible content */}
                                <Collapse in={expandedIndices.includes(index)} timeout="auto" unmountOnExit>
                                    <Box sx={{ mt: 3, pl: { xs: 0, sm: '3.5rem' } }}>
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
