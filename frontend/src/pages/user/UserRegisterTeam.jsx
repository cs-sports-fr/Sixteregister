import { Box, Typography } from "@mui/material";
import Navbar from "../../components/navbar/Navbar";
import AdvancementBar from "../../components/register-team/AdvancementBar";
import SelectSport from "../../components/register-team/SelectSport";
import { routesForUser } from "../../routes/routes";
import { useEffect, useState } from "react";
import RegisterTeam from "../../components/register-team/RegisterTeam";
import { ApiTossConnected } from "../../service/axios";
import axios from "axios";


const UserRegisterTeam = () => {

    const [config, setConfig] = useState({
        isRegistrationOpen: false,
        isPaymentOpen: false,
        expectedRegistrationDate: null,
    });

    const [sports, setSports] = useState([]);

    const [sportId, setSportId] = useState(null); // sport choisit
    const [isSportCollective, setIsSportCollective] = useState(null); // type de sport [single, group]

    const fetchData = () => {
        const endpoints = [
            '/sports',
        ]
        axios.all(endpoints.map(url => ApiTossConnected.get(url)))
            .then(axios.spread((...responses) => {
                setSports(responses[0].data);

            })).catch((error) => {
                console.log(error);
            });
    }

    const fetchConfig = () => {
        ApiTossConnected.get('/config')
            .then((response) => {
                setConfig(response?.data);
            }).catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        fetchData();
        fetchConfig();
    }, []);

    const [countdown, setCountdown] = useState('');

    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date();
            const registrationDate = new Date(config?.expectedRegistrationDate);
            const difference = registrationDate - now;

            if (difference <= 0) {
                clearInterval(countdownInterval);
                fetchConfig();
                setCountdown('');
                return;
            }
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            setCountdown(`${days} jours ${hours} heures ${minutes} minutes ${seconds} secondes`);
        };
        const countdownInterval = setInterval(updateCountdown, 1000);
        return () => clearInterval(countdownInterval);
    }, [config?.expectedRegistrationDate]);

    return (
        <Box display={'flex'} flexDirection={'column'} height={'100vh'} sx={{ overflowX: 'hidden' }}>
            {/* // Navbar */}
            <Navbar navigation={routesForUser} />

            {/* // Barre d'avancement */}
            <AdvancementBar sportSelected={sportId} isCollective={isSportCollective} resetCallback={() => { setSportId(null); setIsSportCollective(null) }} />
            {/* // Page d'inscription d'une équipe */}
            <Box flexGrow={1} display={'flex'} >

                {config?.isRegistrationOpen ?

                    <>
                        {sportId == null && <SelectSport callback={(id) => setSportId(id)} sports={sports} callbackType={(bool) => setIsSportCollective(bool)} isCollective={isSportCollective} />}

                        {sportId !== null && <RegisterTeam sport={sportId} />}
                    </>
                    :
                    <Box sx={{ bgcolor: 'background.drawer', width: '100%', display: 'flex', justifyContent: 'center', textAlign: 'center', flexDirection: 'column' }}>
                        <Typography variant="h4" align="center"  >Les inscriptions sont fermées</Typography>
                        {/* Countdown before registration open */}
                        {config?.expectedRegistrationDate && <Typography variant="h6" align="center" >Ouverture des inscriptions le 15 janvier</Typography>}

                    </Box>
                }

            </Box>
        </Box>
    );
}

export default UserRegisterTeam;