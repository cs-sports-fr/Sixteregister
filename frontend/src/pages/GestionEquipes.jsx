import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Collapse,
  IconButton,
  Grid,
  Chip,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { ApiTossConnected } from '../service/axios';

const GestionEquipes = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [teams, setTeams] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTeam, setExpandedTeam] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const tabs = [
    { label: 'Dossier incomplet', status: 'Incomplete' },
    { label: 'En attente', status: 'Waiting' },
    { label: 'Sélectionné', status: 'PrincipalList' },
    { label: 'Inscrit', status: 'Validated' },
  ];

  useEffect(() => {
    fetchSports();
    fetchTeams();
  }, []);

  useEffect(() => {
    filterTeams();
  }, [currentTab, selectedSport, allTeams]);

  const fetchSports = async () => {
    try {
      const response = await ApiTossConnected.get('/sports');
      setSports(response.data);
      if (response.data.length > 0) {
        setSelectedSport(response.data[0].id);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des sports:', err);
    }
  };

  const fetchTeams = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiTossConnected.get('/teams');
      setAllTeams(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des équipes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterTeams = () => {
    const currentStatus = tabs[currentTab].status;
    const filtered = allTeams.filter(
      (team) => team.status === currentStatus && 
                (selectedSport === '' || team.sportId === selectedSport)
    );
    setTeams(filtered);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setExpandedTeam(null);
  };

  const handleSportChange = (event) => {
    setSelectedSport(event.target.value);
    setExpandedTeam(null);
  };

  const handleExpandTeam = (teamId) => {
    setExpandedTeam(expandedTeam === teamId ? null : teamId);
  };

  const handleStatusChange = async (teamId, newStatus) => {
    setUpdatingStatus(true);
    try {
      await ApiTossConnected.put(`/teams/${teamId}/status?status=${newStatus}`);
      await fetchTeams();
      setExpandedTeam(null);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      const errorMsg = err?.response?.data?.detail || 'Erreur lors de la mise à jour du statut';
      alert(errorMsg);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getAmountDisplay = (team) => {
    const amountToPay = (team.amountToPayInCents || 0) / 100;
    const amountPaid = (team.amountPaidInCents || 0) / 100;
    return { amountToPay, amountPaid };
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Gestion des équipes
      </Typography>

      {/* Sport Selector */}
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Sport</InputLabel>
          <Select
            value={selectedSport}
            label="Sport"
            onChange={handleSportChange}
          >
            {sports.map((sport) => (
              <MenuItem key={sport.id} value={sport.id}>
                {sport.sport}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : teams.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          Aucune équipe dans cette catégorie
        </Alert>
      ) : (
        <Box sx={{ mt: 3 }}>
          {teams.map((team) => {
            const { amountToPay, amountPaid } = getAmountDisplay(team);
            const isExpanded = expandedTeam === team.id;

            return (
              <Card
                key={team.id}
                sx={{
                  mb: 2,
                  boxShadow: 2,
                  '&:hover': { boxShadow: 4 },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleExpandTeam(team.id)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {team.name}
                      </Typography>
                      <Chip
                        label={`${team.participants?.length || 0} joueur(s)`}
                        color="primary"
                        size="small"
                      />
                      {team.school && (
                        <Chip
                          label={team.school.name}
                          color="info"
                          size="small"
                        />
                      )}
                      <Chip
                        label={`À payer: ${amountToPay.toFixed(2)} €`}
                        color="warning"
                        size="small"
                      />
                      <Chip
                        label={`Payé: ${amountPaid.toFixed(2)} €`}
                        color="success"
                        size="small"
                      />
                      
                    </Box>
                    <IconButton
                      sx={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s',
                      }}
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                  </Box>

                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <Box sx={{ mt: 3 }}>
                      {/* Section de changement de statut */}
                      <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Modifier le statut</InputLabel>
                          <Select
                            value={team.status}
                            label="Modifier le statut"
                            onChange={(e) => handleStatusChange(team.id, e.target.value)}
                            disabled={updatingStatus}
                          >
                            <MenuItem value="Incomplete">Dossier incomplet</MenuItem>
                            <MenuItem value="Waiting">En attente</MenuItem>
                            {/* <MenuItem value="Awaitingauthorization">En attente d&apos;autorisation</MenuItem> */}
                            <MenuItem value="PrincipalList">Sélectionné (Liste principale)</MenuItem>
                            <MenuItem value="Validated">Inscrit (Validé)</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>

                      {/* Liste des participants */}
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Participants ({team.participants?.length || 0})
                      </Typography>

                      {team.participants && team.participants.length > 0 ? (
                        <Grid container spacing={2}>
                          {team.participants.map((participant) => (
                            <Grid item xs={12} md={6} key={participant.id}>
                              <Card variant="outlined" sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    {participant.firstname} {participant.lastname}
                                    {participant.isCaptain && (
                                      <Chip
                                        label="Capitaine"
                                        color="primary"
                                        size="small"
                                        sx={{ ml: 1 }}
                                      />
                                    )}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    📧 {participant.email}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    📱 {participant.mobile}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    {participant.charteIsValidated ? (
                                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                                        <CheckCircleIcon sx={{ mr: 0.5, fontSize: 20 }} />
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                          Charte signée
                                        </Typography>
                                      </Box>
                                    ) : (
                                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
                                        <CancelIcon sx={{ mr: 0.5, fontSize: 20 }} />
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                          Charte non signée
                                        </Typography>
                                      </Box>
                                    )}
                                  </Box>
                                </Box>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <Alert severity="info">Aucun participant dans cette équipe</Alert>
                      )}
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}
    </Container>
  );
};

export default GestionEquipes;
