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
      case 'Waitlist':
        return '#FFA500';
      case 'Selected':
        return '#4CAF50';
      case 'Paid':
        return '#2196F3';
      default:
        return '#999';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'Incomplete':
        return 'Dossier Incomplet';
      case 'Waitlist':
        return 'En attente';
      case 'Selected':
        return 'Sélectionné·e';
      case 'Paid':
        return 'Inscrit·e';
      default:
        return status;
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
            Mise à jour importante concernant les inscriptions
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
              Mise à jour importante concernant les inscriptions
            </Typography>
            <Typography sx={{ marginBottom: '1rem' }}>
              Nous souhaitons vous informer que cette année, le TOSS n'est pas labellisé par la FFSU
            </Typography>
            <Typography sx={{ marginBottom: '1rem' }}>
              Cette décision a été prise car la FFSU imposait cette année que tous nos participants soient licenciés chez eux, ce qui aurait causé un surcoût de 95€ pour tous les non licenciés.
            </Typography>
            <Typography sx={{ marginBottom: '1rem' }}>
              Cette obligation aurait impliqué un coût supplémentaire de 35€ par chaque participant non licencié, ce qui allait à l'encontre de notre volonté de rendre le tournoi accessible à tous. D'autres grands tournois étudiants, comme le CCL, ont également fait le choix de ne pas être labellisés par la FFSU.
            </Typography>
            <Typography sx={{ marginBottom: '1rem' }}>
              Du point de vue du participant, cela ne change absolument rien par rapport aux années précédentes. Tous nos participants seront couverts par notre assurance tout au long du week-end et offrant les mêmes garanties que celles de la FFSU.
            </Typography>
            <Typography>
              Ce changement n'affecte rien de ce qui était présent sur notre règlement lors de votre inscription.
            </Typography>
          </Box>

          {/* Registration Process */}
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
            {[
              { number: '1', title: 'Dossier Incomplet', active: true },
              { number: '2', title: 'En attente', active: false },
              { number: '3', title: 'Sélectionné·e', active: false },
              { number: '4', title: 'Inscrit·e', active: false },
            ].map((step) => (
              <Grid item xs={12} sm={6} md={3} key={step.number}>
                <Box
                  sx={{
                    textAlign: 'center',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    backgroundColor: step.active
                      ? palette.primary.red
                      : 'rgba(5, 25, 57, 0.05)',
                    color: step.active ? 'white' : palette.primary.dark,
                  }}
                >
                  <Box
                    sx={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: step.active ? 'white' : palette.primary.red,
                      color: step.active ? palette.primary.red : 'white',
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
            ))}
          </Grid>

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
                        Prix total: {team.amountToPay || 0} €
                      </Typography>
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{
                          marginTop: '1rem',
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
                {teams.reduce((sum, team) => sum + (team.amountToPay || 0), 0)} €
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '1.5rem' }}>
                0 € (avec liste d'attente)
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: palette.primary.red,
                  color: 'white',
                  padding: '0.75rem 3rem',
                  fontSize: '1.1rem',
                  '&:hover': {
                    backgroundColor: '#FF5252',
                  },
                }}
              >
                Voir détail
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default MesEquipes;
