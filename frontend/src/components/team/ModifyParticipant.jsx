import { Autocomplete, Box, Button, Checkbox, Dialog, DialogActions, DialogTitle, Divider, Drawer, InputLabel, ListItem, ListItemText, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import gender from "../../assets/gender.json";
import classementTennis from "../../assets/classementTennis.json"
import armevoeux from "../../assets/armevoeux.json"
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { ApiTossConnected } from '../../service/axios';
import { useSnackbar } from '../../provider/snackbarProvider';
import { useState } from 'react';

const ModifyParticipant = ({ open, onClose, goodies, packs, participant, errors, handleChange, handleCheckboxChange, handleSubmit, deleteEnabled, teamId, sport }) => {

    const { showSnackbar } = useSnackbar();

    const [dialogOpen, setDialogOpen] = useState(false);
    const handleDelete = () => {
        ApiTossConnected.delete('teams/' + teamId + '/participants', { data: [participant.id] })
            .then(() => {
                handleClose();
                showSnackbar('Joueur supprimé', 2000, 'success');
            }
            ).catch(() => {
                showSnackbar('Erreur lors de la suppression du joueur', 2000, 'error');
            });
    }

    const [file, setFile] = useState(null);
    const handleFileChange = (event) => {
        // Vérifier si un fichier a été sélectionné
        if (event.target.files && event.target.files[0]) {
            // Mettre à jour l'état avec le premier fichier sélectionné
            setFile(event.target.files[0]);
        }
    };

    const handleClose = () => {
        setFile(null);
        onClose();
    }

    const onSubmit = (event) => {
        event.preventDefault();
        if (file) {
            const formData = new FormData();
            formData.append('certificate', file);
            ApiTossConnected.post('teams/' + teamId + '/participant/' + participant.id + '/certificate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(() => {
                // showSnackbar('Certificat médical enregistré', 2000, 'success');
            }).catch(() => {
                showSnackbar('Erreur lors de l\'enregistrement du certificat médical', 2000, 'error');
            });
        }

        handleSubmit(event);

    }


    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={handleClose}
        >
            <Box sx={{ width: '45vw' }}>
                <Box sx={{ m: 5, height: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography variant={'h5'} sx={{ mb: 1, justifyContent: 'center' }}>Modification du participant</Typography>
                    </Box>

                    <Box sx={{ justifyContent: 'left', textAlign: 'left', mb: 2 }}>
                        <InputLabel htmlFor="firstname" sx={{ marginBottom: 1 }}>Prénom</InputLabel>
                        <TextField id="firstname"
                            placeholder="Prénom"
                            variant="outlined"
                            value={participant?.firstname || ''}
                            onChange={handleChange}
                            fullWidth
                            autoComplete="firstname"
                            name="firstname"
                            error={!!errors.firstname}
                            helperText={errors.firstname}
                        />
                    </Box>
                    <Box sx={{ justifyContent: 'left', textAlign: 'left', mb: 2 }}>
                        <InputLabel htmlFor="lastname" sx={{ marginBottom: 1 }}>Nom</InputLabel>
                        <TextField id="lastname"
                            placeholder="Nom"
                            variant="outlined"
                            value={participant?.lastname || ''}
                            onChange={handleChange}
                            fullWidth
                            autoComplete="lastname"
                            name="lastname"
                            error={!!errors.lastname}
                            helperText={errors.lastname}
                        />
                    </Box>
                    <Box sx={{ justifyContent: 'left', textAlign: 'left', mb: 2 }}>
                        <InputLabel htmlFor="email" sx={{ marginBottom: 1 }}>Email</InputLabel>
                        <TextField id="email"
                            placeholder="Email"
                            variant="outlined"
                            value={participant?.email || ''}
                            onChange={handleChange}
                            fullWidth
                            autoComplete="new-password"
                            name="email"
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                    </Box>
                    <Box sx={{ justifyContent: 'left', textAlign: 'left', mb: 2 }}>
                        <InputLabel htmlFor="dateOfbBirth" sx={{ marginBottom: 1 }}>Date de naissance</InputLabel>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                            <DatePicker
                                disableFuture
                                value={participant?.dateOfBirth ? dayjs(participant.dateOfBirth) : null}
                                onChange={(newValue) => handleChange({ target: { name: "dateOfBirth", value: newValue ? new Date(newValue?.toDate()) : null } })}
                                name="dateOfBirth"
                                autoComplete="dateOfBirth"
                                sx={{ width: '100%' }}
                            />
                        </LocalizationProvider>
                    </Box>
                    <Box sx={{ justifyContent: 'left', textAlign: 'left', mb: 2 }}>
                        <InputLabel htmlFor="licence" sx={{ marginBottom: 1 }}>Licence</InputLabel>
                        <TextField id="licence"
                            placeholder="Licence"
                            variant="outlined"
                            value={participant?.licenceID || ''}
                            onChange={handleChange}
                            fullWidth
                            name="licenceID"
                        />
                    </Box>
                    {(sport === "Boxe" || sport === "Judo") &&
                        <Box sx={{ justifyContent: 'left', textAlign: 'left', mb: 2 }}>
                            <InputLabel htmlFor="weight" sx={{ marginBottom: 1 }}>Poids</InputLabel>
                            <TextField id="weight"
                                placeholder="Poids (kg)"
                                variant="outlined"
                                value={participant?.weight || ''}
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
                        </Box>}
                    {(sport?.sport === 'Tennis de table') &&
                        <Box sx={{ justifyContent: 'left', textAlign: 'left', mb: 2 }}>
                            <InputLabel htmlFor="classementTT" sx={{ marginBottom: 1 }}>Classement</InputLabel>
                            <TextField id="classement"
                                placeholder="Classement"
                                variant="outlined"
                                value={participant?.classementTT || ''}
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
                    {(sport?.sport === 'Tennis') &&
                        <Box sx={{ justifyContent: 'left', textAlign: 'left', mb: 2 }}>
                            <InputLabel htmlFor="classementTennis" sx={{ marginBottom: 1 }}>Classement</InputLabel>
                            <Autocomplete
                                iid="classementTennis"
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
                                value={classementTennis.find(option => option.type === participant?.classementTennis) || null}
                                onChange={(e, newValue) => handleChange({ target: { name: "classementTennis", value: newValue ? newValue.type : null } })}
                                isOptionEqualToValue={(option, value) => option.type === value.type}
                            />
                        </Box>

                    }
                    {(sport?.sport === 'Escrime') &&
                        <Box sx={{ justifyContent: 'left', textAlign: 'left', mb: 2 }}>
                            <InputLabel htmlFor="armeVoeu1" sx={{ marginBottom: 1 }}>Voeu 1</InputLabel>
                            <Autocomplete
                                iid="armeVoeu1"
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
                                value={armevoeux.find(option => option.type === participant?.armeVoeu1) || null}
                                onChange={(e, newValue) => handleChange({ target: { name: "armeVoeu1", value: newValue ? newValue.type : null } })}
                                isOptionEqualToValue={(option, value) => option.type === value.type}
                            />
                            <InputLabel htmlFor="armeVoeu2" sx={{ marginBottom: 1 }}>Voeu 2</InputLabel>
                            <Autocomplete
                                iid="armeVoeu2"
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
                                value={armevoeux.find(option => option.type === participant?.armeVoeu2) || null}
                                onChange={(e, newValue) => handleChange({ target: { name: "armeVoeu2", value: newValue ? newValue.type : null } })}
                                isOptionEqualToValue={(option, value) => option.type === value.type}
                            />
                            <InputLabel htmlFor="armeVoeu3" sx={{ marginBottom: 1 }}>Voeu 3</InputLabel>
                            <Autocomplete
                                iid="armeVoeu3"
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
                                value={armevoeux.find(option => option.type === participant?.armeVoeu3) || null}
                                onChange={(e, newValue) => handleChange({ target: { name: "armeVoeu3", value: newValue ? newValue.type : null } })}
                                isOptionEqualToValue={(option, value) => option.type === value.type}
                            />
                        </Box>
                    }
                    <Box sx={{ justifyContent: 'left', textAlign: 'left', mb: 2 }}>
                        <InputLabel htmlFor="gender" sx={{ marginBottom: 1 }}>Genre</InputLabel>
                        <Autocomplete
                            iid="gender"
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
                                    error={!!errors.gender}
                                    helperText={errors.gender}
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
                            value={gender.find(option => option.type === participant?.gender) || null}
                            onChange={(e, newValue) => handleChange({ target: { name: "gender", value: newValue ? newValue.type : null } })}
                            isOptionEqualToValue={(option, value) => option.type === value.type}
                        />
                    </Box>
                    <Box sx={{ justifyContent: 'left', textAlign: 'left', mb: 2 }}>
                        <InputLabel htmlFor="pack" sx={{ marginBottom: 1 }}>Pack</InputLabel>
                        <Autocomplete
                            iid="pack"
                            variant="outlined"
                            fullWidth
                            options={packs}
                            getOptionLabel={(option) => option.name}
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
                                    error={!!errors.packId}
                                    helperText={errors.packId}
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
                            value={packs.find(option => option.id === participant?.packId) || null}
                            onChange={(e, newValue) => handleChange({ target: { name: "packId", value: newValue ? newValue.id : null } })}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                        />
                    </Box>
                    <Box sx={{ justifyContent: 'left', textAlign: 'left', mb: 2 }}>
                        <InputLabel htmlFor="medicalCertificate" sx={{ marginBottom: 1 }}>Certificat médical</InputLabel>
                        <TextField id="medicalCertificate"
                            placeholder="Lien vers le certificat médical"
                            variant="outlined"
                            type='file'
                            onChange={handleFileChange}
                            fullWidth
                            autoComplete="medicalCertificate"
                            name="medicalCertificate"
                            inputProps={{ accept: "application/pdf, image/png, image/jpg, image/jpeg", multiple: false }}
                        />
                    </Box>
                    {(participant?.packId === 5 || participant?.packId === 6 || participant?.packId === 11 || participant?.packId === 12) &&
                        <Box sx={{ justifyContent: 'left', textAlign: 'left', mb: 2 }}>
                            <InputLabel htmlFor="mailHebergeur" sx={{ marginBottom: 1 }}>Email hebergeur</InputLabel>
                            <TextField id="mailHebergeur"
                                placeholder="Email hebergeur"
                                variant="outlined"
                                value={participant?.mailHebergeur || ''}
                                onChange={handleChange}
                                fullWidth
                                name="mailHebergeur"
                                error={!!errors.mailHebergeur}
                                helperText={errors.mailHebergeur}
                            />
                        </Box>
                    }
                    <Divider sx={{ mb: 1 }} />
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
                                checked={participant?.isVegan}
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
                                checked={participant?.hasAllergies}
                                onChange={(e, checked) => handleChange({ target: { name: "hasAllergies", value: checked } })}
                            />
                            <Typography sx={{ ml: 2 }}>Allergie arachides/ fruits à coque</Typography>
                        </Box>
                    </Box>
                    <Divider sx={{ mb: 1, mt: 1 }} />
                    <Typography variant="h6" sx={{ mb: 1 }}>Goodies</Typography>
                    {goodies.map((goodie) => (
                        <Box key={goodie.id} sx={{ display: 'flex', alignItems: 'center', mb: 0.5, ml: 1 }}>
                            <Checkbox
                                sx={{
                                    color: "primary.main",
                                    '&.Mui-checked': {
                                        color: "primary.main",
                                    },
                                }}
                                checked={participant?.productsIds?.includes(goodie.id)}
                                onChange={(e, checked) => handleCheckboxChange(goodie.id, checked)}
                            />
                            <Typography sx={{ ml: 2 }}>{goodie.name}</Typography>
                        </Box>
                    ))}
                    <Button variant="contained" sx={{ mt: 2 }} fullWidth onClick={onSubmit}>Enregistrer</Button>
                    {deleteEnabled &&
                        <Button variant="contained" sx={{ mt: 2 }} fullWidth onClick={() => setDialogOpen(true)}>Supprimer le joueur</Button>
                    }
                </Box>
            </Box>
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>Confirmer la suppression du joueur ?</DialogTitle>
                <DialogActions>
                    <Button onClick={handleDelete}>Oui</Button>
                    <Button onClick={() => setDialogOpen(false)}>Non</Button>
                </DialogActions>
            </Dialog>
        </Drawer>
    );
};

ModifyParticipant.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    goodies: PropTypes.array.isRequired,
    packs: PropTypes.array.isRequired,
    participant: PropTypes.object,
    errors: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleCheckboxChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    deleteEnabled: PropTypes.bool.isRequired,
    teamId: PropTypes.string.isRequired,
    sport: PropTypes.string
};

export default ModifyParticipant;