import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ApiTossConnected } from "../service/axios";
import NavbarParticipant from "../components/navbar/NavbarParticipant";
import palette from "../themes/palette";

const SuccessPayment = () => {
    const { payment_id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [checkCount, setCheckCount] = useState(0);

    useEffect(() => {
        const checkPayment = async () => {
            try {
                const response = await ApiTossConnected.post(`/payment/check-state/${payment_id}`);
                if (response.data.status === 'Paid') {
                    setSuccess(true);
                    setLoading(false);
                } else if (checkCount < 5) {
                    // Réessayer toutes les 3 secondes, maximum 5 fois
                    setTimeout(() => {
                        setCheckCount(prev => prev + 1);
                    }, 3000);
                } else {
                    setSuccess(false);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Erreur lors de la vérification du paiement:", err);
                if (checkCount < 5) {
                    setTimeout(() => {
                        setCheckCount(prev => prev + 1);
                    }, 3000);
                } else {
                    setError("Erreur lors de la vérification du paiement.");
                    setLoading(false);
                }
            }
        };

        if (payment_id) {
            checkPayment();
        }
    }, [payment_id, checkCount]);

    return (
        <>
            <NavbarParticipant />
            <Box
                sx={{
                    backgroundColor: 'white',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: '80px',
                    padding: 4,
                }}
            >
                {loading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 3 }}>
                        <CircularProgress size={60} sx={{ color: palette.primary.red }} />
                        <Typography variant="h5" sx={{ color: palette.primary.dark, textAlign: 'center' }}>
                            Vérification de votre paiement en cours...
                        </Typography>
                        <Typography sx={{ color: 'rgba(5, 25, 57, 0.6)', textAlign: 'center' }}>
                            Merci de patienter, cela peut prendre quelques secondes
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {success ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 4, maxWidth: '600px' }}>
                                <Box
                                    sx={{
                                        width: '120px',
                                        height: '120px',
                                        borderRadius: '50%',
                                        backgroundColor: '#4CAF50',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Typography sx={{ color: 'white', fontSize: '4rem' }}>✓</Typography>
                                </Box>
                                <Typography variant="h4" sx={{ color: palette.primary.dark, fontWeight: 'bold', textAlign: 'center' }}>
                                    Paiement réussi !
                                </Typography>
                                <Typography sx={{ color: 'rgba(5, 25, 57, 0.8)', textAlign: 'center', fontSize: '1.1rem' }}>
                                    Votre transaction a été réalisée avec succès ! Votre inscription est confirmée.
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate('/mes-equipes')}
                                    sx={{
                                        backgroundColor: palette.primary.red,
                                        color: 'white',
                                        padding: '0.75rem 3rem',
                                        fontSize: '1.1rem',
                                        marginTop: '1rem',
                                        '&:hover': {
                                            backgroundColor: '#FF5252',
                                        },
                                    }}
                                >
                                    Retour à mes équipes
                                </Button>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 4, maxWidth: '600px' }}>
                                <Box
                                    sx={{
                                        width: '120px',
                                        height: '120px',
                                        borderRadius: '50%',
                                        backgroundColor: '#FF6B6B',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Typography sx={{ color: 'white', fontSize: '4rem' }}>✕</Typography>
                                </Box>
                                <Typography variant="h4" sx={{ color: palette.primary.dark, fontWeight: 'bold', textAlign: 'center' }}>
                                    Paiement non confirmé
                                </Typography>
                                <Typography sx={{ color: 'rgba(5, 25, 57, 0.8)', textAlign: 'center', fontSize: '1.1rem' }}>
                                    {error || "Votre paiement n'a pas pu être confirmé. Vous pouvez réessayer depuis votre page mes équipes."}
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate('/mes-equipes')}
                                    sx={{
                                        backgroundColor: palette.primary.red,
                                        color: 'white',
                                        padding: '0.75rem 3rem',
                                        fontSize: '1.1rem',
                                        marginTop: '1rem',
                                        '&:hover': {
                                            backgroundColor: '#FF5252',
                                        },
                                    }}
                                >
                                    Retour à mes équipes
                                </Button>
                            </Box>
                        )}
                    </>
                )}
            </Box>
        </>
    );
};

export default SuccessPayment;
