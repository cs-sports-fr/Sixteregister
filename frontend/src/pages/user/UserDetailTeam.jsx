import { Box, Button, Typography } from "@mui/material";
import Navbar from "../../components/navbar/Navbar";
import { routesForUser } from "../../routes/routes";
import { useEffect, useState } from "react";
import axios from "axios";
import { ApiTossConnected } from "../../service/axios";
import * as yup from 'yup';
import { useSnackbar } from "../../provider/snackbarProvider";
import PlayerList from "../../components/team/ParticipantsList";
import ModifyParticipants from "../../components/team/ModifyParticipant";
import { useLocation } from "react-router-dom";
import { parseTeam } from "../../utils/parseTeam";
import AddParticipant from "../../components/team/AddParticipant";



const UserDetailTeam = () => {

    const [team, setTeam] = useState();
    const teamId = useLocation().pathname.split('/').pop();

    const { showSnackbar } = useSnackbar();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerOpenAdd, setDrawerOpenAdd] = useState(false);
    const [selectedParticipant, setSelectedParticipant] = useState(null);

    const handleModifyParticipant = (id) => {
        setSelectedParticipant(team.participants.find(participant => participant.id === id));
        setDrawerOpen(true);
    }
    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setErrors({})
    }

    const fetchData = () => {
        const endpoints = [
            'teams/' + teamId,
        ]
        axios.all(endpoints.map(url => ApiTossConnected.get(url)))
            .then(axios.spread((...responses) => {
                setTeam(parseTeam(responses[0].data));
            })).catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // eslint-disable-next-line no-unused-vars
    const handleChange = (e, newInput) => {
        const { name, value } = e.target;
        // console.log("name ", name, " value ", value);
        setSelectedParticipant({ ...selectedParticipant, [name]: value })
    }
    const handleCheckboxChange = (goodieId, checked) => {
        setSelectedParticipant({ ...selectedParticipant });
    };

    //** Validation de données */
    const playerSchema = yup.object().shape({
        email: yup.string().email('Email invalide').required('Email requis'),
        lastname: yup.string().required('Nom requis'),
        firstname: yup.string().required('Prénom requis'),
        dateOfBirth: yup.date().required('Date de naissance requise'),
        gender: yup.string().required('Genre requis'),
        isBoursier: yup.string().required('Obligatoire'),
        
    });

    const [errors, setErrors] = useState({});
    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            await playerSchema.validate(selectedParticipant, { abortEarly: false });
            setErrors({});
            ApiTossConnected.put('teams/' + teamId + '/participant/' + selectedParticipant.id, selectedParticipant)
                .then(() => {
                    handleCloseDrawer();
                    fetchData();
                    showSnackbar('Modification réussie', 3000, 'success');
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

    const PlayerListHeader =
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', my: 2.5 }}>
            <Box sx={{ width: '15%', mr: 2.5 }}>
                <Button disabled={true} /*{team?.participants?.length >= team?.sport?.nbPlayersMax}*/ onClick={() => setDrawerOpenAdd(true)}>Ajouter un joueur</Button>
            </Box>
        </Box>


    return (
        <Box display={'flex'} flexDirection={'column'} height={'100vh'} sx={{ overflowX: 'hidden', backgroundColor: 'background.drawer' }}>
            {/* // Navbar */}
            <Navbar navigation={routesForUser} />

            <Box >
                <Box sx={{ ml: 5, mt: 5 }}>
                    <Typography variant={'h4'} sx={{ mb: 1 }}>Détail de l&apos;équipe : {team?.name} ({team?.sport?.sport})</Typography>
                    <Typography variant={'h6'}>L&apos;équipe est actuellement {team?.status == "Validated" ? "validée" : team?.status == "PrincipalList" ? "en liste principale" : "en liste d'attente"}</Typography>
                </Box>
                <Box sx={{ m: 5 }}>
                    <PlayerList headerItem={PlayerListHeader} columns={columns} players={team?.participants} modify={false} onModify={handleModifyParticipant} teamId={teamId} resendCharterEmail={false} />
                </Box>
            </Box>

            <ModifyParticipants
                open={drawerOpen}
                onClose={handleCloseDrawer}
                participant={selectedParticipant}
                setSelectedParticipant={setSelectedParticipant}
                errors={errors}
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                handleCheckboxChange={handleCheckboxChange}
                deleteEnabled={team?.participants?.length > team?.sport?.nbPlayersMin && selectedParticipant?.isCaptain === false}
                teamId={teamId}
                sport={team?.sport?.sport}
            />

            <AddParticipant
                open={drawerOpenAdd}
                onClose={() => { setDrawerOpenAdd(false); fetchData(); }}
                teamId={teamId}
            />
        </Box>
    );
};

const columns = [
    { label: "N°", align: "left", name: "id", type: 'index' },
    { label: "Prénom", align: "center", name: "firstname" },
    { label: "NOM", align: "center", name: "lastname" },
    { label: "Email", align: "center", name: "email" },
    { label: "Genre", align: "center", name: "gender" },
    { label: "Capitaine", align: "center", name: "isCaptain", type: "boolean" },
    { label: "Date de naissance", align: "center", name: "dateOfBirth", type: "date" },
    { label: "Charte signée", align: "center", name: "charteIsValidated", type: "boolean" },
    { label: "Boursier", align: "center", name: "isBoursier", type: "boolean" },
    { label: "ValidateBoursier", align: "center", name: "ValidateBoursier", type: "boolean" },
]

export default UserDetailTeam;


