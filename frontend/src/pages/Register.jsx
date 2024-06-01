import { Autocomplete, Box, Button, Checkbox, Divider, Grid, InputLabel, Link, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import LayoutUnauthenticated from "../components/layouts/LayoutUnauthenticated";
import PasswordInput from "../components/PasswordInput";
import { useSnackbar } from "../provider/snackbarProvider";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as yup from 'yup';
import { ApiTossNotConnected } from "../service/axios";
import axios from "axios";

const Register = () => {
    const isDarkMode = true;

    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        firstname: '',
        email: '',
        school: null,
        tel: '',
        password: '',
        confirmPassword: '',
        checkbox: false,
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validationSchema = yup.object().shape({
        name: yup.string().required('Le nom est obligatoire').matches(/^[a-zA-ZÀ-ÿ ]*$/, 'Le nom ne doit pas contenir de chiffres'),
        firstname: yup.string().required('Le prénom est obligatoire').matches(/^[a-zA-ZÀ-ÿ ]*$/, 'Le prénom ne doit pas contenir de chiffres'),
        email: yup.string().required('L\'email est obligatoire').email('L\'email n\'est pas valide'),
        tel: yup.string().required('Le numéro de téléphone est obligatoire')
            .matches(/^\+?\d+$/, "Le numéro de téléphone doit être numérique")
            .min(10, 'Le numéro de téléphone doit contenir au moins 10 chiffres'),
        password: yup.string().required('Le mot de passe est obligatoire').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Le mot de passe doit contenir minimum 8 caractères, 1 chiffre, 1 majuscule et 1 caractère spécial : @$!%*?&'),
        confirmPassword: yup.string().required('Le mot de passe est obligatoire').oneOf([yup.ref('password'), null], 'Les mots de passe doivent correspondre'),
        checkbox: yup.bool().oneOf([true], 'Vous devez accepter les conditions générales'),
        school: yup.object().required('L\'école est obligatoire'),
    });

    const handleChange = (e, newInput) => {
        const { name, value, checked, type } = e.target;
        if (newInput != undefined && type != 'checkbox') {
            setFormData({
                ...formData,
                school: newInput,
            });
        } else {
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await validationSchema.validate(formData, { abortEarly: false });
            setErrors({});

            const userData = {
                lastname: formData.name,
                firstname: formData.firstname,
                email: formData.email,
                schoolId: formData.school.id,
                mobile: formData.tel,
                password: formData.password,
            };

            ApiTossNotConnected.post('/signup/', userData, { headers: { 'Content-Type': 'application/json' } }).then(() => {
                showSnackbar('Inscription réussie, veuillez vous connecter', 3000, 'success',);
                navigate('/');
            }).catch((error) => {
                console.log('Error', error);
                if (error.response.data.detail === "User with this email already exists") {
                    showSnackbar('Un compte avec cet email existe déjà', 2000, 'error');
                } else {
                    showSnackbar('Erreur lors de l\'inscription', 1500, 'error');
                }
                setIsSubmitting(false);
            });
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                const newErrors = {};
                err.inner.forEach((error) => {
                    newErrors[error.path] = error.message;
                });
                setErrors(newErrors);
            }
            setIsSubmitting(false);
        }
    }

    const [schools, setSchools] = useState([]);
    const fetchData = () => {
        const endpoints = [
            'schools',
        ]
        axios.all(endpoints.map(url => ApiTossNotConnected.get(url)))
            .then(axios.spread((...responses) => {
                setSchools(responses[0].data);
            })).catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <LayoutUnauthenticated isDarkMode={isDarkMode}>
            <Box display={'flex'} flexDirection={'column'} height={'100vh'} >
                <Grid container spacing={2} height={'102vh'}>
                    <Grid item xs={12} md={5}
                        sx={{
                            backgroundImage: 'url(/images/cup.jpg)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                    </Grid>
                    <Grid item xs={12} md={7} >
                        <Grid py={'10vh'} px={'13%'} sx={{}}>
                            <Typography sx={{
                                fontSize: '3rem',
                                fontWeight: 'bold',
                                mb: 1.5,
                                letterSpacing: '0.001rem',
                                color: '#000'
                            }}>
                                <span style={{ textDecoration: 'underline', textDecorationColor: '#961D90', textUnderlineOffset: '0.7rem', textDecorationThickness: '4px', }}>Inscr</span>iption au <span style={{ color: "#961D90" }}>TOSS {import.meta.env.VITE_TOSS_YEAR}</span>
                            </Typography>

                            <form >
                                <Grid container columnSpacing={6}>
                                    <Grid item xs={12} md={6}>
                                        <InputLabel htmlFor="name" sx={{ marginBottom: 1, color: '#000' }}>Nom</InputLabel>
                                        <TextField id="name"
                                            placeholder="Doe"
                                            variant="outlined"
                                            fullWidth
                                            value={formData.name}
                                            name="name"
                                            error={!!errors.name}
                                            helperText={errors.name}
                                            onChange={handleChange}
                                            InputProps={{
                                                style: { color: '#000' }
                                            }}
                                            InputLabelProps={{
                                                style: { color: '#000' }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <InputLabel htmlFor="firstname" sx={{ marginBottom: 1, color: '#000' }}>Prénom</InputLabel>
                                        <TextField id="firstname"
                                            placeholder="John"
                                            variant="outlined"
                                            fullWidth
                                            value={formData.firstname}
                                            name="firstname"
                                            error={!!errors.firstname}
                                            helperText={errors.firstname}
                                            onChange={handleChange}
                                            InputProps={{
                                                style: { color: '#000' }
                                            }}
                                            InputLabelProps={{
                                                style: { color: '#000' }
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid mt={errors.name || errors.firstname ? 0 : 2} mb={errors.school ? 0 : 2}>
                                    <InputLabel htmlFor="school" sx={{ marginBottom: 1, color: '#000' }}>Ecole</InputLabel>
                                    <Autocomplete id="school"
                                        variant="outlined"
                                        fullWidth
                                        options={schools}
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) =>
                                            <TextField {...params}
                                                placeholder="Rechercher votre école"
                                                InputLabelProps={{ shrink: true, style: { color: '#000' } }}
                                                inputProps={{
                                                    ...params.inputProps,
                                                    style: {
                                                        paddingTop: 0,
                                                        color: '#000'
                                                    },
                                                }}
                                                error={!!errors.school}
                                                helperText={errors.school}
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
                                        value={formData.school}
                                        onChange={handleChange}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                    />
                                </Grid>
                                <Grid container columnSpacing={6}>
                                    <Grid item xs={12} md={6}>
                                        <InputLabel htmlFor="email" sx={{ marginBottom: 1, color: '#000' }}>Email</InputLabel>
                                        <TextField id="email"
                                            placeholder="Doe"
                                            variant="outlined"
                                            fullWidth
                                            value={formData.email}
                                            name="email"
                                            error={!!errors.email}
                                            helperText={errors.email}
                                            onChange={handleChange}
                                            autoComplete="email"
                                            InputProps={{
                                                style: { color: '#000' }
                                            }}
                                            InputLabelProps={{
                                                style: { color: '#000' }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <InputLabel htmlFor="tel" sx={{ marginBottom: 1, color: '#000' }}>Téléphone</InputLabel>
                                        <TextField id="tel"
                                            placeholder="06 .. .. .. .."
                                            variant="outlined"
                                            fullWidth
                                            value={formData.tel}
                                            name="tel"
                                            error={!!errors.tel}
                                            helperText={errors.tel}
                                            onChange={handleChange}
                                            InputProps={{
                                                style: { color: '#000' }
                                            }}
                                            InputLabelProps={{
                                                style: { color: '#000' }
                                            }}
                                        />
                                    </Grid>
                                </Grid>

                                <Divider variant="lighter" sx={{ mb: 3, mt: errors.tel || errors.email ? 1 : 3 }} />

                                <Grid container columnSpacing={6}>
                                    <Grid item xs={12} md={6}>
                                        <InputLabel htmlFor="password" sx={{ marginBottom: 1, color: '#000' }}>Mot de passe</InputLabel>
                                        <PasswordInput id="password"
                                            variant="outlined"
                                            fullWidth
                                            password={formData.password}
                                            name="password"
                                            error={!!errors.password}
                                            helperText={errors.password}
                                            handlePassword={handleChange}
                                            autoComplete="new-password"
                                            InputProps={{
                                                style: { color: '#000' }
                                            }}
                                            InputLabelProps={{
                                                style: { color: '#000' }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <InputLabel htmlFor="confirm-password" sx={{ marginBottom: 1, color: '#000' }}>Confirmer le mot de passe</InputLabel>
                                        <PasswordInput id="confirm-password"
                                            variant="outlined"
                                            fullWidth
                                            password={formData.confirmPassword}
                                            name="confirmPassword"
                                            error={!!errors.confirmPassword}
                                            helperText={errors.confirmPassword}
                                            handlePassword={handleChange}
                                            autoComplete="new-password"
                                            InputProps={{
                                                style: { color: '#000' }
                                            }}
                                            InputLabelProps={{
                                                style: { color: '#000' }
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Typography sx={{ marginY: 2, fontSize: '0.8rem', fontStyle: 'italic', fontWeight: 'bolder', textAlign: 'center', color: '#000' }} >
                                    Le mot de passe doit contenir minimum 8 caractères, 1 chiffre, 1 majuscule et 1 caractère spécial
                                </Typography>

                                <Divider variant="lighter" sx={{ marginY: 3, marginX: 20 }} />

                                <Grid container>
                                    <Grid item xs={1} md={1}>
                                        <Checkbox
                                            sx={{
                                                color: !errors.checkbox ? "#961D90" : 'red',
                                                '&.Mui-checked': {
                                                    color: "#961D90",
                                                },
                                            }}
                                            name="checkbox"
                                            checked={formData.checkbox}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={11} md={11}>
                                        <Typography sx={{ fontSize: '0.8rem', color: '#000' }}>
                                            Je certifie avoir lu et approuvé les{" "}
                                            <Link href="/CGI/CGI_indiv.pdf" target="_blank" style={{ fontWeight: "600", color: "#961D90", textDecorationColor: "#961D90" }}>
                                                Conditions Générales d&apos;Inscription{" "}
                                            </Link>{" "}
                                            ou les{" "}
                                            <Link href="/CGI/CGI_delegations.pdf" target="_blank" style={{ fontWeight: "600", color: "#961D90", textDecorationColor: "#961D90" }}>
                                                CGI Délégations
                                            </Link>{" "}
                                            si mon école est une délégation.
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Grid container columnSpacing={6} sx={{ mt: 3 }}>
                                    <Grid item xs={12} md={6}>
                                        <Button variant="yellow_lighter" onClick={() => navigate('/')} fullWidth sx={{ color: '#000' }}>Retour</Button>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Button variant="purple" type="submit" fullWidth
                                            disabled={isSubmitting}
                                            onClick={handleSubmit}
                                        >
                                            {isSubmitting ? 'Envoi en cours...' : 'S\'inscrire'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Grid>
                    </Grid>
                </Grid >
            </Box>
        </LayoutUnauthenticated >
    )
}

export default Register;
