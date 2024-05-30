import { Autocomplete, Box, Button, Checkbox, Divider, Drawer, InputLabel, ListItem, ListItemText, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import gender from "../../assets/gender.json";
import classementTennis from "../../assets/classementTennis.json"
import armevoeux from "../../assets/armevoeux.json"
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { useState } from 'react';
import * as yup from 'yup';
import { useSnackbar } from '../../provider/snackbarProvider';
import { ApiTossConnected } from '../../service/axios';

const AddParticipant = ({ open, onClose, teamId }) => {

    const { showSnackbar } = useSnackbar();


    const initState = {
        email: null,
        lastname: null,
        firstname: null,
        dateOfBirth: null,
        gender: null,
        isCaptain: false,
        isBoursier : false,
    }
    const [participant, setParticipant] = useState(initState);
    const [errors, setErrors] = useState({});

    //** Validation de données */
    const playerSchema = yup.object().shape({
        email: yup.string().email('Email invalide').required('Email requis'),
        lastname: yup.string().required('Nom requis'),
        firstname: yup.string().required('Prénom requis'),
        dateOfBirth: yup.date().required('Date de naissance requise'),
        gender: yup.string().required('Genre requis'),
        isBoursier: yup.string().required('Obligatoire'),
        
    });

    // eslint-disable-next-line no-unused-vars
    const handleChange = (e, newInput) => {
        const { name, value } = e.target;
        // console.log("name ", name, " value ", value);
        setParticipant({ ...participant, [name]: value })
    }
    const handleCheckboxChange = (goodieId, checked) => {
        const updatedGoodies = checked
            ? [...participant.productsIds, goodieId]
            : participant?.productsIds?.filter(id => id !== goodieId);
        setParticipant({ ...participant, productsIds: updatedGoodies });
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            await playerSchema.validate(participant, { abortEarly: false });
            setErrors({});
            ApiTossConnected.post('teams/' + teamId + '/participants', [participant])
                .then(() => {
                    onClose();
                    setParticipant(initState);
                    showSnackbar('Ajout réussi', 2000, 'success');
                })
                .catch((err) => {
                    console.log(err);
                    showSnackbar('Une erreur est survenue', 3000, 'error');
                });
        }
        catch (err) {
            const newErrors = {};
            err.inner.forEach((error) => {
                newErrors[error.path] = error.message;
            });
            setErrors(newErrors);
        }
    }


    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
        >
            <Box sx={{ width: '45vw' }}>
                <Box sx={{ m: 5, height: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography variant={'h5'} sx={{ mb: 1, justifyContent: 'center' }}>Ajout d&apos;un participant</Typography>
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
                    
                    
                    <Divider sx={{ mb: 1 }} />
                    
                    <Divider sx={{ mb: 1, mt: 1 }} />
                    
                    <Button variant="contained" sx={{ mt: 2 }} fullWidth onClick={handleSubmit}>Enregistrer</Button>
                </Box>
            </Box>
        </Drawer>
    );
};

AddParticipant.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    teamId: PropTypes.string.isRequired
};

export default AddParticipant;