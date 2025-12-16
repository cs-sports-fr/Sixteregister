import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import NavbarParticipant from "../components/navbar/NavbarParticipant";
import palette from "../themes/palette";
import { ApiTossConnected } from "../service/axios";
import { useSnackbar } from "../provider/snackbarProvider";

const MesEquipes = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await ApiTossConnected.get('/teams');
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
      showSnackbar('Erreur lors du chargement des équipes', 3000, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Incomplete':
        return '#FF6B6B';
      case 'Waiting':
        return '#FFA500';
      case 'PrincipalList':
      case 'Validated':
        return '#4CAF50';
      case 'Awaitingauthorization':
        return '#2196F3';
      default:
        return '#999';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'Incomplete':
        return 'Dossier Incomplet';
      case 'Waiting':
        return 'En attente';
      case 'Awaitingauthorization':
        return 'En attente d\'autorisation';
      case 'PrincipalList':
        return 'Liste principale';
      case 'Validated':
        return 'Validé';
      default:
        return status;
    }
  };

  const handleSubmitTeam = async (teamId) => {
    try {
      await ApiTossConnected.put(`/teams/${teamId}/submit`);
      showSnackbar('Équipe soumise avec succès !', 3000, 'success');
      fetchTeams(); // Refresh teams list
    } catch (error) {
      console.error('Error submitting team:', error);
      const errorMsg = error.response?.data?.detail || 'Erreur lors de la soumission';
      showSnackbar(errorMsg, 3000, 'error');
    }
  };

  const handlePayment = async () => {
    // On va payer pour la première équipe qui a un montant à payer
    // Si plusieurs équipes, on pourrait demander à l'utilisateur de choisir
    const teamToPay = teams.find(team => (team.amountToPayInCents - (team.amountPaidInCents || 0)) > 0);
    
    if (!teamToPay) {
      showSnackbar('Aucune équipe ne nécessite de paiement', 3000, 'info');
      return;
    }

    setPaymentLoading(true);
    try {
      console.log('Requesting payment for team:', teamToPay.id);
      const response = await ApiTossConnected.post(`/payment/request?team_id=${teamToPay.id}`);
      console.log('Payment response:', response.data);
      // La réponse contient l'URL Lydia
      if (response.data) {
        window.location.href = response.data;
      }
    } catch (error) {
      console.error('Error requesting payment:', error);
      console.error('Error details:', error?.response?.data);
      const errorMsg = error?.response?.data?.detail || error?.message || 'Erreur lors de la demande de paiement';
      showSnackbar(errorMsg, 3000, 'error');
      setPaymentLoading(false);
    }
  };

  return (
    <>
      <NavbarParticipant />
      <Box
        sx={{
          backgroundColor: 'white',
          minHeight: '100vh',
          paddingTop: '80px',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            backgroundColor: palette.primary.dark,
            padding: '3rem',
            color: 'white',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              marginBottom: '1rem',
            }}
          >
            <span
              style={{
                textDecoration: 'underline',
                textDecorationColor: palette.primary.red,
                textDecorationThickness: '4px',
                textUnderlineOffset: '8px',
              }}
            >
              Mes
            </span>{' '}
            équipes
          </Typography>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}>
            Processus d'inscription
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ padding: '3rem' }}>
          {/* Important Notice */}
          <Box
            sx={{
              backgroundColor: palette.primary.dark,
              color: 'white',
              padding: '2rem',
              borderRadius: '12px',
              marginBottom: '3rem',
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
            <Typography sx={{ marginBottom: '1rem' }}>
              ✅ <strong>Étape 3 - Validation des chartes :</strong> Le capitaine doit cocher que <strong>tous les participants ont bien lu et approuvé la charte</strong>. C'est super important pour passer à l'étape suivante ! 📝
            </Typography>
            <Typography sx={{ marginBottom: '1rem' }}>
              🚀 <strong>Étape 4 - Soumission :</strong> Une fois toutes les chartes validées et l'équipe au complet, le capitaine peut cliquer sur "<strong>Soumettre l'équipe</strong>". Votre équipe passera alors en statut "<strong>En attente</strong>" ⏳
            </Typography>
            <Typography sx={{ marginBottom: '1rem' }}>
              🎉 <strong>Étape 5 - Validation :</strong> Nos organisateurs vont examiner votre dossier. Une fois validé, vous passerez en statut "<strong>Sélectionné</strong>" ! Félicitations, votre place est assurée ! 🎊
            </Typography>
            <Typography>
              💳 <strong>Étape 6 - Paiement :</strong> Dernière étape : effectuez le paiement directement sur le site. Une fois que vous êtes sélectionné, votre place est garantie, il ne vous reste plus qu'à payer ! Une fois le paiement confirmé, vous passerez en statut "<strong>Inscrit</strong>" et c'est officiel, vous êtes de la partie ! 🏆✨
            </Typography>
          </Box>

          {/* Registration Process */}
          {teams.length > 0 && (
            <>
              <Typography
                variant="h5"
                sx={{
                  color: palette.primary.dark,
                  fontWeight: 'bold',
                  marginBottom: '2rem',
                }}
              >
                Le déroulé de ton inscription
              </Typography>

              <Grid container spacing={3} sx={{ marginBottom: '4rem' }}>
                {(() => {
                  const statusOrder = { 
                    'Incomplete': 1, 
                    'Waiting': 2, 
                    'Awaitingauthorization': 3, 
                    'PrincipalList': 4, 
                    'Validated': 5 
                  };
                  
                  const mostAdvancedStatus = teams.reduce((max, team) => {
                    return (statusOrder[team.status] || 0) > (statusOrder[max] || 0) ? team.status : max;
                  }, 'Incomplete');

                  const steps = [
                    { number: '1', title: 'Dossier Incomplet', status: 'Incomplete' },
                    { number: '2', title: 'En attente', status: 'Waiting' },
                    { number: '3', title: 'Sélectionnée', status: 'PrincipalList' },
                    { number: '4', title: 'Validé', status: 'Validated' },
                  ];

                  const currentStepNumber = statusOrder[mostAdvancedStatus] || 1;

                  return steps.map((step) => {
                    const stepNumber = parseInt(step.number);
                    const isActive = stepNumber === currentStepNumber;
                    const isCompleted = stepNumber < currentStepNumber;

                    return (
                      <Grid item xs={12} sm={6} md={3} key={step.number}>
                        <Box
                          sx={{
                            textAlign: 'center',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            backgroundColor: isActive
                              ? palette.primary.red
                              : isCompleted
                              ? '#4CAF50'
                              : 'rgba(5, 25, 57, 0.05)',
                            color: (isActive || isCompleted) ? 'white' : palette.primary.dark,
                          }}
                        >
                          <Box
                            sx={{
                              width: '60px',
                              height: '60px',
                              borderRadius: '50%',
                              backgroundColor: (isActive || isCompleted) ? 'white' : palette.primary.red,
                              color: (isActive || isCompleted) ? (isActive ? palette.primary.red : '#4CAF50') : 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.5rem',
                              fontWeight: 'bold',
                              margin: '0 auto 1rem',
                            }}
                          >
                            {step.number}
                          </Box>
                          <Typography sx={{ fontWeight: 'bold' }}>{step.title}</Typography>
                        </Box>
                      </Grid>
                    );
                  });
                })()}
              </Grid>
            </>
          )}

          {/* Teams List */}
          <Typography
            variant="h5"
            sx={{
              color: palette.primary.dark,
              fontWeight: 'bold',
              marginBottom: '2rem',
            }}
          >
            Mes équipes
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <CircularProgress sx={{ color: palette.primary.red }} />
            </Box>
          ) : teams.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                padding: '3rem',
                backgroundColor: 'rgba(5, 25, 57, 0.05)',
                borderRadius: '12px',
              }}
            >
              <Typography variant="h6" sx={{ color: palette.primary.dark, marginBottom: '1rem' }}>
                Vous n'avez pas encore d'équipe
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/inscrire-equipe')}
                sx={{
                  backgroundColor: palette.primary.red,
                  color: 'white',
                  padding: '0.75rem 2rem',
                  '&:hover': {
                    backgroundColor: '#FF5252',
                  },
                }}
              >
                Inscrire une équipe
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {teams.map((team) => (
                <Grid item xs={12} md={6} key={team.id}>
                  <Card
                    sx={{
                      backgroundColor: palette.primary.dark,
                      color: 'white',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                      },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {team.name}
                        </Typography>
                        <Chip
                          label={getStatusLabel(team.status)}
                          sx={{
                            backgroundColor: getStatusColor(team.status),
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        />
                      </Box>
                      <Typography sx={{ marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                        Sport: {team.sport?.sport || 'N/A'}
                      </Typography>
                      <Typography sx={{ marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                        Nombre de joueurs: {team.participants?.length || 0}
                      </Typography>
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        Prix total: {((team.amountToPayInCents || 0) / 100).toFixed(2)} €
                      </Typography>
                      <Box sx={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <Button
                          variant="outlined"
                          fullWidth
                          onClick={() => navigate(`/modifier-equipe/${team.id}`)}
                          sx={{
                            color: 'white',
                            borderColor: palette.primary.red,
                            '&:hover': {
                              borderColor: palette.primary.red,
                              backgroundColor: 'rgba(255, 107, 107, 0.1)',
                            },
                          }}
                        >
                          Modifier
                        </Button>
                        {team.status === 'Incomplete' && (
                          <Button
                            variant="contained"
                            fullWidth
                            onClick={() => handleSubmitTeam(team.id)}
                            sx={{
                              backgroundColor: palette.primary.red,
                              color: 'white',
                              '&:hover': {
                                backgroundColor: '#FF5252',
                              },
                            }}
                          >
                            Soumettre
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Total Amount */}
          {teams.length > 0 && (
            <Box
              sx={{
                marginTop: '3rem',
                padding: '2rem',
                backgroundColor: palette.primary.dark,
                color: 'white',
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Somme à payer
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 'bold', margin: '1rem 0' }}>
                {(teams.reduce((sum, team) => sum + ((team.amountToPayInCents || 0) - (team.amountPaidInCents || 0)), 0) / 100).toFixed(2)} €
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '1.5rem' }}>
                Montant restant dû
              </Typography>
              <Button
                variant="contained"
                onClick={handlePayment}
                disabled={teams.reduce((sum, team) => sum + ((team.amountToPayInCents || 0) - (team.amountPaidInCents || 0)), 0) === 0 || paymentLoading}
                sx={{
                  backgroundColor: palette.primary.red,
                  color: 'white',
                  padding: '0.75rem 3rem',
                  fontSize: '1.1rem',
                  '&:hover': {
                    backgroundColor: '#FF5252',
                  },
                  '&:disabled': {
                    backgroundColor: '#999',
                    color: 'white',
                  },
                }}
              >
                {paymentLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CircularProgress size={20} sx={{ color: 'white' }} />
                    Chargement...
                  </Box>
                ) : (
                  'Payer'
                )}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default MesEquipes;
