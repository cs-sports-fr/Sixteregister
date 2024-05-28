import { Typography, Button, Box } from "@mui/material";
import PropTypes from 'prop-types';
import TeamList from "../team/TeamList";
import { useNavigate } from "react-router-dom";

function EquipesInscritesPage({ height, teams }) {

    const navigation = useNavigate();

    const headerItem =
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typography variant="h5">
                Mes équipes inscrites
            </Typography>
            <Button variant="contained" sx={{ maxWidth: '20%' }} href="/register-team">
                Inscrire une équipe
            </Button>
        </Box>


    return (
        <TeamList headerItem={headerItem} columns={columns}
            teams={teams}
            onModify={(team) => navigation('/team/' + team.id)}
            modify={true} sx={{ borderRadius: '0.8rem', height: height, p: '16px' }} variant="outlined" />
    );
}

EquipesInscritesPage.propTypes = {
    height: PropTypes.string,
    teams: PropTypes.array.isRequired
};

export default EquipesInscritesPage;

const columns = [
    { label: "N°", align: "left", key: "id", type: 'index' },
    { label: "Nom", align: "center", key: "name" },
    { label: "Sport", align: "center", key: "sport" },
    { label: "Nombre de joueurs", align: "center", key: "len" },
    { label: "Status", align: "center", key: "status", type: "status" },
    { label: "Prix total", align: "center", key: "price" },
]