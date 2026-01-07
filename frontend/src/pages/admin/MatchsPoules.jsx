import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Alert,
    CircularProgress,
    Paper,
    Grid,
    Tooltip,
} from '@mui/material';
import {
    PlayArrow as PlayIcon,
    Stop as StopIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon,
    AutoFixHigh as GenerateIcon,
} from '@mui/icons-material';
import Navbar from '../../components/navbar/Navbar';
import { routesForAdmin, routesForSuperAdmin } from '../../routes/routes';
import { useAuth } from '../../provider/authProvider';
import {
    getMatchesBySport,
    generatePoolMatches,
    updateMatchScore,
    deleteMatch,
    deleteAllMatches,
    startMatch,
    endMatch,
    getPoolsBySport,
} from '../../service/matchService';

const MatchsPoules = () => {
    const { permission } = useAuth();
    const routes = permission === 'SuperAdminStatus' ? routesForSuperAdmin : routesForAdmin;

    // State
    const [sports, setSports] = useState([]);
    const [selectedSport, setSelectedSport] = useState(null);
    const [matches, setMatches] = useState([]);
    const [pools, setPools] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Dialog states
    const [scoreDialogOpen, setScoreDialogOpen] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [scoreTeamOne, setScoreTeamOne] = useState('');
    const [scoreTeamTwo, setScoreTeamTwo] = useState('');

    // Filter state
    const [selectedPool, setSelectedPool] = useState('all');

    // Fetch sports on mount
    useEffect(() => {
        fetchSports();
    }, []);

    // Fetch matches when sport changes
    useEffect(() => {
        if (selectedSport) {
            fetchMatches();
            fetchPools();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSport]);

    const fetchSports = async () => {
        try {
            setLoading(true);
            const response = await fetch(import.meta.env.VITE_API_SIXTE_API_URL + '/sports', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                }
            });
            const data = await response.json();
            setSports(data);
            if (data.length > 0) {
                setSelectedSport(data[0].id);
            }
        } catch (err) {
            setError('Erreur lors du chargement des sports');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMatches = async () => {
        try {
            setLoading(true);
            const data = await getMatchesBySport(selectedSport);
            // Filtrer uniquement les matchs de phase de poules
            const poolMatches = data.filter(m => m.phase === 'GroupStage');
            setMatches(poolMatches);
        } catch (err) {
            setError('Erreur lors du chargement des matchs');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPools = async () => {
        try {
            const data = await getPoolsBySport(selectedSport);
            setPools(data);
        } catch (err) {
            console.error('Erreur lors du chargement des poules', err);
        }
    };

    const handleGenerateMatches = async () => {
        if (!confirm('Voulez-vous générer automatiquement les matchs de poule ? Cela remplacera les matchs existants.')) return;
        try {
            setLoading(true);
            await generatePoolMatches(selectedSport);
            setSuccess('Matchs générés avec succès');
            fetchMatches();
        } catch (err) {
            setError('Erreur lors de la génération des matchs');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAllMatches = async () => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer TOUS les matchs de ce sport ? Cette action est irréversible.')) return;
        try {
            setLoading(true);
            await deleteAllMatches(selectedSport);
            setSuccess('Tous les matchs ont été supprimés');
            fetchMatches();
        } catch (err) {
            setError('Erreur lors de la suppression des matchs');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenScoreDialog = (match) => {
        setSelectedMatch(match);
        setScoreTeamOne(match.scoreTeamOne?.toString() || '');
        setScoreTeamTwo(match.scoreTeamTwo?.toString() || '');
        setScoreDialogOpen(true);
    };

    const handleSaveScore = async () => {
        if (scoreTeamOne === '' || scoreTeamTwo === '') {
            setError('Veuillez entrer les deux scores');
            return;
        }
        try {
            setLoading(true);
            await updateMatchScore(selectedMatch.id, {
                scoreTeamOne: parseInt(scoreTeamOne),
                scoreTeamTwo: parseInt(scoreTeamTwo),
            });
            setSuccess('Score enregistré avec succès');
            setScoreDialogOpen(false);
            fetchMatches();
        } catch (err) {
            setError('Erreur lors de l\'enregistrement du score');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStartMatch = async (matchId) => {
        try {
            await startMatch(matchId);
            setSuccess('Match démarré');
            fetchMatches();
        } catch (err) {
            setError('Erreur lors du démarrage du match');
            console.error(err);
        }
    };

    const handleEndMatch = async (matchId) => {
        try {
            await endMatch(matchId);
            setSuccess('Match terminé');
            fetchMatches();
        } catch (err) {
            setError('Erreur lors de la fin du match');
            console.error(err);
        }
    };

    const handleDeleteMatch = async (matchId) => {
        if (!confirm('Supprimer ce match ?')) return;
        try {
            await deleteMatch(matchId);
            setSuccess('Match supprimé');
            fetchMatches();
        } catch (err) {
            setError('Erreur lors de la suppression du match');
            console.error(err);
        }
    };

    // Filter matches by selected pool (utilise les pools des équipes)
    const getMatchPoolId = (match) => {
        // La poule d'un match est déterminée par les équipes qui y participent
        // On prend la première poule de l'équipe 1 (dans un match de poule, les deux équipes sont dans la même poule)
        return match.teamOne?.pools?.[0]?.id || match.teamTwo?.pools?.[0]?.id;
    };

    const filteredMatches = selectedPool === 'all'
        ? matches
        : matches.filter(m => getMatchPoolId(m) === selectedPool);

    // Group matches by pool
    const matchesByPool = pools.reduce((acc, pool) => {
        acc[pool.id] = matches.filter(m => getMatchPoolId(m) === pool.id);
        return acc;
    }, {});

    const formatTime = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    const getMatchStatus = (match) => {
        if (match.hasEnded) return { label: 'Terminé', color: 'success' };
        if (match.hasStarted) return { label: 'En cours', color: 'warning' };
        return { label: 'À venir', color: 'default' };
    };

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh" sx={{ bgcolor: 'background.drawer' }}>
            <Navbar navigation={routes} />

            <Box sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography variant="h3" gutterBottom>
                        Matchs de Poules
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Gérez les matchs de la phase de poules
                    </Typography>
                </Box>

                {/* Alerts */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
                        {success}
                    </Alert>
                )}

                {/* Controls */}
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Sport</InputLabel>
                        <Select
                            value={selectedSport || ''}
                            onChange={(e) => setSelectedSport(e.target.value)}
                            label="Sport"
                        >
                            {sports.map((sport) => (
                                <MenuItem key={sport.id} value={sport.id}>
                                    {sport.sport}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 150 }}>
                        <InputLabel>Poule</InputLabel>
                        <Select
                            value={selectedPool}
                            onChange={(e) => setSelectedPool(e.target.value)}
                            label="Poule"
                        >
                            <MenuItem value="all">Toutes</MenuItem>
                            {pools.map((pool) => (
                                <MenuItem key={pool.id} value={pool.id}>
                                    {pool.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<GenerateIcon />}
                        onClick={handleGenerateMatches}
                        disabled={!selectedSport || loading}
                    >
                        Générer les matchs
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={fetchMatches}
                        disabled={loading}
                    >
                        Actualiser
                    </Button>

                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={handleDeleteAllMatches}
                        disabled={!selectedSport || loading || matches.length === 0}
                    >
                        Supprimer tout
                    </Button>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" py={5}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {selectedPool === 'all' ? (
                            // Afficher par poule
                            pools.map((pool) => (
                                <Grid item xs={12} key={pool.id}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                                                {pool.name}
                                            </Typography>
                                            <MatchTable
                                                matches={matchesByPool[pool.id] || []}
                                                formatTime={formatTime}
                                                getMatchStatus={getMatchStatus}
                                                onEditScore={handleOpenScoreDialog}
                                                onStart={handleStartMatch}
                                                onEnd={handleEndMatch}
                                                onDelete={handleDeleteMatch}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            // Afficher une seule poule
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <MatchTable
                                            matches={filteredMatches}
                                            formatTime={formatTime}
                                            getMatchStatus={getMatchStatus}
                                            onEditScore={handleOpenScoreDialog}
                                            onStart={handleStartMatch}
                                            onEnd={handleEndMatch}
                                            onDelete={handleDeleteMatch}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}

                        {matches.length === 0 && (
                            <Grid item xs={12}>
                                <Paper sx={{ p: 4, textAlign: 'center' }}>
                                    <Typography variant="h6" color="text.secondary">
                                        Aucun match de poule pour ce sport
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        Assurez-vous d&apos;avoir créé des poules et assigné des équipes, puis générez les matchs.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<GenerateIcon />}
                                        sx={{ mt: 2 }}
                                        onClick={handleGenerateMatches}
                                        disabled={!selectedSport}
                                    >
                                        Générer les matchs
                                    </Button>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                )}
            </Box>

            {/* Dialog: Modifier le score */}
            <Dialog open={scoreDialogOpen} onClose={() => setScoreDialogOpen(false)}>
                <DialogTitle>
                    Modifier le score
                </DialogTitle>
                <DialogContent>
                    {selectedMatch && (
                        <Box sx={{ pt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
                                <Box sx={{ textAlign: 'center', flex: 1 }}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {selectedMatch.teamOne?.name || 'Équipe 1'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {selectedMatch.teamOne?.school?.name}
                                    </Typography>
                                </Box>
                                <Typography variant="h5" color="text.secondary">VS</Typography>
                                <Box sx={{ textAlign: 'center', flex: 1 }}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {selectedMatch.teamTwo?.name || 'Équipe 2'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {selectedMatch.teamTwo?.school?.name}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                                <TextField
                                    type="number"
                                    value={scoreTeamOne}
                                    onChange={(e) => setScoreTeamOne(e.target.value)}
                                    inputProps={{ min: 0, style: { textAlign: 'center', fontSize: '2rem' } }}
                                    sx={{ width: 100 }}
                                />
                                <Typography variant="h4">-</Typography>
                                <TextField
                                    type="number"
                                    value={scoreTeamTwo}
                                    onChange={(e) => setScoreTeamTwo(e.target.value)}
                                    inputProps={{ min: 0, style: { textAlign: 'center', fontSize: '2rem' } }}
                                    sx={{ width: 100 }}
                                />
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setScoreDialogOpen(false)}>Annuler</Button>
                    <Button onClick={handleSaveScore} variant="contained" disabled={loading}>
                        Enregistrer
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

// Composant tableau de matchs
const MatchTable = ({ matches, formatTime, getMatchStatus, onEditScore, onStart, onEnd, onDelete }) => {
    if (matches.length === 0) {
        return (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                Aucun match dans cette poule
            </Typography>
        );
    }

    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Heure</TableCell>
                        <TableCell>Terrain</TableCell>
                        <TableCell>Équipe 1</TableCell>
                        <TableCell align="center">Score</TableCell>
                        <TableCell>Équipe 2</TableCell>
                        <TableCell align="center">Statut</TableCell>
                        <TableCell align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {matches.map((match) => {
                        const status = getMatchStatus(match);
                        return (
                            <TableRow key={match.id} hover>
                                <TableCell>{formatTime(match.matchTime)}</TableCell>
                                <TableCell>Terrain {match.field || '-'}</TableCell>
                                <TableCell>
                                    <Box>
                                        <Typography variant="body2" fontWeight={match.winnerId === match.teamOneId ? 'bold' : 'normal'}>
                                            {match.teamOne?.name || 'TBD'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {match.teamOne?.school?.name}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography variant="h6" fontWeight="bold">
                                        {match.scoreTeamOne !== null ? `${match.scoreTeamOne} - ${match.scoreTeamTwo}` : '- : -'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Box>
                                        <Typography variant="body2" fontWeight={match.winnerId === match.teamTwoId ? 'bold' : 'normal'}>
                                            {match.teamTwo?.name || 'TBD'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {match.teamTwo?.school?.name}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    <Chip label={status.label} color={status.color} size="small" />
                                </TableCell>
                                <TableCell align="center">
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                                        <Tooltip title="Modifier le score">
                                            <IconButton size="small" onClick={() => onEditScore(match)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        {!match.hasStarted && !match.hasEnded && (
                                            <Tooltip title="Démarrer le match">
                                                <IconButton size="small" color="success" onClick={() => onStart(match.id)}>
                                                    <PlayIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        {match.hasStarted && !match.hasEnded && (
                                            <Tooltip title="Terminer le match">
                                                <IconButton size="small" color="warning" onClick={() => onEnd(match.id)}>
                                                    <StopIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        <Tooltip title="Supprimer">
                                            <IconButton size="small" color="error" onClick={() => onDelete(match.id)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

MatchTable.propTypes = {
    matches: PropTypes.array.isRequired,
    formatTime: PropTypes.func.isRequired,
    getMatchStatus: PropTypes.func.isRequired,
    onEditScore: PropTypes.func.isRequired,
    onStart: PropTypes.func.isRequired,
    onEnd: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default MatchsPoules;
