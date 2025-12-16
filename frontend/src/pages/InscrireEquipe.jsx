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
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/fr';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import NavbarParticipant from "../components/navbar/NavbarParticipant";
import palette from "../themes/palette";
import { ApiTossConnected } from "../service/axios";
import gender from "../assets/gender.json";
import { useSnackbar } from "../provider/snackbarProvider";

const InscrireEquipe = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [step, setStep] = useState(1); // 1: Sport selection, 2: Team info, 3: Participants
  const [sports, setSports] = useState([]);
  const [packs, setPacks] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [teamLevel, setTeamLevel] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState(0);
  const [participants, setParticipants] = useState([]);

  // Load sports and packs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sportsRes, packsRes] = await Promise.all([
          ApiTossConnected.get('/sports'),
          ApiTossConnected.get('/packs')
        ]);
        setSports(sportsRes.data);
        setPacks(packsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        showSnackbar('Erreur lors du chargement des données', 3000, 'error');
      }
    };
    fetchData();
  }, []);

  // Initialize participants when sport is selected
  useEffect(() => {
    if (selectedSport) {
      const nbParticipants = selectedSport.nbPlayersMax || 1;
      const initialParticipants = Array.from({ length: nbParticipants }, (_, index) => ({
        gender: '',
        firstname: '',
        lastname: '',
        mobile: '',
        email: '',
        dateOfBirth: null,
        isCaptain: index === 0,
        licenceID: '',
        packId: null,
        isVegan: false,
        hasAllergies: false,
        productsIds: [],
        weight: null,
        mailHebergeur: '',
      }));
      setParticipants(initialParticipants);
      setSelectedParticipant(0);
    }
  }, [selectedSport]);

  const handleParticipantChange = (field, value) => {
    const updatedParticipants = [...participants];
    updatedParticipants[selectedParticipant][field] = value;
    setParticipants(updatedParticipants);
  };

  const handleSubmit = async () => {
    try {
      // Validation
      if (!teamName || !teamLevel) {
        showSnackbar('Veuillez remplir le nom et le niveau de l\'équipe', 3000, 'error');
        return;
      }

      // Filter only filled participants (at minimum: captain)
      const filledParticipants = participants.filter((p, index) => {
        if (index === 0) return true; // Captain is mandatory
        return p.email && p.firstname && p.lastname;
      });

      if (filledParticipants.length < (selectedSport?.nbPlayersMin || 1)) {
        showSnackbar(`Au moins ${selectedSport?.nbPlayersMin || 1} participant(s) requis`, 3000, 'error');
        return;
      }

      // Format data for backend
      const formattedParticipants = filledParticipants.map(p => ({
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
        productsIds: p.productsIds || [],
        weight: p.weight ? parseFloat(p.weight) : null,
        mailHebergeur: p.mailHebergeur || null,
      }));

      await ApiTossConnected.post(
        `/teams/?name=${encodeURIComponent(teamName)}&level=${encodeURIComponent(teamLevel)}&sportId=${selectedSport.id}`,
        formattedParticipants
      );

      showSnackbar('Équipe créée avec succès !', 3000, 'success');
      navigate('/mes-equipes');
    } catch (error) {
      console.error('Error creating team:', error);
      const errorMsg = error.response?.data?.detail || 'Erreur lors de la création de l\'équipe';
      showSnackbar(errorMsg, 3000, 'error');
    }
  };

  const currentParticipant = participants[selectedParticipant] || {};
  const minParticipants = selectedSport?.nbPlayersMin || 1;

  return (
    <>
      <NavbarParticipant />
      <Box
        sx={{
          backgroundColor: palette.primary.dark,
          minHeight: '100vh',
          paddingTop: { xs: '80px', md: '80px' },
          color: 'white',
        }}
      >
        {/* Breadcrumb */}
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: { xs: '0.8rem 1rem', md: '1rem 3rem' },
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: { xs: '0.75rem', md: '0.9rem' },
            flexWrap: 'wrap',
          }}
        >
          <Typography sx={{ color: 'white' }}>Inscrire une équipe</Typography>
          {selectedSport && (
            <>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>›</Typography>
              <Typography sx={{ color: 'white' }}>Sport collectif</Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>›</Typography>
              <Typography sx={{ color: 'white' }}>{selectedSport.sport}</Typography>
            </>
          )}
        </Box>

        <Grid container sx={{ minHeight: 'calc(100vh - 180px)' }}>
          {/* Left Sidebar */}
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              padding: { xs: '1.5rem', md: '2rem' },
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: '1rem', md: '1.5rem' },
            }}
          >
            {/* Team Name & Level */}
            {selectedSport && (
              <>
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

                <TextField
                  label="Niveau de l'équipe"
                  value={teamLevel}
                  onChange={(e) => setTeamLevel(e.target.value)}
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

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: { xs: '0.75rem', md: '0.5rem' },
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    borderRadius: '8px',
                    fontSize: { xs: '0.8rem', md: '0.85rem' },
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.4 }}>
                    ℹ️ Veuillez ajouter [DELEG] au début du nom de votre équipe si votre école est une délégation ET que vous utilisez une place réservée dans ce sport pour CETTE équipe !
                  </Typography>
                </Box>

                {/* Participants List */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: palette.primary.red,
                      marginBottom: { xs: '0.75rem', md: '1rem' },
                      fontWeight: 'bold',
                      fontSize: { xs: '0.95rem', md: '1rem' },
                    }}
                  >
                    Joueur n°1 (Capitaine)
                  </Typography>
                  {participants.map((p, index) => {
                    if (index === 0) return null; // Skip captain, shown above
                    return (
                      <Typography
                        key={index}
                        onClick={() => setSelectedParticipant(index)}
                        sx={{
                          padding: { xs: '0.9rem', md: '0.75rem' },
                          marginBottom: { xs: '0.6rem', md: '0.5rem' },
                          cursor: 'pointer',
                          backgroundColor:
                            selectedParticipant === index
                              ? 'rgba(255, 107, 107, 0.2)'
                              : 'transparent',
                          borderRadius: '8px',
                          color: selectedParticipant === index ? palette.primary.red : 'white',
                          transition: 'all 0.3s ease',
                          fontSize: { xs: '0.95rem', md: '1rem' },
                          '&:hover': {
                            backgroundColor: 'rgba(255, 107, 107, 0.1)',
                          },
                        }}
                      >
                        Joueur n°{index + 1} {index + 1 <= minParticipants ? '' : '(optionnel)'}
                      </Typography>
                    );
                  })}
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSubmit}
                  sx={{
                    marginTop: { xs: '1rem', md: 'auto' },
                    backgroundColor: palette.primary.red,
                    color: 'white',
                    padding: { xs: '1rem', md: '0.75rem' },
                    fontWeight: 'bold',
                    fontSize: { xs: '1rem', md: '0.95rem' },
                    '&:hover': {
                      backgroundColor: '#FF5252',
                    },
                  }}
                >
                  Valider l'équipe
                </Button>
              </>
            )}

            {/* Sport Selection */}
            {!selectedSport && (
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    marginBottom: { xs: '1rem', md: '1rem' },
                    fontSize: { xs: '1.1rem', md: '1.25rem' }
                  }}
                >
                  Sélectionnez un sport
                </Typography>
                {sports.map((sport) => (
                  <Button
                    key={sport.id}
                    variant="outlined"
                    fullWidth
                    onClick={() => setSelectedSport(sport)}
                    sx={{
                      marginBottom: { xs: '0.8rem', md: '1rem' },
                      padding: { xs: '0.9rem', md: '0.6rem' },
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      fontSize: { xs: '0.95rem', md: '1rem' },
                      '&:hover': {
                        borderColor: palette.primary.red,
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                      },
                    }}
                  >
                    {sport.sport}
                  </Button>
                ))}
              </Box>
            )}
          </Grid>

          {/* Right Content Area */}
          <Grid
            item
            xs={12}
            md={9}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              padding: { xs: '1.5rem', sm: '2rem', md: '3rem' },
            }}
          >
            {selectedSport ? (
              <>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    marginBottom: { xs: '1.5rem', md: '2rem' }, 
                    color: 'white',
                    fontSize: { xs: '1.3rem', sm: '1.5rem', md: '2rem' }
                  }}
                >
                  Participant n°{selectedParticipant + 1}{' '}
                  {selectedParticipant === 0 && '(Capitaine)'}
                </Typography>

                

                <Grid container spacing={3}>
                  {/* Nom */}
                  <Grid item xs={12} md={6}>
                    <Typography 
                      sx={{ 
                        marginBottom: '0.5rem', 
                        color: 'white',
                        fontSize: { xs: '0.95rem', md: '1rem' },
                        fontWeight: 500
                      }}
                    >
                      Nom
                    </Typography>
                    <TextField
                      placeholder="Nom"
                      value={currentParticipant.lastname}
                      onChange={(e) => handleParticipantChange('lastname', e.target.value)}
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          fontSize: { xs: '1rem', md: '1rem' },
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                          '&:hover fieldset': { borderColor: palette.primary.red },
                          '&.Mui-focused fieldset': { borderColor: palette.primary.red },
                        },
                        '& .MuiOutlinedInput-input': {
                          padding: { xs: '14px', md: '16.5px 14px' },
                        },
                      }}
                    />
                  </Grid>

                  {/* Prénom */}
                  <Grid item xs={12} md={6}>
                    <Typography 
                      sx={{ 
                        marginBottom: '0.5rem', 
                        color: 'white',
                        fontSize: { xs: '0.95rem', md: '1rem' },
                        fontWeight: 500
                      }}
                    >
                      Prénom
                    </Typography>
                    <TextField
                      placeholder="Prénom"
                      value={currentParticipant.firstname}
                      onChange={(e) => handleParticipantChange('firstname', e.target.value)}
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          fontSize: { xs: '1rem', md: '1rem' },
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                          '&:hover fieldset': { borderColor: palette.primary.red },
                          '&.Mui-focused fieldset': { borderColor: palette.primary.red },
                        },
                        '& .MuiOutlinedInput-input': {
                          padding: { xs: '14px', md: '16.5px 14px' },
                        },
                      }}
                    />
                  </Grid>

                  {/* Email */}
                  <Grid item xs={12} md={6}>
                    <Typography 
                      sx={{ 
                        marginBottom: '0.5rem', 
                        color: 'white',
                        fontSize: { xs: '0.95rem', md: '1rem' },
                        fontWeight: 500
                      }}
                    >
                      Email
                    </Typography>
                    <TextField
                      placeholder="Email"
                      type="email"
                      value={currentParticipant.email}
                      onChange={(e) => handleParticipantChange('email', e.target.value)}
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          fontSize: { xs: '1rem', md: '1rem' },
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                          '&:hover fieldset': { borderColor: palette.primary.red },
                          '&.Mui-focused fieldset': { borderColor: palette.primary.red },
                        },
                        '& .MuiOutlinedInput-input': {
                          padding: { xs: '14px', md: '16.5px 14px' },
                        },
                      }}
                    />
                  </Grid>

                  {/* Numéro de téléphone */}
                  <Grid item xs={12} md={6}>
                    <Typography 
                      sx={{ 
                        marginBottom: '0.5rem', 
                        color: 'white',
                        fontSize: { xs: '0.95rem', md: '1rem' },
                        fontWeight: 500
                      }}
                    >
                      Numéro de téléphone
                    </Typography>
                    <TextField
                      placeholder="Numéro de téléphone"
                      value={currentParticipant.mobile}
                      onChange={(e) => handleParticipantChange('mobile', e.target.value)}
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          fontSize: { xs: '1rem', md: '1rem' },
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                          '&:hover fieldset': { borderColor: palette.primary.red },
                          '&.Mui-focused fieldset': { borderColor: palette.primary.red },
                        },
                        '& .MuiOutlinedInput-input': {
                          padding: { xs: '14px', md: '16.5px 14px' },
                        },
                      }}
                    />
                  </Grid>

                  {/* Genre */}
                  <Grid item xs={12} md={6}>
                    <Typography 
                      sx={{ 
                        marginBottom: '0.5rem', 
                        color: 'white',
                        fontSize: { xs: '0.95rem', md: '1rem' },
                        fontWeight: 500
                      }}
                    >
                      Genre
                    </Typography>
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
                              fontSize: { xs: '1rem', md: '1rem' },
                              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                              '&:hover fieldset': { borderColor: palette.primary.red },
                              '&.Mui-focused fieldset': { borderColor: palette.primary.red },
                            },
                            '& .MuiOutlinedInput-input': {
                              padding: { xs: '16.5px 14px', md: '16.5px 14px' },
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* Date de naissance */}
                  <Grid item xs={12} md={6}>
                    <Typography 
                      sx={{ 
                        marginBottom: '0.5rem', 
                        color: 'white',
                        fontSize: { xs: '0.95rem', md: '1rem' },
                        fontWeight: 500
                      }}
                    >
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
                            fontSize: { xs: '1rem', md: '1rem' },
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                            '&:hover fieldset': { borderColor: palette.primary.red },
                            '&.Mui-focused fieldset': { borderColor: palette.primary.red },
                          },
                          '& .MuiOutlinedInput-input': {
                            padding: { xs: '14px', md: '16.5px 14px' },
                          },
                          '& .MuiSvgIcon-root': { color: 'white' },
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>

                  {/* Pack */}
                  <Grid item xs={12} md={6}>
                    <Typography 
                      sx={{ 
                        marginBottom: '0.5rem', 
                        color: 'white',
                        fontSize: { xs: '0.95rem', md: '1rem' },
                        fontWeight: 500
                      }}
                    >
                      Pack
                    </Typography>
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
                          fontSize: { xs: '1rem', md: '1rem' },
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                          '&:hover fieldset': { borderColor: palette.primary.red },
                          '&.Mui-focused fieldset': { borderColor: palette.primary.red },
                        },
                        '& .MuiOutlinedInput-input': {
                          padding: { xs: '14px', md: '16.5px 14px' },
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

                  {/* Régime alimentaire
                  <Grid item xs={12}>
                    <Typography 
                      sx={{ 
                        marginBottom: { xs: '0.75rem', md: '1rem' }, 
                        color: 'white', 
                        fontWeight: 'bold',
                        fontSize: { xs: '1rem', md: '1.1rem' }
                      }}
                    >
                      Régime alimentaire
                    </Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={currentParticipant.isVegan}
                          onChange={(e) => handleParticipantChange('isVegan', e.target.checked)}
                          sx={{
                            color: palette.primary.red,
                            '&.Mui-checked': { color: palette.primary.red },
                            '& .MuiSvgIcon-root': { fontSize: { xs: 28, md: 24 } },
                          }}
                        />
                      }
                      label="Végan"
                      sx={{ 
                        color: 'white',
                        '& .MuiFormControlLabel-label': {
                          fontSize: { xs: '0.95rem', md: '1rem' },
                        },
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={currentParticipant.hasAllergies}
                          onChange={(e) => handleParticipantChange('hasAllergies', e.target.checked)}
                          sx={{
                            color: palette.primary.red,
                            '&.Mui-checked': { color: palette.primary.red },
                            '& .MuiSvgIcon-root': { fontSize: { xs: 28, md: 24 } },
                          }}
                        />
                      }
                      label="Allergie arachides/ fruits à coque"
                      sx={{ 
                        color: 'white',
                        '& .MuiFormControlLabel-label': {
                          fontSize: { xs: '0.95rem', md: '1rem' },
                        },
                      }}
                    />
                  </Grid>*/}
                </Grid>
              </>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                <Typography variant="h5" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  Sélectionnez un sport pour commencer
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default InscrireEquipe;
