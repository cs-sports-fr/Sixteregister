import { Autocomplete, Box, Button, Checkbox, Divider, Grid, InputLabel, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import { PropTypes } from "prop-types";
import { useEffect, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/fr';
import gender from "../../assets/gender.json";
import classementTennis from "../../assets/classementTennis.json";
import armevoeux from "../../assets/armevoeux.json";
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
            packId: '',
            mailHebergeur: '',
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
            packId: null,
            isVegan: false,
            hasAllergies: false,
            licenceID: '',
            weight: 0,
            productsIds: [],
            mailHebergeur: '',
            classementTennis: null,
            classementTT: null,
            armeVoeu1: null,
            armeVoeu2: null,
            armeVoeu3: null,
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
    const handleCheckboxChange = (goodieId, checked) => {
        setPlayerData(playerData.map((player, index) => {
            if (index === selectedPlayer - 1) {
                // Si la checkbox est cochée, ajoutez le goodieId au tableau des goodies du joueur
                // Sinon, retirez-le
                const updatedGoodies = checked
                    ? [...player.productsIds, goodieId]
                    : player.productsIds.filter(id => id !== goodieId);

                return { ...player, productsIds: updatedGoodies };
            }
            return player;
        }));
    };

    const [packs, setPacks] = useState([]);
    const [goodies, setGoodies] = useState([]);
    const fetchData = () => {
        const endpoints = [
            '/packs',
            '/products',
        ]
        axios.all(endpoints.map(url => ApiTossConnected.get(url)))
            .then(axios.spread((...responses) => {
                setPacks(responses[0].data);
                setGoodies(responses[1].data);
            })).catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        fetchData();
    }, []);


    const playerSchema = yup.object().shape({
        email: yup.string().email('Email invalide').required('Email requis'),
        lastname: yup.string().required('Nom requis'),
        firstname: yup.string().required('Prénom requis'),
        dateOfBirth: yup.date().required('Date de naissance requise'),
        gender: yup.string().required('Genre requis'),
        packId: yup.string().required('Pack requis'),

        mailHebergeur: yup.string().email('Email invalide').when(['packId'], {
            is: (packId) => packId == '5' || packId == '6' || packId == '11' || packId == '12', // Vérifie si packId est un des rez
            then: schema => schema.email("Email invalide").required("Email de l'hébergeur requis"),  // Rend emailHebergeur obligatoire si la condition est vraie
            otherwise: schema => schema.notRequired() // Rend emailHebergeur non obligatoire si la condition est fausse
        })
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
        // console.log(playerData);
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
                        showSnackbar('Une erreur est survenue', 3000, 'error',);
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
                                    <Box sx={{ justifyContent: 'left', textAlign: 'left', mb: 2 }}>
                                        <InputLabel htmlFor="licenceId" sx={{ marginBottom: 1 }}>Numéro de licence</InputLabel>
                                        <TextField id="licenceId"
                                            placeholder="Numéro de licence"
                                            variant="outlined"
                                            value={playerData[selectedPlayer - 1]?.licenceID || ''}
                                            onChange={handleChange}
                                            fullWidth
                                            autoComplete="licenceID"
                                            name="licenceID"
                                            error={!!errors.players[selectedPlayer - 1]?.licenceID}
                                            helperText={errors.players[selectedPlayer - 1]?.licenceID}
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
                                            autoComplete="firstname"
                                            name="firstname"
                                            error={!!errors.players[selectedPlayer - 1]?.firstname}
                                            helperText={errors.players[selectedPlayer - 1]?.firstname}
                                        />
                                    </Box>
                                    <Box sx={{ justifyContent: 'left', textAlign: 'left', mb: 2 }}>
                                        <InputLabel htmlFor="dateOfbBirth" sx={{ marginBottom: 1 }}>Date de naissance</InputLabel>
                                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                                            <DatePicker
                                                disableFuture
                                                value={playerData[selectedPlayer - 1]?.dateOfBirth ? dayjs(playerData[selectedPlayer - 1]?.dateOfBirth) : null}
                                                onChange={(newValue) => handleChange({ target: { name: "dateOfBirth", value: newValue ? new Date(newValue?.toDate()) : null } })}
                                                name="dateOfBirth"
                                                autoComplete="dateOfBirth"
                                                sx={{ width: '100%' }}
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                    <Box sx={{ justifyContent: 'left', textAlign: 'left', mb: 2 }}>
                                        <InputLabel htmlFor="pack" sx={{ marginBottom: 1 }}>Pack</InputLabel>
                                        <Autocomplete
                                            id="pack"
                                            variant="outlined"
                                            fullWidth
                                            options={sport.id !== 27 ? packs.filter(option => ![7, 8, 9, 10, 11, 12].includes(option.id)) : packs}
                                            getOptionLabel={(option) => option.name /*option.id === 5 ? "Rez sans Diner" : option.name*/}
                                            renderInput={(params) =>
                                                <TextField {...params}
                                                    placeholder="Rechercher pack"
                                                    InputLabelProps={{ shrink: true }}
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        style: {
                                                            paddingTop: 0,
                                                        },
                                                    }}
                                                    error={!!errors.players[selectedPlayer - 1]?.packId}
                                                    helperText={errors.players[selectedPlayer - 1]?.packId}
                                                />}
                                            renderOption={(props, option) => (
                                                <ListItem
                                                    key={option.id}
                                                    {...props}
                                                    variant="school"
                                                >
                                                    <ListItemText primary={option.name} />
                                                </ListItem>
                                            )}
                                            value={packs.find(option => option.id === playerData[selectedPlayer - 1]?.packId) || null}
                                            onChange={(e, newValue) => handleChange({ target: { name: "packId", value: newValue ? newValue.id : null } })}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                        />
                                    </Box>
                                    {(sport.sport === 'Boxe' || sport.sport === 'Judo') &&
                                        <Box sx={{ justifyContent: 'left', textAlign: 'left', mb: 2 }}>
                                            <InputLabel htmlFor="weight" sx={{ marginBottom: 1 }}>Poids</InputLabel>
                                            <TextField id="weight"
                                                placeholder="Poids (kg)"
                                                variant="outlined"
                                                value={playerData[selectedPlayer - 1]?.weight || ''}
                                                onChange={handleChange}
                                                fullWidth
                                                autoComplete="weight"
                                                name="weight"
                                                type="number"
                                                InputProps={{
                                                    inputProps: {
                                                        min: 0,
                                                        max: 200,
                                                        onInput: (e) => {
                                                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3);
                                                            if (parseInt(e.target.value) > 200) e.target.value = 200;
                                                        }
                                                    }
                                                }}
                                            />
                                        </Box>
                                    }
                                    {(sport.sport === 'Tennis de table') &&
                                        <Box sx={{ justifyContent: 'left', textAlign: 'left', mb: 2 }}>
                                            <InputLabel htmlFor="classementTT" sx={{ marginBottom: 1 }}>Classement</InputLabel>
                                            <TextField id="classementTT"
                                                placeholder="Classement"
                                                variant="outlined"
                                                value={playerData[selectedPlayer - 1]?.classementTT || ''}
                                                onChange={handleChange}
                                                fullWidth
                                                autoComplete="classementTT"
                                                name="classementTT"
                                                type="number"
                                                InputProps={{
                                                    inputProps: {
                                                        min: 0,
                                                        max: 5000,
                                                        onInput: (e) => {
                                                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 4);
                                                            if (parseInt(e.target.value) > 5000) e.target.value = 5000;
                                                        }
                                                    }
                                                }}
                                            />
                                        </Box>
                                    }
                                    {(sport.sport === 'Tennis') &&
                                        <Box sx={{ justifyContent: 'left', textAlign: 'left', mb: 2 }}>
                                            <InputLabel htmlFor="classementTennis" sx={{ marginBottom: 1 }}>Classement</InputLabel>
                                            <Autocomplete
                                                id="classementTennis"
                                                variant="outlined"
                                                fullWidth
                                                options={classementTennis}
                                                getOptionLabel={(option) => option.label}
                                                renderInput={(params) =>
                                                    <TextField {...params}
                                                        placeholder="Rechercher Classement"
                                                        InputLabelProps={{ shrink: true }}
                                                        inputProps={{
                                                            ...params.inputProps,
                                                            style: {
                                                                paddingTop: 0,
                                                            },
                                                        }}
                                                        error={!!errors.players[selectedPlayer - 1]?.classementTennis}
                                                        helperText={errors.players[selectedPlayer - 1]?.classementTennis}
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
                                                value={classementTennis.find(option => option.type === playerData[selectedPlayer - 1]?.classementTennis) || null}
                                                onChange={(e, newValue) => handleChange({ target: { name: "classementTennis", value: newValue ? newValue.type : null } })}
                                                isOptionEqualToValue={(option, value) => option.type === value.type}
                                            />
                                        </Box>

                                    }
                                    {(sport.sport === 'Escrime') &&
                                        <Box sx={{ justifyContent: 'left', textAlign: 'left', mb: 2 }}>
                                            <InputLabel htmlFor="armeVoeu1" sx={{ marginBottom: 1 }}>Voeu 1</InputLabel>
                                            <Autocomplete
                                                id="armeVoeu1"
                                                variant="outlined"
                                                fullWidth
                                                options={armevoeux}
                                                getOptionLabel={(option) => option.label}
                                                renderInput={(params) =>
                                                    <TextField {...params}
                                                        placeholder="Rechercher Arme"
                                                        InputLabelProps={{ shrink: true }}
                                                        inputProps={{
                                                            ...params.inputProps,
                                                            style: {
                                                                paddingTop: 0,
                                                            },
                                                        }}
                                                        error={!!errors.players[selectedPlayer - 1]?.armeVoeu1}
                                                        helperText={errors.players[selectedPlayer - 1]?.armeVoeu1}
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
                                                value={armevoeux.find(option => option.type === playerData[selectedPlayer - 1]?.armeVoeu1) || null}
                                                onChange={(e, newValue) => handleChange({ target: { name: "armeVoeu1", value: newValue ? newValue.type : null } })}
                                                isOptionEqualToValue={(option, value) => option.type === value.type}
                                            />
                                            <InputLabel htmlFor="armeVoeu2" sx={{ marginBottom: 1 }}>Voeu 2</InputLabel>
                                            <Autocomplete
                                                id="armeVoeu2"
                                                variant="outlined"
                                                fullWidth
                                                options={armevoeux}
                                                getOptionLabel={(option) => option.label}
                                                renderInput={(params) =>
                                                    <TextField {...params}
                                                        placeholder="Rechercher Arme"
                                                        InputLabelProps={{ shrink: true }}
                                                        inputProps={{
                                                            ...params.inputProps,
                                                            style: {
                                                                paddingTop: 0,
                                                            },
                                                        }}
                                                        error={!!errors.players[selectedPlayer - 1]?.armeVoeu2}
                                                        helperText={errors.players[selectedPlayer - 1]?.armeVoeu2}
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
                                                value={armevoeux.find(option => option.type === playerData[selectedPlayer - 1]?.armeVoeu2) || null}
                                                onChange={(e, newValue) => handleChange({ target: { name: "armeVoeu2", value: newValue ? newValue.type : null } })}
                                                isOptionEqualToValue={(option, value) => option.type === value.type}
                                            />
                                            <InputLabel htmlFor="armeVoeu3" sx={{ marginBottom: 1 }}>Voeu 3</InputLabel>
                                            <Autocomplete
                                                id="armeVoeu3"
                                                variant="outlined"
                                                fullWidth
                                                options={armevoeux}
                                                getOptionLabel={(option) => option.label}
                                                renderInput={(params) =>
                                                    <TextField {...params}
                                                        placeholder="Rechercher Arme"
                                                        InputLabelProps={{ shrink: true }}
                                                        inputProps={{
                                                            ...params.inputProps,
                                                            style: {
                                                                paddingTop: 0,
                                                            },
                                                        }}
                                                        error={!!errors.players[selectedPlayer - 1]?.armeVoeu3}
                                                        helperText={errors.players[selectedPlayer - 1]?.armeVoeu3}
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
                                                value={armevoeux.find(option => option.type === playerData[selectedPlayer - 1]?.armeVoeu3) || null}
                                                onChange={(e, newValue) => handleChange({ target: { name: "armeVoeu3", value: newValue ? newValue.type : null } })}
                                                isOptionEqualToValue={(option, value) => option.type === value.type}
                                            />
                                        </Box>
                                    }
                                </Grid>
                            </Grid>
                            {(playerData[selectedPlayer - 1]?.packId === 5 || playerData[selectedPlayer - 1]?.packId === 6 || playerData[selectedPlayer - 1]?.packId === 11 || playerData[selectedPlayer - 1]?.packId === 12) &&
                                <Box sx={{ justifyContent: 'left', textAlign: 'left', mb: 2 }}>
                                    <InputLabel htmlFor="mailHebergeur" sx={{ marginBottom: 1 }}>Email hebergeur (Uniquement chez une de vos connaissances)</InputLabel>
                                    <TextField id="mailHebergeur"
                                        placeholder="Email hebergeur"
                                        variant="outlined"
                                        value={playerData[selectedPlayer - 1]?.mailHebergeur || ''}
                                        onChange={handleChange}
                                        fullWidth
                                        name="mailHebergeur"
                                        error={!!errors.players[selectedPlayer - 1]?.mailHebergeur}
                                        helperText={errors.players[selectedPlayer - 1]?.mailHebergeur}
                                    />
                                </Box>
                            }
                            <Divider sx={{ marginY: 1 }} />
                            <Box>
                                <Typography variant="h6" sx={{ mb: 1 }}>Régime alimentaire</Typography>
                                <Box sx={{ justifyContent: 'left', textAlign: 'left' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, ml: 1 }}>
                                        <Checkbox
                                            sx={{
                                                color: "primary.main",
                                                '&.Mui-checked': {
                                                    color: "primary.main",
                                                },
                                            }}
                                            checked={playerData[selectedPlayer - 1]?.isVegan}
                                            onChange={(e, checked) => handleChange({ target: { name: "isVegan", value: checked } })}
                                        />
                                        <Typography sx={{ ml: 2 }}>Végan</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, ml: 1 }}>
                                        <Checkbox
                                            sx={{
                                                color: "primary.main",
                                                '&.Mui-checked': {
                                                    color: "primary.main",
                                                },
                                            }}
                                            checked={playerData[selectedPlayer - 1]?.hasAllergies}
                                            onChange={(e, checked) => handleChange({ target: { name: "hasAllergies", value: checked } })}
                                        />
                                        <Typography sx={{ ml: 2 }}>Allergie arachides/ fruits à coque</Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Divider sx={{ marginY: 2 }} />
                            <Box>
                                <Typography variant="h6" sx={{ mb: 2 }}>Choix des goodies</Typography>
                                <Box sx={{ justifyContent: 'left', textAlign: 'left', mb: 1 }}>
                                    {goodies.map((goodie) => (
                                        <Box key={goodie.id} sx={{ display: 'flex', alignItems: 'center', mb: 0.5, ml: 1 }}>
                                            <Checkbox
                                                sx={{
                                                    color: "primary.main",
                                                    '&.Mui-checked': {
                                                        color: "primary.main",
                                                    },
                                                }}
                                                checked={playerData[selectedPlayer - 1]?.productsIds.includes(goodie.id)}
                                                onChange={(e, checked) => handleCheckboxChange(goodie.id, checked)}
                                            />
                                            <Typography sx={{ ml: 2 }}>{goodie.name}</Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
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