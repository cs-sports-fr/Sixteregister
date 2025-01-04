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

const RegistrationClosed = () => {
    
    const isDarkMode = false;

    return (
        <LayoutAuthenticated isDarkMode={isDarkMode}>
            <Grid container spacing={2} height={'102vh'}>
                <Grid item md={6} xs={12}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }} > 
                    <Typography variant="h3" sx={{color:'primary.main'}}>Inscriptions fermées ! <br/> Les inscriptions ouvrent le 15 janvier ! </Typography>
                    <Box>
                    <Button href="/" variant="lighter" sx={{ mt: 2, width: '100%', backgroundColor: '#afc4e2', color: '#093274' }}>Retour au site</Button>

                    </Box>

                </Grid>
                <Grid item md={6} xs={12}
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

export default RegistrationClosed;
