import { Autocomplete, Box, Button, Checkbox, Divider, Grid, InputLabel, ListItem, ListItemText, TextField, Typography, RadioGroup, FormControlLabel, Radio, FormHelperText } from "@mui/material";
import { PropTypes } from "prop-types";
import { useEffect, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/fr';
import gender from "../../assets/gender.json";
import { ApiTossConnected } from "../../service/axios";
import axios from "axios";
import * as yup from 'yup';
import { useSnackbar } from "../../provider/snackbarProvider";
import { Warning } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { parseRegisterTeamRequest } from "../../utils/parseRequestRegisterTeam";
import dayjs from "dayjs";

const RegisterTeam = ({ sport }) => {

    const { showSnackbar } = useSnackbar();

    const [teamName, setTeamName] = useState("");



    const navigation = useNavigate();

    const initialErrorState = {
        teamName: '',
        players: Array.from({ length: sport.nbPlayersMax }, () => ({
            email: '',
            lastname: '',
            firstname: '',
            dateOfBirth: '',
            gender: '',
            isBoursier : '',
            ValidateBoursier : '',
        })),
    };
    const [errors, setErrors] = useState(initialErrorState);

    const handleChangeTeamName = (text) => {
        setTeamName(text.target.value);
    }

    const [selectedPlayer, setSelectedPlayer] = useState(1);

    const displayPlayer = []
    for (let i = 1; i <= sport.nbPlayersMax; i++) {
        const playerHasError = Object.values(errors.players[i - 1]).some(error => error !== '');
        displayPlayer.push(<DisplayPlayer key={i} id={i} mandatory={i <= sport.nbPlayersMin} selected={i == selectedPlayer} onClick={() => setSelectedPlayer(i)} hasError={playerHasError} />)
    }

    const [playerData, setPlayerData] = useState(
        Array.from({ length: sport.nbPlayersMax }, (_, index) => ({
            id: index + 1,
            email: null,
            lastname: null,
            firstname: null,
            dateOfBirth: null,
            isCaptain: index === 0,
            gender: null,
            isBoursier : false,
            ValidateBoursier : false,
        }))
    );

    // eslint-disable-next-line no-unused-vars
    const handleChange = (e, newInput) => {
        const { name, value } = e.target;
        // console.log("name ", name, " value ", value);
        setPlayerData(playerData.map((player, index) =>
            index === selectedPlayer - 1 ? { ...player, [name]: value } : player
        ))
    }
   
  

   


    const playerSchema = yup.object().shape({
        email: yup.string().email('Email invalide').required('Email requis'),
        lastname: yup.string().required('Nom requis'),
        firstname: yup.string().required('Prénom requis'),
        dateOfBirth: yup.date().required('Date de naissance requise'),
        gender: yup.string().required('Genre requis'),
        isBoursier: yup.string().required('Obligatoire'),


      
    });

    const optionalPlayerSchema = yup.object().test(
        'is-empty-or-full',
        'Vous devez completer les joueurs',
        function (player, context) {
            const values = Object.values(player);
            const allEmpty = values.slice(1, -7).every(value => !value); // on elenve l'id et le tableau de goodies et les champs optionnels

            if (allEmpty) {
                // Si tous les champs sont vides, la validation passe
                return true;
            } else {
                // Si au moins un champ est rempli, valider selon playerSchema
                return playerSchema.validate(player).then(() => true).catch(err => {
                    // Renvoie une erreur de yup avec le message d'erreur original de playerSchema
                    return context.createError({ path: context.path, message: err.errors[0] });
                });
            }
        }
    )


    const teamSchema = yup.object().shape({
        teamName: yup.string().required('Nom de l\'équipe requis'),
        players: yup.array().of(
            yup.lazy((player) => player.id <= sport.nbPlayersMin ? playerSchema : optionalPlayerSchema)
        )
    });


    const handleSubmit = async (event) => {
        console.log(playerData);
        event.preventDefault()
        try {
            await teamSchema.validate({ teamName, players: playerData }, { abortEarly: false })
            setErrors(initialErrorState)
            ApiTossConnected.post(`/teams/?name=${teamName}&sportId=${sport.id}`, parseRegisterTeamRequest(playerData), { headers: { 'Content-Type': 'application/json' } })
                .then(() => {
                    showSnackbar('Inscription réussie', 3000, 'success',);
                    navigation('/');
                })
                .catch((error) => {
                    console.log(error);
                    if (error.response.data.detail === "A team with this name already exists") {
                        showSnackbar('Une équipe a déja ce nom', 3000, 'error',);
                    } else {
                        showSnackbar('Une erreur est là', 3000, 'error',);
                    }

                });

        } catch (err) {
            if (err instanceof yup.ValidationError) {
                const newErrors = { ...initialErrorState }; // Commencez avec une structure d'erreur vierge
                err.inner.forEach((error) => {
                    const { path, message } = error;
                    // Découper le chemin pour accéder à l'index et au champ du joueur
                    let [section, index, field] = path.split(/[[\].]+/);
                    if (section === 'players' && index !== undefined && field !== undefined && field !== '') {
                        if (!newErrors[section][index]) {
                            newErrors[section][index] = {};
                        }
                        newErrors[section][index][field] = message; // Assigner le message d'erreur
                    } else if (field !== '') {
                        newErrors[path] = message; // Gérer les erreurs non liées aux joueurs
                    }
                });
                setErrors(newErrors);
                showSnackbar('Erreur lors de l\'inscription', 1000, 'error');
            }
        }
    }

    return (
        <Grid container spacing={2} direction="row" justifyContent="center" alignItems="center"
            sx={{ display: "flex", flexGrow: 1, mt: 0 }}
        >
            <Grid item xs={2.5} sx={{ height: '100%', bgcolor: 'background.drawer' }}>
                <Box sx={{
                    margin: 3,
                }}>
                    <TextField
                        id="teamName"
                        variant="outlined"
                        value={teamName}
                        onChange={handleChangeTeamName}
                        fullWidth
                        placeholder="Nom de l'équipe"
                        error={!!errors.teamName}
                        helperText={errors.teamName}
                    />
                </Box>
                <Divider sx={{ margin: 3 }} />
                <Box sx={{ margin: 3 }}>
                    {displayPlayer}
                </Box>
                <Divider sx={{ margin: 3 }} />
                <Box sx={{
                    margin: 3,
                }}>
                    <Button variant="contained" fullWidth
                        onClick={handleSubmit}
                    >
                        Valider l&apos;équipe
                    </Button>
                </Box>


            </Grid>
            <Grid item xs={9.5} sx={{ height: '100%', backgroundColor: 'background.paper' }}>
                <Box sx={{ marginX: '10%', marginTop: 4 }}>
                    <Typography variant="h5">Participant n°{selectedPlayer} {selectedPlayer == 1 && "(Capitaine)"}</Typography>

                    <Box sx={{ display: 'flex' }}>
                        <form style={{ width: '100%' }}>
                            <Grid container spacing={2} direction="row" justifyContent="center" alignItems="flex-start" marginTop={2} sx={{ backgroundColor: 'background.paper' }}>
                                <Grid item xs={6} sx={{ backgroundColor: 'background.paper' }}>
                                    <Box sx={{ justifyContent: 'left', textAlign: 'left', mb: 2 }}>
                                        <InputLabel htmlFor="lastname" sx={{ marginBottom: 1 }}>Nom</InputLabel>
                                        <TextField id="lastname"
                                            placeholder="Nom"
                                            variant="outlined"
                                            value={playerData[selectedPlayer - 1]?.lastname || ''}
                                            onChange={handleChange}
                                            fullWidth
                                            autoComplete="lastname"
                                            name="lastname"
                                            inputProps={{
                                                style: {
                                                    color: 'white', // Add this line for white text
            
                                                },
                                            }}
                                            error={!!errors.players[selectedPlayer - 1]?.lastname}
                                            helperText={errors.players[selectedPlayer - 1]?.lastname}
                                        />
                                    </Box>
                                    <Box sx={{ justifyContent: 'left', textAlign: 'left', mb: 2 }}>
                                        <InputLabel htmlFor="email" sx={{ marginBottom: 1 }}>Email</InputLabel>
                                        <TextField id="email"
                                            placeholder="Email"
                                            variant="outlined"
                                            value={playerData[selectedPlayer - 1]?.email || ''}
                                            onChange={handleChange}
                                            fullWidth
                                            autoComplete="email"
                                            name="email"
                                            inputProps={{
                                                style: {
                                                    color: 'white', // Add this line for white text
            
                                                },
                                            }}
                                            error={!!errors.players[selectedPlayer - 1]?.email}
                                            helperText={errors.players[selectedPlayer - 1]?.email}
                                        />
                                    </Box>
                                    <Box sx={{ justifyContent: 'left', textAlign: 'left', mb: 2 }}>
                                        <InputLabel htmlFor="gender" sx={{ marginBottom: 1 }}>Genre</InputLabel>
                                        <Autocomplete
                                            id="gender"
                                            variant="outlined"
                                            fullWidth
                                            options={gender}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) =>
                                                <TextField {...params}
                                                    placeholder="Rechercher genre"
                                                    InputLabelProps={{ shrink: true }}
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        style: {
                                                            paddingTop: 0,
                                                            color:'white', // Add this line for white text
                                                        },
                                                    }}
                                                    error={!!errors.players[selectedPlayer - 1]?.gender}
                                                    helperText={errors.players[selectedPlayer - 1]?.gender}
                                                />}
                                            renderOption={(props, option) => (
                                                <ListItem
                                                    key={option.id}
                                                    {...props}
                                                    variant="school"
                                                >
                                                    <ListItemText primary={option.label} />
                                                </ListItem>
                                            )}
                                            value={gender.find(option => option.type === playerData[selectedPlayer - 1]?.gender) || null}
                                            onChange={(e, newValue) => handleChange({ target: { name: "gender", value: newValue ? newValue.type : null } })}
                                            isOptionEqualToValue={(option, value) => option.type === value.type}
                                        />
                                    </Box>
                                    
                                </Grid>
                                <Grid item xs={6} sx={{ backgroundColor: 'background.paper' }}>
                                    <Box sx={{ justifyContent: 'left', textAlign: 'left', mb: 2 }}>
                                        <InputLabel htmlFor="firstname" sx={{ marginBottom: 1 }}>Prénom</InputLabel>
                                        <TextField id="firstname"
                                            placeholder="Prénom"
                                            variant="outlined"
                                            value={playerData[selectedPlayer - 1]?.firstname || ''}
                                            onChange={handleChange}
                                            fullWidth
                                            inputProps={{
                                                style: {
                                                    color: 'white', // Add this line for white text
            
                                                },
                                            }}
                                            autoComplete="firstname"
                                            name="firstname"
                                            error={!!errors.players[selectedPlayer - 1]?.firstname}
                                            helperText={errors.players[selectedPlayer - 1]?.firstname}
                                        />
                                    </Box>
                                    <Box sx={{ justifyContent: 'left', textAlign: 'left', mb: 2 }}>
                                        <InputLabel htmlFor="dateOfBirth" sx={{ marginBottom: 1, color: 'white' }}>
                                            Date de naissance
                                        </InputLabel>
                                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                                            <DatePicker
                                                disableFuture
                                                value={playerData[selectedPlayer - 1]?.dateOfBirth ? dayjs(playerData[selectedPlayer - 1]?.dateOfBirth) : null}
                                                onChange={(newValue) =>
                                                    handleChange({
                                                        target: {
                                                            name: "dateOfBirth",
                                                            value: newValue ? new Date(newValue?.toDate()) : null,
                                                        },
                                                    })
                                                }
                                                name="dateOfBirth"
                                                autoComplete="dateOfBirth"
                                                sx={{
                                                    width: '100%',
                                                    '.MuiInputBase-root': {
                                                        color: 'white', // Ensure input text is white
                                                    },
                                                    '.MuiInputBase-input': {
                                                        color: 'white', // Text color in the input
                                                    },
                                                    '.MuiSvgIcon-root': {
                                                        color: 'white', // Icon color (e.g., calendar icon)
                                                    },
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Box>


                                    <Box sx={{ justifyContent: 'left', textAlign: 'left', mb: 2 }}>
                                        <InputLabel htmlFor="isBoursier" sx={{ marginBottom: 1 }}>Boursier</InputLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="isBoursier"
                                            name="isBoursier"
                                            value={String(playerData[selectedPlayer - 1]?.isBoursier || false)}
                                            onChange={(event) => handleChange({
                                                target: {
                                                    name: 'isBoursier',
                                                    value: event.target.value === 'true'
                    }
                })}
            >
                <FormControlLabel value="true" control={<Radio />} label="Oui" />
                <FormControlLabel value="false" control={<Radio />} label="Non" />
            </RadioGroup>
            {errors.players[selectedPlayer - 1]?.isBoursier && (
                <FormHelperText error>{errors.players[selectedPlayer - 1]?.isBoursier}</FormHelperText>
            )}
        </Box>
                                    
                                </Grid>
                            </Grid>
                            
                            
                            
                        </form>
                    </Box>
                </Box>
            </Grid>
        </Grid >

    )

};

RegisterTeam.propTypes = {
    sport: PropTypes.object.isRequired
};
export default RegisterTeam;

const DisplayPlayer = ({ id, mandatory, selected, onClick, hasError }) => {

    return (
        <Box onClick={() => onClick()} sx={{ cursor: "pointer", marginY: 1.5, display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ color: selected && 'primary.main', flex: 1 }}> Joueur n°{id} {id === 1 && "(Capitaine)"} {!mandatory && "(optionnel)"}</Typography>
            {hasError && <Warning color="error" />}
        </Box>
    );
};

DisplayPlayer.propTypes = {
    id: PropTypes.number.isRequired,
    selected: PropTypes.bool.isRequired,
    mandatory: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    hasError: PropTypes.bool.isRequired,
};