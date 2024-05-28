import { Edit } from '@mui/icons-material';
import { Box, Card, CardContent, Chip, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const TeamList = ({ headerItem, columns, teams, modify, onModify, ...props }) => {
    return (
        <Card sx={{ borderRadius: '0.8rem' }} {...props}>
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
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {teams && teams?.length !== 0 ? teams.map((team, indexT) => (
                                <TableRow key={indexT}>
                                    {columns.map((column, indexC) => (
                                        column?.type === "status" ?
                                            <TableCell key={indexC} align={column?.align}>{team[column?.key] === "Validated" ? <Chip label="Validé" color='success' /> : team[column?.key] === "PrincipalList" ? <Chip label="Liste principale" color='primary' /> : <Chip label="En attente" color='error' />}</TableCell>
                                            :
                                            column?.type === "index" ?
                                                <TableCell key={indexC} align={column?.align}>
                                                    {indexT + 1}
                                                </TableCell>
                                                :
                                                <TableCell key={indexC} align={column?.align}>{team[column?.key]}</TableCell>
                                    ))}
                                    {modify && <TableCell align="center"><IconButton onClick={() => onModify(team)}><Edit /></IconButton></TableCell>}
                                </TableRow>
                            )) :
                                <TableRow>
                                    <TableCell colSpan={columns?.length + (modify ? 1 : 0)} align="center">
                                        <Typography component="h2" sx={{ color: 'divider', marginTop: '1rem' }}>
                                            Aucune équipe
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

TeamList.propTypes = {
    teams: PropTypes.array,
    headerItem: PropTypes.element,
    columns: PropTypes.array.isRequired,
    modify: PropTypes.bool.isRequired,
    onModify: PropTypes.func
};

export default TeamList;