import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { useState } from "react";
import { Box, Button, Grid, InputLabel, Link, TextField, Typography } from "@mui/material";
// eslint-disable-next-line no-unused-vars
import { validateEmail } from "../service/validation";
import { ApiTossNotConnected } from "../service/axios";
import { useSnackbar } from "../provider/snackbarProvider";
import DividerText from "../components/DividerText";
import LayoutAuthenticated from "../components/layouts/LayoutAuthenticated";

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
            <Grid container height={'102vh'}>
                <Grid item md={12} lg={6} sx={{ textAlign: 'center',alignSelf: 'center' }}>
                    <Grid py={'10vh'} px={'22%'} sx={{}}>
                        <Typography variant="h1" sx={{ fontSize: '7rem', fontWeight: 'bold', color: '#000' }}>Sixte</Typography>
                        <DividerText text="Connexion" sx={{ color: '#000' }} />
                        <Box m={'1vw'}>
                            <form onSubmit={handleLogin}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box sx={{ justifyContent: 'left', textAlign: 'left' }}>
                                        <InputLabel htmlFor="email" sx={{ marginBottom: 1, color: '#000' }}>Email</InputLabel>
                                        <TextField id="email"
                                            variant="outlined"
                                            value={email}
                                            onChange={handleChangeEmail}
                                            fullWidth
                                            autoComplete="email"
                                            error={!!emailError}
                                            helperText={emailError}
                                            sx={{ color: '#000', '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#093274' } } }}
                                            InputProps={{
                                                style: { color: '#000' }
                                            }}
                                            InputLabelProps={{
                                                style: { color: '#000' }
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ justifyContent: 'left', textAlign: 'left' }}>
                                        <InputLabel htmlFor="password" sx={{ marginBottom: 1, color: '#000' }} >Mot de passe</InputLabel>
                                        <TextField id="password"
                                            variant="outlined"
                                            type="password"
                                            value={password}
                                            onChange={handleChangePassword}
                                            fullWidth
                                            autoComplete="current-password"
                                            error={!!passwordError}
                                            helperText={passwordError}
                                            sx={{ color: '#000', '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#093274' } } }}
                                            InputProps={{
                                                style: { color: '#000' }
                                            }}
                                            InputLabelProps={{
                                                style: { color: '#000' }
                                            }}
                                        />
                                    </Box>
                                    <Link href="/forgot-password" underline="hover" sx={{ textAlign: 'left', color: '#093274' }}>Mot de passe oublié ?</Link>
                                    <Button type="submit" fullWidth sx={{ backgroundColor: '#093274', color: '#fff'}}>Se connecter</Button>
                                </Box>
                            </form>
                        </Box>
                        <DividerText text="Autres" sx={{ color: '#000' }} />
                        <Box m={2} >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                <Link href="/charte" sx={{ width: '100%', mr: 1 }}><Button fullWidth sx={{ backgroundColor: '#093274', color: '#fff'}}>Signer la charte</Button></Link>
                                <Link href="/register" sx={{ width: '100%', ml: 1 }}><Button fullWidth sx={{ backgroundColor: '#093274', color: '#fff'}}>Inscription</Button></Link>
                            </Box>
                            <Button href="/" variant="lighter" sx={{ mt: 2, width: '100%', backgroundColor: '#afc4e2', color: '#093274' }}>Retour au site</Button>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item md={0} lg={6}
                    sx={{
                        backgroundImage: 'url(/images/stade.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                </Grid>
            </Grid>
        </LayoutAuthenticated>
    );
};

export default Login;
