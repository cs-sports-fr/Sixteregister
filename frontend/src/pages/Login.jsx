import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { useState } from "react";
import { Box, Button, Grid, InputLabel, Link, TextField, Typography, Divider } from "@mui/material";
// eslint-disable-next-line no-unused-vars
import { validateEmail } from "../service/validation";
import { ApiTossNotConnected } from "../service/axios";
import { useSnackbar } from "../provider/snackbarProvider";
import LayoutAuthenticated from "../components/layouts/LayoutAuthenticated";
import palette from "../themes/palette";

const Login = () => {
    const { setToken } = useAuth();
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleChangeEmail = (text) => {
        setEmail(text.target.value);
    }

    const handleChangePassword = (text) => {
        setPassword(text.target.value);
    };

    const handleLogin = (event) => {
        event.preventDefault();
        if (!validateEmail(email)) {
            setEmailError("Veuillez entrer une adresse e-mail valide.");
            showSnackbar("Veuillez entrer une adresse e-mail valide.", 3000, "error")
        } else if (password === "") {
            setPasswordError("Veuillez entrer un mot de passe valide.")
            showSnackbar("Veuillez entrer un mot de passe valide.", 3000, "error")
        } else {
            setEmailError("");
            setPasswordError("");
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);
            ApiTossNotConnected.post("/login", formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then((response) => {
                    setToken(response.data.access_token);
                    showSnackbar("Connexion réussie.", 3000, "success")
                    navigate("/");
                })
                .catch((e) => {
                    console.log(e);
                    showSnackbar("Identifiants incorrects.", 3000, "error")
                });
        }
    };

    const isDarkMode = false;

    return (
        <LayoutAuthenticated isDarkMode={isDarkMode}>
            <Box sx={{ backgroundColor: 'white', minHeight: '100vh' }}>
                <Grid container spacing={0} sx={{ minHeight: '100vh' }}>
                    <Grid item xs={12} lg={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
                        <Box py={'5vh'} px={{ xs: '8%', md: '15%' }} sx={{ width: '100%', maxWidth: '600px' }}>
                            <Typography sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 'bold', mb: 1.5, color: palette.primary.dark, textAlign: 'center' }}>
                                <span style={{ textDecoration: 'underline', textDecorationColor: palette.primary.red, textUnderlineOffset: '0.7rem', textDecorationThickness: '4px' }}>Conn</span>exion
                            </Typography>
                            <Box mt={3}>
                                <form onSubmit={handleLogin}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                        <Box>
                                            <InputLabel htmlFor="email" sx={{ marginBottom: 1, color: palette.primary.dark }}>Email</InputLabel>
                                            <TextField id="email"
                                                variant="outlined"
                                                value={email}
                                                onChange={handleChangeEmail}
                                                fullWidth
                                                autoComplete="email"
                                                error={!!emailError}
                                                helperText={emailError}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '&:hover fieldset': {
                                                            borderColor: palette.primary.red,
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: palette.primary.red,
                                                        },
                                                    },
                                                }}
                                                InputProps={{
                                                    style: { color: palette.primary.dark }
                                                }}
                                            />
                                        </Box>
                                        <Box>
                                            <InputLabel htmlFor="password" sx={{ marginBottom: 1, color: palette.primary.dark }}>Mot de passe</InputLabel>
                                            <TextField id="password"
                                                variant="outlined"
                                                type="password"
                                                value={password}
                                                onChange={handleChangePassword}
                                                fullWidth
                                                autoComplete="current-password"
                                                error={!!passwordError}
                                                helperText={passwordError}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '&:hover fieldset': {
                                                            borderColor: palette.primary.red,
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: palette.primary.red,
                                                        },
                                                    },
                                                }}
                                                InputProps={{
                                                    style: { color: palette.primary.dark }
                                                }}
                                            />
                                        </Box>
                                        <Link href="/forgot-password" underline="hover" sx={{ textAlign: 'left', color: palette.primary.red, fontWeight: '500' }}>Mot de passe oublié ?</Link>
                                        <Button 
                                            type="submit" 
                                            fullWidth 
                                            sx={{ 
                                                backgroundColor: palette.primary.red,
                                                color: '#fff',
                                                padding: '0.8rem',
                                                fontWeight: 'bold',
                                                fontSize: '1rem',
                                                textTransform: 'uppercase',
                                                borderRadius: '8px',
                                                '&:hover': {
                                                    backgroundColor: '#e55a5a',
                                                }
                                            }}
                                        >
                                            Se connecter
                                        </Button>
                                    </Box>
                                </form>
                            </Box>
                            <Divider sx={{ my: 4 }} />
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                    <Button 
                                        href="/register" 
                                        fullWidth
                                        variant="outlined"
                                        sx={{ 
                                            borderColor: palette.primary.red,
                                            color: palette.primary.red,
                                            '&:hover': {
                                                borderColor: palette.primary.red,
                                                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                                            }
                                        }}
                                    >
                                        Inscription
                                    </Button>
                                </Box>
                                <Button 
                                    href="/" 
                                    fullWidth
                                    sx={{ 
                                        backgroundColor: palette.primary.dark,
                                        color: '#fff',
                                        '&:hover': {
                                            backgroundColor: '#062a4d',
                                        }
                                    }}
                                >
                                    Retour au site
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={0} lg={6}
                        sx={{
                            backgroundImage: 'url(/images/stade.jpg)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            display: { xs: 'none', lg: 'flex' },
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                    </Grid>
                </Grid>
            </Box>
        </LayoutAuthenticated>
    );
};

export default Login;
