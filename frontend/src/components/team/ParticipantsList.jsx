import { Cancel, CheckCircle, Edit, MailOutline, Visibility } from '@mui/icons-material';
import { Box, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useSnackbar } from "../../provider/snackbarProvider";
import { ApiTossConnected } from "../../service/axios";


const ParticipantsList = ({ headerItem, columns, players, modify, onModify, teamId, resendCharterEmail }) => {

    const { showSnackbar } = useSnackbar();

    const handleResendCharterEmail = async (teamId, participantId) => {
        try {
            // Construct the URL for the resend charter email endpoint
            const url = `/teams/${teamId}/participant/${participantId}/resend-charte-email`;

            await ApiTossConnected.post(url, {}, { headers: { 'Content-Type': 'application/json' } });

            // Show success feedback to the user
            showSnackbar('Email de charte renvoyé avec succès', 3000, 'success');
        } catch (error) {
            console.error("Failed to resend charter email:", error);

            // Error handling and user feedback
            let errorMessage = 'Une erreur est survenue lors de la tentative de renvoi de l\'email de charte';
            if (error.response && error.response.data && error.response.data.detail) {
                errorMessage = error.response.data.detail;
            }

            showSnackbar(errorMessage, 3000, 'error');
        }
    };

    


    return (
        <Card sx={{ borderRadius: '0.8rem' }}>
            <CardContent>
                <Box>
                    {headerItem && headerItem}
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow variant="head">
                                {columns.map((column, index) => (
                                    <TableCell key={index} align={column?.align}>{column?.label}</TableCell>
                                ))}
                                {modify && <TableCell align="center">Modifier</TableCell>}
                                {resendCharterEmail && <TableCell align="center">Renvoi charte</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {players ? players.map((player, indexP) => (
                                <TableRow key={indexP}>
                                    {columns.map((column, indexC) => (
                                        column?.type === "boolean" ?
                                            <TableCell key={indexC} align={column?.align}>
                                                {player[column?.name] ? <CheckCircle color="success" /> : <Cancel color="error" />}
                                            </TableCell>
                                            :
                                            column?.type === "date" ?
                                                <TableCell key={indexC} align={column?.align}>
                                                    {new Date(player[column?.name]).toLocaleDateString()}
                                                </TableCell>
                                                :
                                                column?.type === "index" ?
                                                    <TableCell key={indexC} align={column?.align}>
                                                        {indexP + 1}
                                                    </TableCell>
                                                    :
                                                    column?.type === "isBoursier" ?
                                                        <TableCell key={indexC} align={column?.align} sx={{ cursor: 'pointer' }} onClick={() => { if (player["isBoursier"]) { handleCertif(teamId, player.id) } }}>
                                                            {player[column?.name] ? player["isBoursier"] ?
                                                                <Visibility color="success" /> : <CheckCircle color="success" /> : <Cancel color="error" />}
                                                        </TableCell>
                                                        :
                                                        <TableCell key={indexC} align={column?.align}>
                                                            {player[column?.name]}
                                                        </TableCell>
                                    ))}
                                    {modify && <TableCell align="center" sx={{ cursor: 'pointer' }} onClick={() => onModify(player.id)}>
                                        <Edit />
                                    </TableCell>}
                                    {resendCharterEmail && (
                                        <TableCell align="center" sx={{ cursor: 'pointer' }} onClick={() => handleResendCharterEmail(teamId, player.id)}>
                                            <MailOutline />
                                        </TableCell>
                                    )}
                                </TableRow>
                            )) :
                                <TableRow>
                                    <TableCell colSpan={columns.length + (modify ? 1 : 0)} align="center">
                                        <Typography component="h2" sx={{ color: 'divider', marginTop: '1rem' }}>
                                            Aucuns joueurs dans l&apos;équipe
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
}

ParticipantsList.propTypes = {
    headerItem: PropTypes.element,
    columns: PropTypes.array.isRequired,
    players: PropTypes.array,
    modify: PropTypes.bool,
    onModify: PropTypes.func,
    teamId: PropTypes.string.isRequired,
    resendCharterEmail: PropTypes.bool
};
export default ParticipantsList;