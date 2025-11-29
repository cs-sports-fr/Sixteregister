import { Autocomplete, Box, Button, Checkbox, Divider, Grid, InputLabel, Link, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import LayoutAuthenticated from "../components/layouts/LayoutAuthenticated";
import PasswordInput from "../components/PasswordInput";
import { useSnackbar } from "../provider/snackbarProvider";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as yup from 'yup';
import { ApiTossNotConnected } from "../service/axios";
import axios from "axios";
import palette from "../themes/palette";

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
        <LayoutAuthenticated isDarkMode={isDarkMode}>
            <Box display={'flex'} flexDirection={'column'} height={'100vh'} >
                <Grid container spacing={0} height={'102vh'}>
                    <Grid item md={0} lg={6}
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
                    <Grid item md={12} lg={6} sx={{ position: 'relative' }}>
                        <Grid py={'10vh'} px={'13%'} sx={{ 
                            filter: 'grayscale(100%) opacity(0.3)',
                            pointerEvents: 'none',
                            userSelect: 'none',
                        }}>
                            <Typography sx={{
                                fontSize: '3rem',
                                fontWeight: 'bold',
                                mb: 1.5,
                                letterSpacing: '0.001rem',
                                color: '#000'
                            }}>
                                <span style={{ textDecoration: 'underline', textDecorationColor: '#093274', textUnderlineOffset: '0.7rem', textDecorationThickness: '4px', }}>Inscr</span>iption au <span style={{ color: "#093274" }}>SIXTE {import.meta.env.VITE_TOSS_YEAR}</span>
                            </Typography>

                            <form >
                                <Grid container columnSpacing={6}>
                                    <Grid item xs={12} md={6}>
                                        <InputLabel htmlFor="name" sx={{ marginBottom: 1, color: '#000' }}>Nom</InputLabel>
                                        <TextField id="name"
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
                                                InputLabelProps={{ shrink: true, style: { color: 'black' } }}
                                                inputProps={{
                                                    ...params.inputProps,
                                                    style: {
                                                        paddingTop: 0,
                                                        color: 'black'
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

                                <Grid container sx={{display:'flex',alignItems:'center'}}>
                                    <Grid item xs={1} md={1}>
                                        <Checkbox
                                            sx={{
                                                color: !errors.checkbox ? "#093274" : 'red',
                                                '&.Mui-checked': {
                                                    color: "#093274",
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
                                            <Link href="/CGI/CGI_indiv.pdf" target="_blank" style={{ fontWeight: "600", color: "#093274", textDecorationColor: "#093274" }}>
                                                Conditions Générales d&apos;Inscription{" "}
                                            </Link>{" "}
                                            
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Grid container columnSpacing={6} sx={{ mt: 3 }}>
                                    <Grid item xs={12} md={6}>
                                        <Button variant="lighter" sx={{ width: '100%', backgroundColor: '#afc4e2', color: '#093274' }} onClick={() => navigate('/')} fullWidth>Retour</Button>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Button sx={{ backgroundColor: '#093274', color: '#fff'}} type="submit" fullWidth
                                            disabled={isSubmitting}
                                            onClick={handleSubmit}
                                        >
                                            {isSubmitting ? 'Envoi en cours...' : 'S\'inscrire'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Grid>
                        
                        {/* Overlay Message */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                pointerEvents: 'none',
                                zIndex: 10,
                            }}
                        >
                            <Box
                                sx={{
                                    transform: 'rotate(-15deg)',
                                    backgroundColor: palette.primary.red,
                                    padding: { xs: '2rem 3rem', md: '3rem 5rem' },
                                    borderRadius: '25px',
                                    boxShadow: '0 20px 80px rgba(255, 107, 107, 0.6)',
                                    border: '4px solid white',
                                    textAlign: 'center',
                                    backdropFilter: 'blur(10px)',
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
                                        textTransform: 'uppercase',
                                        letterSpacing: '2px',
                                        marginBottom: '1rem',
                                        textShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                                    }}
                                >
                                    Inscriptions fermées
                                </Typography>
                                <Typography
                                    sx={{
                                        color: 'white',
                                        fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
                                        fontWeight: '500',
                                        marginBottom: '0.5rem',
                                    }}
                                >
                                    Ouverture le
                                </Typography>
                                <Typography
                                    sx={{
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem', lg: '3.5rem' },
                                        textShadow: '0 0 30px rgba(255, 255, 255, 0.8)',
                                        letterSpacing: '3px',
                                    }}
                                >
                                    15 DÉCEMBRE 2025
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid >
            </Box>
        </LayoutAuthenticated >
    )
}

export default Register;
