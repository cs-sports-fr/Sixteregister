import { Box, Tab, Tabs, Typography } from "@mui/material";
import Navbar from "../../components/navbar/Navbar";
import { routesForAdmin, routesForSuperAdmin } from "../../routes/routes";
import { useEffect, useState } from "react";
import TeamList from "../../components/team/TeamList";
import axios from "axios";
import { ApiTossConnected } from "../../service/axios";
import { useLocation, useNavigate } from "react-router-dom";
import { parseSportAdmin } from "../../utils/parseSport";
import { useAuth } from "../../provider/authProvider";


const AdminSportDetail = () => {

    const navigation = useNavigate()

    const sportId = useLocation().pathname.split('/').pop();

    const [tabValue, setTabValue] = useState(0);

    const [sport, setSport] = useState({});
    const fetchData = () => {
        const endpoints = [
            'sports/' + sportId,
        ]
        axios.all(endpoints.map(url => ApiTossConnected.get(url)))
            .then(axios.spread((...responses) => {
                setSport(parseSportAdmin(responses[0].data));
                setFilteredTeams(responses[0].data.teams.filter(team => team.status === 'Validated'));

            })).catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const [filteredTeams, setFilteredTeams] = useState([]);
    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
        setFilteredTeams(sport?.teams?.filter(team => team.status === event.target.id));
    }

    const waitingTeamsCount = sport?.teams?.filter(team => team.status === 'Waiting').length || 0;
    const principalTeamsCount = sport?.teams?.filter(team => team.status === 'PrincipalList').length || 0;
    const validatedTeamsCount = sport?.teams?.filter(team => team.status === 'Validated').length || 0;

    const { permission } = useAuth();
    const routes = permission === 'SuperAdminStatus' ? routesForSuperAdmin : routesForAdmin;

    return (
        <Box display={'flex'} flexDirection={'column'} height={'100vh'} sx={{ overflowX: 'hidden', bgcolor: 'background.drawer' }}>
            {/* // Navbar */}
            <Navbar navigation={routes} />

            <Box display={'flex'} justifyContent={'center'} >
                <Box sx={{ mt: 5, textAlign: 'center' }}>
                    <Typography variant={'h2'}>{sport.sport}</Typography>
                    <Typography variant={'h5'} color={'primary.main'} >{sport?.teams?.length || 0}/{sport.nbOfTeams}</Typography>
                </Box>
            </Box>

            <Box display={'flex'} justifyContent={'center'} mt={4}>
                <Tabs value={tabValue} onChange={handleChangeTab}
                    sx={{ bgcolor: 'background.default', borderRadius: '0.8rem' }}
                    centered
                >
                    <Tab label={`Validé (${validatedTeamsCount})`} id="Validated" />
                    <Tab label={`Principale (${principalTeamsCount})`} id="PrincipalList" />
                    <Tab label={`Attente (${waitingTeamsCount})`} id="Waiting" />
                </Tabs>
            </Box>

            <Box display={'flex'} justifyContent={'center'} mt={4} >
                <TeamList headerItem={headerItem} columns={columns} teams={filteredTeams} modify={true} onModify={(team) => { navigation("/team/" + team.id) }} />
            </Box>

        </Box>
    );
}

export default AdminSportDetail;

const headerItem =
    <Typography>Liste des équipes</Typography>

const columns = [
    { label: "N°", align: "left", key: "id", type: 'index' },
    { label: "Nom", align: "center", key: "name" },
    { label: "Ecole", align: "center", key: "schoolName" },
    { label: "Nombre de joueurs", align: "center", key: "len" },
    { label: "Status", align: "center", key: "status", type: "status" },
    { label: "Prix total", align: "center", key: "amountToPayInCents" },
    { label: "Prix payé", align: "center", key: "amountPaidInCents" }
]