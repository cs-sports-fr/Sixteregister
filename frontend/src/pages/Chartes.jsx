import { Box, Button, Grid, InputLabel, TextField, Typography } from "@mui/material";
import DividerText from "../components/DividerText";
import { useState } from "react";
import { useSnackbar } from "../provider/snackbarProvider";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../service/validation";
import { ApiTossNotConnected } from "../service/axios";
import LayoutAuthenticated from "../components/layouts/LayoutAuthenticated";


function Chartes() {
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const isDarkMode = true;


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

    const handleSign = () => {
        event.preventDefault();
        if (!validateEmail(email)) {
            setEmailError("Veuillez entrer une adresse e-mail valide.");
            showSnackbar("Veuillez entrer une adresse e-mail valide.", 3000, "error")
        } else if (password == "") {
            setPasswordError("Veuillez entrer un mot de passe valide.")
            showSnackbar("Veuillez entrer une mot de passe valide.", 3000, "error")
        } else {
            setEmailError("");
            setPasswordError("")
            ApiTossNotConnected.post('/teams/participant/sign-charte?email=' + email + '&charte_password=' + password)
                .then(() => {
                    showSnackbar("Charte validée.", 3000, "success")
                    navigate("/");
                }).catch((e) => {
                    console.log(e);
                    if (e.response.status === 403) {
                        showSnackbar("Mot de passe incorrect.", 3000, "error")
                    } else if (e.response.status === 404) {
                        showSnackbar("Email incorrect.", 3000, "error")
                    } else {
                        showSnackbar("Une erreur est survenue", 3000, "error")
                    }
                });
        }
    };

    const handleReadCharte = () => {
        window.open('./Charte/Charte.pdf', '_blank');
    }

    return (
        <LayoutAuthenticated isDarkMode={isDarkMode}>
            <Grid container spacing={2} height={'102vh'}>
                <Grid item md={6} xs={12} sx={{ textAlign: 'center', alignSelf: "center" }}>
                    <Grid py={'10vh'} px={'25%'} sx={{}}>
                        <Typography sx={{ fontSize: '2rem', fontWeight: 'bold', mb: 1.5, letterSpacing: '0.001rem' }}>CHARTE INDIVIDUELLE DU SIXTE</Typography>
                        <Box m={'1vw'}><Button fullWidth sx={{ backgroundColor: '#093274', color: '#fff', '&:hover': { backgroundColor: '#91A2FF' } }} onClick={handleReadCharte}>Lire la charte</Button></Box>
                        <DividerText text="Valider la charte" />
                        <Box m={'1vw'}>
                            <form onSubmit={handleSign}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box sx={{ justifyContent: 'left', textAlign: 'left' }}>
                                        <InputLabel htmlFor="email" sx={{ marginBottom: 1 }}>Email</InputLabel>
                                        <TextField id="email"
                                            placeholder="sixte@cs-sports.fr"
                                            variant="outlined"
                                            value={email}
                                            onChange={handleChangeEmail}
                                            fullWidth
                                            autoComplete="email"
                                            error={!!emailError}
                                            helperText={emailError}
                                        />
                                    </Box>
                                    <Box sx={{ justifyContent: 'left', textAlign: 'left', mb: 0.5 }}>
                                        <InputLabel htmlFor="password" sx={{ marginBottom: 1 }} >Mot de passe charte</InputLabel>
                                        <TextField id="passwordCharte"
                                            variant="outlined"
                                            value={password}
                                            onChange={handleChangePassword}
                                            fullWidth
                                            placeholder="ksSD82Fs"
                                            error={!!passwordError}
                                            helperText={passwordError}
                                        />
                                    </Box>
                                    <Button type="submit" fullWidth sx={{ backgroundColor: '#093274', color: '#fff', '&:hover': { backgroundColor: '#91A2FF' } }}>Valider la charte</Button>
                                    <Button href="/" variant="lighter" fullWidth sx={{ mt: 2, width: '100%', backgroundColor: '#afc4e2', color: '#093274', '&:hover': { backgroundColor: '#91A2FF' } }}>Retour</Button>

                                </Box>
                            </form>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item md={6} xs={12}
                    sx={{
                        backgroundImage: 'url(/images/photocharte.jpg)', // Remplacez chemin/vers/votre/image.jpg par le chemin réel de votre image
                        backgroundSize: 'cover', // Couvre toute la zone disponible sans perdre les proportions de l'image
                        backgroundPosition: 'center', // Centre l'image dans la zone disponible
                        display: 'flex',
                        flexDirection: 'column', // Organise les enfants en colonne
                        justifyContent: 'center', // Centre verticalement
                        alignItems: 'center', // Centre horizontalement
                    }}
                >
                    <Typography variant="login" sx={{ fontSize: '6rem', textAlign: 'center' }}>ESPACE PARTICIPANT</Typography>
                    {/* <Box sx={{ mt: 'auto', display: 'block' }}>
                        <Typography variant="body1">&ldquo;On peut mettre une quote ici si jamais.&rdquo;</Typography>
                        <Typography variant="caption">Sofia Davis</Typography>
                    </Box> */}
                </Grid>
            </Grid>
        </LayoutAuthenticated>
    );
}

export default Chartes;
