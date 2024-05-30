import { Autocomplete, Box, Button, Checkbox, Dialog, DialogActions, DialogTitle, Divider, Drawer, InputLabel, ListItem, ListItemText, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import gender from "../../assets/gender.json";
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { ApiTossConnected } from '../../service/axios';
import { useSnackbar } from '../../provider/snackbarProvider';
import { useState } from 'react';

const ModifyParticipant = ({ open, onClose, participant, errors, handleChange, handleCheckboxChange, handleSubmit, deleteEnabled, teamId, sport }) => {

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
                    
                    
                    
                    
                    
                    <Divider sx={{ mb: 1, mt: 1 }} />
                    
                    
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