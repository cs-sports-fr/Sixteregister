import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/fr';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import NavbarParticipant from "../components/navbar/NavbarParticipant";
import palette from "../themes/palette";
import { ApiTossConnected } from "../service/axios";
import gender from "../assets/gender.json";
import { useSnackbar } from "../provider/snackbarProvider";

const ModifierEquipe = () => {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const { showSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState(null);
  const [packs, setPacks] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [participantToDelete, setParticipantToDelete] = useState(null);

  // Load team data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamRes, packsRes] = await Promise.all([
          ApiTossConnected.get(`/teams/${teamId}`),
          ApiTossConnected.get('/packs')
        ]);
        
        const teamData = teamRes.data;
        setTeam(teamData);
        setTeamName(teamData.name);
        setPacks(packsRes.data);

        // Format participants data
        const formattedParticipants = teamData.participants.map((p) => ({
          id: p.id,
          gender: p.gender,
          firstname: p.firstname,
          lastname: p.lastname,
          mobile: p.mobile,
          email: p.email,
          dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth) : null,
          isCaptain: p.isCaptain,
          licenceID: p.licenceID || '',
          packId: p.packId,
          isVegan: p.isVegan,
          hasAllergies: p.hasAllergies,
          charteValidated: p.charteIsValidated || false,
          productsIds: p.products?.map(prod => prod.id) || [],
          weight: p.weight,
          mailHebergeur: p.mailHebergeur || '',
          classementTennis: p.classementTennis,
          classementTT: p.classementTT,
          armeVoeu1: p.armeVoeu1,
          armeVoeu2: p.armeVoeu2,
          armeVoeu3: p.armeVoeu3,
        }));

        setParticipants(formattedParticipants);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        showSnackbar('Erreur lors du chargement des données', 3000, 'error');
        setLoading(false);
      }
    };
    fetchData();
  }, [teamId]);

  const handleParticipantChange = (field, value) => {
    const updatedParticipants = [...participants];
    updatedParticipants[selectedParticipant][field] = value;
    setParticipants(updatedParticipants);
  };

  const handleAddParticipant = () => {
    const maxParticipants = team?.sport?.nbPlayersMax || 999;
    
    if (participants.length >= maxParticipants) {
      showSnackbar(`Impossible d'ajouter un participant. L'équipe a atteint le nombre maximum de ${maxParticipants} participants.`, 4000, 'error');
      return;
    }
    
    const newParticipant = {
      id: null, // null signifie nouveau participant
      gender: '',
      firstname: '',
      lastname: '',
      mobile: '',
      email: '',
      dateOfBirth: null,
      isCaptain: false,
      licenceID: '',
      packId: null,
      isVegan: false,
      hasAllergies: false,
      productsIds: [],
      weight: null,
      mailHebergeur: '',
    };
    setParticipants([...participants, newParticipant]);
    setSelectedParticipant(participants.length);
  };

  const handleDeleteParticipant = async () => {
    const participant = participants[participantToDelete];
    
    if (participant.id) {
      // Existing participant - delete from backend
      try {
        await ApiTossConnected.delete(`/teams/${teamId}/participants`, {
          data: [participant.id]
        });
        showSnackbar('Participant supprimé avec succès', 3000, 'success');
      } catch (error) {
        console.error('Error deleting participant:', error);
        showSnackbar('Erreur lors de la suppression', 3000, 'error');
        setDeleteDialogOpen(false);
        return;
      }
    }

    // Remove from local state
    const updatedParticipants = participants.filter((_, index) => index !== participantToDelete);
    setParticipants(updatedParticipants);
    
    if (selectedParticipant >= updatedParticipants.length) {
      setSelectedParticipant(Math.max(0, updatedParticipants.length - 1));
    }
    
    setDeleteDialogOpen(false);
    setParticipantToDelete(null);
  };

  const handleSubmit = async () => {
    try {
      // Update team name if changed
      if (teamName !== team.name) {
        await ApiTossConnected.put(`/teams/${teamId}?name=${encodeURIComponent(teamName)}`);
      }

      // Separate existing and new participants
      const existingParticipants = participants.filter(p => p.id !== null);
      const newParticipants = participants.filter(p => p.id === null);

      // Update existing participants
      for (const participant of existingParticipants) {
        const participantData = {
          gender: participant.gender,
          firstname: participant.firstname,
          lastname: participant.lastname,
          mobile: participant.mobile || '',
          email: participant.email,
          dateOfBirth: participant.dateOfBirth ? dayjs(participant.dateOfBirth).toISOString() : new Date().toISOString(),
          isCaptain: participant.isCaptain,
          licenceID: participant.licenceID || '',
          packId: participant.packId || 1,
          isVegan: false,
          hasAllergies: false,
          charteValidated: participant.charteValidated || false,
          productsIds: participant.productsIds || [],
          weight: participant.weight ? parseFloat(participant.weight) : null,
          mailHebergeur: participant.mailHebergeur || null,
          classementTennis: participant.classementTennis || null,
          classementTT: participant.classementTT || null,
          armeVoeu1: participant.armeVoeu1 || null,
          armeVoeu2: participant.armeVoeu2 || null,
          armeVoeu3: participant.armeVoeu3 || null,
        };

        await ApiTossConnected.put(
          `/teams/${teamId}/participant/${participant.id}`,
          participantData
        );
      }

      // Add new participants
      if (newParticipants.length > 0) {
        const formattedNewParticipants = newParticipants.map(p => ({
          gender: p.gender,
          firstname: p.firstname,
          lastname: p.lastname,
          mobile: p.mobile || '',
          email: p.email,
          dateOfBirth: p.dateOfBirth ? dayjs(p.dateOfBirth).toISOString() : new Date().toISOString(),
          isCaptain: p.isCaptain,
          licenceID: p.licenceID || '',
          packId: p.packId || 1,
          isVegan: false,
          hasAllergies: false,
          charteValidated: p.charteValidated || false,
          productsIds: p.productsIds || [],
          weight: p.weight ? parseFloat(p.weight) : null,
          mailHebergeur: p.mailHebergeur || null,
        }));

        await ApiTossConnected.post(
          `/teams/${teamId}/participants`,
          formattedNewParticipants
        );
      }

      showSnackbar('Équipe modifiée avec succès !', 3000, 'success');
      navigate('/mes-equipes');
    } catch (error) {
      console.error('Error updating team:', error);
      const errorMsg = error.response?.data?.detail || 'Erreur lors de la modification de l\'équipe';
      showSnackbar(errorMsg, 3000, 'error');
    }
  };

  if (loading) {
    return (
      <>
        <NavbarParticipant />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <Typography>Chargement...</Typography>
        </Box>
      </>
    );
  }

  const currentParticipant = participants[selectedParticipant] || {};

  return (
    <>
      <NavbarParticipant />
      <Box
        sx={{
          backgroundColor: palette.primary.dark,
          minHeight: '100vh',
          paddingTop: '80px',
          color: 'white',
        }}
      >
        {/* Breadcrumb */}
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '1rem 3rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
          }}
        >
          <Typography sx={{ color: 'white' }}>Mon équipe</Typography>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>›</Typography>
          <Typography sx={{ color: 'white' }}>Modifier l'équipe</Typography>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>›</Typography>
          <Typography sx={{ color: 'white' }}>{team?.sport?.sport}</Typography>
        </Box>

        <Grid container sx={{ minHeight: 'calc(100vh - 180px)' }}>
          {/* Left Sidebar */}
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            {/* Team Name */}
            <TextField
              label="Nom de l'équipe"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: palette.primary.red },
                  '&.Mui-focused fieldset': { borderColor: palette.primary.red },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
              }}
            />

            {/* Participants List */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  color: palette.primary.red,
                  marginBottom: '0.5rem',
                  fontWeight: 'bold',
                }}
              >
                Participants ({participants.length}/{team?.sport?.nbPlayersMax || 999})
              </Typography>
              {participants.map((p, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                  }}
                >
                  <Typography
                    onClick={() => setSelectedParticipant(index)}
                    sx={{
                      flex: 1,
                      padding: '0.75rem',
                      cursor: 'pointer',
                      backgroundColor:
                        selectedParticipant === index
                          ? 'rgba(255, 107, 107, 0.2)'
                          : 'transparent',
                      borderRadius: '8px',
                      color: selectedParticipant === index ? palette.primary.red : 'white',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                      },
                    }}
                  >
                    Participant n°{index + 1} {p.isCaptain && '(Capitaine)'}
                  </Typography>
                  {!p.isCaptain && participants.length > 1 && (
                    <IconButton
                      onClick={() => {
                        setParticipantToDelete(index);
                        setDeleteDialogOpen(true);
                      }}
                      sx={{ color: palette.primary.red }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddParticipant}
                fullWidth
                disabled={participants.length >= (team?.sport?.nbPlayersMax || 999)}
                sx={{
                  marginTop: '1rem',
                  color: 'white',
                  borderColor: palette.primary.red,
                  '&:hover': {
                    borderColor: palette.primary.red,
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                  },
                  '&.Mui-disabled': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
                variant="outlined"
              >
                {participants.length >= (team?.sport?.nbPlayersMax || 999) 
                  ? 'Limite atteinte' 
                  : 'Ajouter un participant'
                }
              </Button>
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              sx={{
                marginTop: 'auto',
                backgroundColor: palette.primary.red,
                color: 'white',
                padding: '0.75rem',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#FF5252',
                },
              }}
            >
              Enregistrer les modifications
            </Button>
          </Grid>

          {/* Right Content Area */}
          <Grid
            item
            xs={12}
            md={9}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              padding: '3rem',
            }}
          >
            <Typography variant="h5" sx={{ marginBottom: '2rem', color: 'white' }}>
              Participant n°{selectedParticipant + 1}{' '}
              {currentParticipant.isCaptain && '(Capitaine)'}
            </Typography>

            <Grid container spacing={3}>
              {/* Nom */}
              <Grid item xs={12} md={6}>
                <Typography sx={{ marginBottom: '0.5rem', color: 'white' }}>Nom</Typography>
                <TextField
                  placeholder="Nom"
                  value={currentParticipant.lastname || ''}
                  onChange={(e) => handleParticipantChange('lastname', e.target.value)}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                      '&:hover fieldset': { borderColor: palette.primary.red },
                      '&.Mui-focused fieldset': { borderColor: palette.primary.red },
                    },
                  }}
                />
              </Grid>

              {/* Prénom */}
              <Grid item xs={12} md={6}>
                <Typography sx={{ marginBottom: '0.5rem', color: 'white' }}>Prénom</Typography>
                <TextField
                  placeholder="Prénom"
                  value={currentParticipant.firstname || ''}
                  onChange={(e) => handleParticipantChange('firstname', e.target.value)}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                      '&:hover fieldset': { borderColor: palette.primary.red },
                      '&.Mui-focused fieldset': { borderColor: palette.primary.red },
                    },
                  }}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} md={6}>
                <Typography sx={{ marginBottom: '0.5rem', color: 'white' }}>Email</Typography>
                <TextField
                  placeholder="Email"
                  type="email"
                  value={currentParticipant.email || ''}
                  onChange={(e) => handleParticipantChange('email', e.target.value)}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                      '&:hover fieldset': { borderColor: palette.primary.red },
                      '&.Mui-focused fieldset': { borderColor: palette.primary.red },
                    },
                  }}
                />
              </Grid>

              {/* Numéro de téléphone */}
              <Grid item xs={12} md={6}>
                <Typography sx={{ marginBottom: '0.5rem', color: 'white' }}>
                  Numéro de téléphone
                </Typography>
                <TextField
                  placeholder="Numéro de téléphone"
                  value={currentParticipant.mobile || ''}
                  onChange={(e) => handleParticipantChange('mobile', e.target.value)}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                      '&:hover fieldset': { borderColor: palette.primary.red },
                      '&.Mui-focused fieldset': { borderColor: palette.primary.red },
                    },
                  }}
                />
              </Grid>

              {/* Genre */}
              <Grid item xs={12} md={6}>
                <Typography sx={{ marginBottom: '0.5rem', color: 'white' }}>Genre</Typography>
                <Autocomplete
                  options={gender}
                  getOptionLabel={(option) => option.label}
                  value={gender.find((g) => g.type === currentParticipant.gender) || null}
                  onChange={(e, newValue) =>
                    handleParticipantChange('gender', newValue?.type || '')
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Rechercher genre"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                          '&:hover fieldset': { borderColor: palette.primary.red },
                          '&.Mui-focused fieldset': { borderColor: palette.primary.red },
                        },
                        '& .MuiOutlinedInput-input': {
                          padding: '16.5px 14px',
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Date de naissance */}
              <Grid item xs={12} md={6}>
                <Typography sx={{ marginBottom: '0.5rem', color: 'white' }}>
                  Date de naissance
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                  <DatePicker
                    value={currentParticipant.dateOfBirth ? dayjs(currentParticipant.dateOfBirth) : null}
                    onChange={(newValue) =>
                      handleParticipantChange('dateOfBirth', newValue?.toDate())
                    }
                    sx={{
                      width: '100%',
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: palette.primary.red },
                        '&.Mui-focused fieldset': { borderColor: palette.primary.red },
                      },
                      '& .MuiSvgIcon-root': { color: 'white' },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              {/* Pack */}
              <Grid item xs={12} md={6}>
                <Typography sx={{ marginBottom: '0.5rem', color: 'white' }}>Pack</Typography>
                <TextField
                  select
                  value={currentParticipant.packId || ''}
                  onChange={(e) => handleParticipantChange('packId', e.target.value)}
                  fullWidth
                  placeholder="Rechercher pack"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                      '&:hover fieldset': { borderColor: palette.primary.red },
                      '&.Mui-focused fieldset': { borderColor: palette.primary.red },
                    },
                  }}
                >
                  {packs.map((pack) => (
                    <MenuItem key={pack.id} value={pack.id}>
                      {pack.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Régime alimentaire */}
              {/* <Grid item xs={12}>
                <Typography sx={{ marginBottom: '1rem', color: 'white', fontWeight: 'bold' }}>
                  Régime alimentaire
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={currentParticipant.isVegan || false}
                      onChange={(e) => handleParticipantChange('isVegan', e.target.checked)}
                      sx={{
                        color: palette.primary.red,
                        '&.Mui-checked': { color: palette.primary.red },
                      }}
                    />
                  }
                  label="Végan"
                  sx={{ color: 'white' }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={currentParticipant.hasAllergies || false}
                      onChange={(e) => handleParticipantChange('hasAllergies', e.target.checked)}
                      sx={{
                        color: palette.primary.red,
                        '&.Mui-checked': { color: palette.primary.red },
                      }}
                    />
                  }
                  label="Allergie arachides/ fruits à coque"
                  sx={{ color: 'white' }}
                />
              </Grid> */}

              {/* Charte participant */}
              <Grid item xs={12}>
                <Typography sx={{ marginBottom: '1rem', color: 'white', fontWeight: 'bold' }}>
                  Validation de la <a href="/Charte/Charte participant 2026.docx.pdf" download style={{ color: palette.primary.red, textDecoration: 'underline', cursor: 'pointer' }}>charte</a>
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={currentParticipant.charteValidated || false}
                      onChange={(e) => handleParticipantChange('charteValidated', e.target.checked)}
                      sx={{
                        color: palette.primary.red,
                        '&.Mui-checked': { color: palette.primary.red },
                      }}
                    />
                  }
                  label="Le participant a lu et approuvé la charte participant"
                  sx={{ color: 'white' }}
                />
                <Typography 
                  sx={{ 
                    color: '#FFA500', 
                    fontSize: '0.875rem', 
                    marginTop: '0.5rem',
                    fontStyle: 'italic'
                  }}
                >
                  En cochant cette case, vous vous engagez à ce que ce participant inscrit a lu et s'engage personnellement à respecter la <a href="/Charte/Charte participant 2026.docx.pdf" download style={{ color: '#FFA500', textDecoration: 'underline', cursor: 'pointer' }}>charte</a>.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer ce participant ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleDeleteParticipant} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModifierEquipe;
