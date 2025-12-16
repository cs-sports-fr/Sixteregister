import { Box, Typography } from "@mui/material";
import NavbarParticipant from "../components/navbar/NavbarParticipant";
import palette from "../themes/palette";

const EspaceParticipant = () => {
    return (
        <>
            <NavbarParticipant />
            <Box 
                sx={{ 
                    backgroundColor: 'white',
                    minHeight: '100vh',
                    paddingTop: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: { xs: '80px 2rem 2rem', md: '80px 4rem 4rem' }
                }}
            >
                <Box sx={{ width: '100%', maxWidth: '1200px' }}>
                    <Typography 
                        sx={{
                            fontSize: { xs: '3rem', md: '5rem' },
                            fontWeight: 'bold',
                            color: palette.primary.dark,
                            textAlign: 'center',
                            letterSpacing: '2px',
                            marginBottom: '3rem',
                        }}
                    >
                        <span style={{ 
                            textDecoration: 'underline', 
                            textDecorationColor: palette.primary.red, 
                            textUnderlineOffset: '1rem', 
                            textDecorationThickness: '6px' 
                        }}>
                            Espace
                        </span>{' '}
                        Participant
                    </Typography>
                    
                    <Box
                        sx={{
                            backgroundColor: palette.primary.dark,
                            color: 'white',
                            padding: '2rem',
                            borderRadius: '12px',
                        }}
                    >
                        <Typography variant="h6" sx={{ marginBottom: '1rem', fontWeight: 'bold' }}>
                            📋 Processus d'inscription
                        </Typography>
                        <Typography sx={{ marginBottom: '1rem' }}>
                            🎯 <strong>Étape 1 - Création du compte :</strong> Seul le <strong>capitaine</strong> crée un compte sur la plateforme. C'est lui qui pilotera toute l'inscription ! 👨‍✈️
                        </Typography>
                        <Typography sx={{ marginBottom: '1rem' }}>
                            ⚽ <strong>Étape 2 - Création de l'équipe :</strong> Une fois connecté sur cette page, le capitaine doit créer son équipe et ajouter tous les participants. Pas de stress, il peut modifier son équipe à sa guise jusqu'à la soumission finale ! ✏️
                        </Typography>
                        <Typography sx={{ marginBottom: '1rem', paddingLeft: '1.5rem', fontStyle: 'italic', color: '#FFA500' }}>
                            🎓 <strong>Pack boursier :</strong> Durant l'étape "Dossier incomplet", vous pouvez choisir le pack boursier pour les participants concernés. Ces participants devront envoyer un justificatif par mail. Nous devons valider leur statut de boursier avant de passer votre équipe en "Sélectionné".
                        </Typography>
                        <Typography sx={{ marginBottom: '1rem' }}>
                            ✅ <strong>Étape 3 - Validation des chartes :</strong> Le capitaine doit cocher que <strong>tous les participants ont bien signé la charte</strong>. C'est super important pour passer à l'étape suivante ! 📝
                        </Typography>
                        <Typography sx={{ marginBottom: '1rem' }}>
                            🚀 <strong>Étape 4 - Soumission :</strong> Une fois toutes les chartes validées et l'équipe au complet, le capitaine peut cliquer sur "<strong>Soumettre l'équipe</strong>". Votre équipe passera alors en statut "<strong>En attente</strong>" ⏳
                        </Typography>
                        <Typography sx={{ marginBottom: '1rem' }}>
                            🎉 <strong>Étape 5 - Validation :</strong> Nos organisateurs vont examiner votre dossier. Une fois validé, vous passerez en statut "<strong>Sélectionné</strong>" ! Félicitations ! 🎊
                        </Typography>
                        <Typography>
                            💳 <strong>Étape 6 - Paiement :</strong> Dernière étape : effectuez le paiement directement sur le site. Une fois le paiement confirmé, vous passerez en statut "<strong>Inscrit</strong>" et c'est officiel, vous êtes de la partie ! 🏆✨
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default EspaceParticipant;
