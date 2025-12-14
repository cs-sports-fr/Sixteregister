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
    const [statusMessage, setStatusMessage] = useState("Vérification de votre paiement en cours...");

    useEffect(() => {
        const checkPayment = async () => {
            try {
                console.log(`Tentative ${checkCount + 1}/10 de vérification du paiement ${payment_id}`);
                
                // D'abord récupérer l'état actuel du paiement
                const paymentResponse = await ApiTossConnected.get(`/payment/${payment_id}`);
                console.log("État actuel du paiement:", paymentResponse.data);
                
                if (paymentResponse.data.paymentStatus === 'Paid') {
                    console.log("Paiement déjà confirmé dans la BDD");
                    setSuccess(true);
                    setLoading(false);
                    return;
                }
                
                // Si le paiement n'est pas encore confirmé, appeler check-state
                setStatusMessage(`Vérification auprès de Lydia... (tentative ${checkCount + 1}/10)`);
                const checkResponse = await ApiTossConnected.post(`/payment/check-state/${payment_id}`);
                console.log("Réponse de check-state:", checkResponse.data);
                
                if (checkResponse.data.status === 'Paid') {
                    console.log("Paiement confirmé par Lydia");
                    setSuccess(true);
                    setLoading(false);
                } else if (checkCount < 10) {
                    // Réessayer toutes les 4 secondes, maximum 10 fois (40 secondes)
                    setTimeout(() => {
                        setCheckCount(prev => prev + 1);
                    }, 4000);
                } else {
                    console.log("Nombre maximum de tentatives atteint");
                    setSuccess(false);
                    setLoading(false);
                    setError("Le paiement n'a pas pu être confirmé. Veuillez vérifier votre compte.");
                }
            } catch (err) {
                console.error("Erreur lors de la vérification du paiement:", err);
                if (checkCount < 10) {
                    setTimeout(() => {
                        setCheckCount(prev => prev + 1);
                    }, 4000);
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
                            {statusMessage}
                        </Typography>
                        <Typography sx={{ color: 'rgba(5, 25, 57, 0.6)', textAlign: 'center' }}>
                            Merci de patienter, la confirmation peut prendre jusqu'à 40 secondes
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
