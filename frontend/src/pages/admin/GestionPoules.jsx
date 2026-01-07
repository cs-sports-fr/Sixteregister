import { useState, useEffect } from 'react';
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
    Tabs,
    Tab,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    PersonAdd as PersonAddIcon,
    PersonRemove as PersonRemoveIcon,
    EmojiEvents as TrophyIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';
import Navbar from '../../components/navbar/Navbar';
import { routesForAdmin, routesForSuperAdmin } from '../../routes/routes';
import { useAuth } from '../../provider/authProvider';
import {
    getPoolsBySport,
    createPool,
    deletePool,
    assignTeamToPool,
    removeTeamFromPool,
    getRankings,
    getSportWithTeams,
    updatePoolSettings,
    getPlaces,
} from '../../service/matchService';

const GestionPoules = () => {
    const { permission } = useAuth();
    const routes = permission === 'SuperAdminStatus' ? routesForSuperAdmin : routesForAdmin;

    // State
    const [sports, setSports] = useState([]);
    const [selectedSport, setSelectedSport] = useState(null);
    const [pools, setPools] = useState([]);
    const [teams, setTeams] = useState([]);
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [tabValue, setTabValue] = useState(0);

    // Dialog states
    const [createPoolDialogOpen, setCreatePoolDialogOpen] = useState(false);
    const [assignTeamDialogOpen, setAssignTeamDialogOpen] = useState(false);
    const [poolSettingsDialogOpen, setPoolSettingsDialogOpen] = useState(false);
    const [selectedPool, setSelectedPool] = useState(null);
    const [newPoolName, setNewPoolName] = useState('');
    const [places, setPlaces] = useState([]);
    const [selectedPlaceId, setSelectedPlaceId] = useState('');
    const [selectedIsMorning, setSelectedIsMorning] = useState(true);

    // Fetch sports and places on mount
    useEffect(() => {
        fetchSports();
        fetchPlaces();
    }, []);

    // Fetch pools and teams when sport changes
    useEffect(() => {
        if (selectedSport) {
            fetchPoolsAndTeams();
            fetchRankings();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSport]);

    const fetchPlaces = async () => {
        try {
            const data = await getPlaces();
            setPlaces(data);
        } catch (err) {
            console.error('Erreur lors du chargement des lieux', err);
        }
    };

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

    const fetchPoolsAndTeams = async () => {
        try {
            setLoading(true);
            const [poolsData, sportData] = await Promise.all([
                getPoolsBySport(selectedSport),
                getSportWithTeams(selectedSport)
            ]);
            setPools(poolsData);
            // Filtrer uniquement les équipes validées
            setTeams(sportData.teams?.filter(t => t.status === 'Validated') || []);
        } catch (err) {
            setError('Erreur lors du chargement des données');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRankings = async () => {
        try {
            const data = await getRankings(selectedSport);
            setRankings(data);
        } catch (err) {
            console.error('Erreur lors du chargement des classements', err);
        }
    };

    const handleCreatePool = async () => {
        if (!newPoolName.trim()) {
            setError('Le nom de la poule est requis');
            return;
        }
        try {
            setLoading(true);
            await createPool({
                name: newPoolName,
                sportId: selectedSport,
            });
            setSuccess('Poule créée avec succès');
            setNewPoolName('');
            setCreatePoolDialogOpen(false);
            fetchPoolsAndTeams();
        } catch (err) {
            setError('Erreur lors de la création de la poule');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePool = async (poolId) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette poule ?')) return;
        try {
            setLoading(true);
            await deletePool(poolId);
            setSuccess('Poule supprimée avec succès');
            fetchPoolsAndTeams();
        } catch (err) {
            setError('Erreur lors de la suppression de la poule');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openPoolSettingsDialog = (pool) => {
        setSelectedPool(pool);
        setSelectedPlaceId(pool.PlaceId || '');
        setSelectedIsMorning(pool.isMorning ?? true);
        setPoolSettingsDialogOpen(true);
    };

    const handleSavePoolSettings = async () => {
        try {
            setLoading(true);
            await updatePoolSettings(selectedPool.id, {
                placeId: selectedPlaceId || null,
                isMorning: selectedIsMorning,
            });
            setSuccess('Paramètres de la poule mis à jour');
            setPoolSettingsDialogOpen(false);
            fetchPoolsAndTeams();
        } catch (err) {
            setError('Erreur lors de la mise à jour des paramètres');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignTeam = async (teamId) => {
        try {
            setLoading(true);
            await assignTeamToPool(teamId, selectedPool.id);
            setSuccess('Équipe assignée avec succès');
            setAssignTeamDialogOpen(false);
            fetchPoolsAndTeams();
            fetchRankings();
        } catch (err) {
            setError('Erreur lors de l\'assignation de l\'équipe');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveTeamFromPool = async (teamId, poolId) => {
        try {
            setLoading(true);
            await removeTeamFromPool(teamId, poolId);
            setSuccess('Équipe retirée de la poule');
            fetchPoolsAndTeams();
            fetchRankings();
        } catch (err) {
            setError('Erreur lors du retrait de l\'équipe');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Équipes sans poule - calculé à partir des pools (car getSportWithTeams ne renvoie pas les pools des équipes)
    const teamsInPools = new Set();
    pools.forEach(pool => {
        pool.teams?.forEach(team => teamsInPools.add(team.id));
    });
    const teamsWithoutPool = teams.filter(t => !teamsInPools.has(t.id));

    // Obtenir le classement d'une poule
    const getPoolRanking = (poolId) => {
        return rankings.find(r => r.poolId === poolId)?.rankings || [];
    };

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh" sx={{ bgcolor: 'background.drawer' }}>
            <Navbar navigation={routes} />

            <Box sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography variant="h3" gutterBottom>
                        Gestion des Poules
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Créez et gérez les poules du tournoi
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

                {/* Sport Selector */}
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
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
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setCreatePoolDialogOpen(true)}
                        disabled={!selectedSport}
                    >
                        Créer une poule
                    </Button>
                </Box>

                {/* Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} centered>
                        <Tab label="Poules & Équipes" />
                        <Tab label="Classements" icon={<TrophyIcon />} iconPosition="start" />
                    </Tabs>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" py={5}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {/* Tab 0: Poules & Équipes */}
                        {tabValue === 0 && (
                            <Grid container spacing={3}>
                                {/* Liste des poules */}
                                {pools.map((pool) => (
                                    <Grid item xs={12} md={6} lg={4} key={pool.id}>
                                        <Card sx={{ height: '100%' }}>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                    <Typography variant="h6">
                                                        {pool.name}
                                                    </Typography>
                                                    <Box>
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() => {
                                                                setSelectedPool(pool);
                                                                setAssignTeamDialogOpen(true);
                                                            }}
                                                            title="Ajouter une équipe"
                                                        >
                                                            <PersonAddIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            color="info"
                                                            onClick={() => openPoolSettingsDialog(pool)}
                                                            title="Paramètres (lieu et créneau)"
                                                        >
                                                            <SettingsIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleDeletePool(pool.id)}
                                                            title="Supprimer la poule"
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                                {/* Affichage du lieu et créneau */}
                                                <Box sx={{ mb: 1 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        📍 {pool.Place?.name || 'Lieu non défini'} | {pool.isMorning ? '🌅 Matin' : '🌇 Après-midi'}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                    {pool.teams?.length || 0} équipe(s)
                                                </Typography>
                                                {pool.teams && pool.teams.length > 0 ? (
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                        {pool.teams.map((team) => (
                                                            <Box
                                                                key={team.id}
                                                                sx={{
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'center',
                                                                    p: 1,
                                                                    bgcolor: 'background.default',
                                                                    borderRadius: 1,
                                                                }}
                                                            >
                                                                <Box>
                                                                    <Typography variant="body2" fontWeight="medium">
                                                                        {team.name}
                                                                    </Typography>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {team.school?.name}
                                                                    </Typography>
                                                                </Box>
                                                                <IconButton
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={() => handleRemoveTeamFromPool(team.id, pool.id)}
                                                                    title="Retirer de la poule"
                                                                >
                                                                    <PersonRemoveIcon fontSize="small" />
                                                                </IconButton>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                        Aucune équipe dans cette poule
                                                    </Typography>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}

                                {/* Équipes sans poule */}
                                {teamsWithoutPool.length > 0 && (
                                    <Grid item xs={12}>
                                        <Card sx={{ bgcolor: 'warning.light' }}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    Équipes sans poule ({teamsWithoutPool.length})
                                                </Typography>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                    {teamsWithoutPool.map((team) => (
                                                        <Chip
                                                            key={team.id}
                                                            label={`${team.name} (${team.school?.name || 'N/A'})`}
                                                            color="warning"
                                                        />
                                                    ))}
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}

                                {pools.length === 0 && (
                                    <Grid item xs={12}>
                                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                                            <Typography variant="h6" color="text.secondary">
                                                Aucune poule créée pour ce sport
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                startIcon={<AddIcon />}
                                                sx={{ mt: 2 }}
                                                onClick={() => setCreatePoolDialogOpen(true)}
                                            >
                                                Créer une poule
                                            </Button>
                                        </Paper>
                                    </Grid>
                                )}
                            </Grid>
                        )}

                        {/* Tab 1: Classements */}
                        {tabValue === 1 && (
                            <Grid container spacing={3}>
                                {pools.map((pool) => {
                                    const ranking = getPoolRanking(pool.id);
                                    return (
                                        <Grid item xs={12} md={6} key={pool.id}>
                                            <Card>
                                                <CardContent>
                                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <TrophyIcon color="primary" />
                                                        Classement - {pool.name}
                                                    </Typography>
                                                    <TableContainer>
                                                        <Table size="small">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>#</TableCell>
                                                                    <TableCell>Équipe</TableCell>
                                                                    <TableCell align="center">Pts</TableCell>
                                                                    <TableCell align="center">J</TableCell>
                                                                    <TableCell align="center">G</TableCell>
                                                                    <TableCell align="center">N</TableCell>
                                                                    <TableCell align="center">P</TableCell>
                                                                    <TableCell align="center">+/-</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {ranking.length > 0 ? ranking.map((team, index) => (
                                                                    <TableRow
                                                                        key={team.id}
                                                                        sx={{
                                                                            bgcolor: index < 2 ? 'success.light' : 'inherit',
                                                                            '&:hover': { bgcolor: 'action.hover' }
                                                                        }}
                                                                    >
                                                                        <TableCell>
                                                                            <Typography fontWeight="bold">{index + 1}</Typography>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Typography variant="body2" fontWeight="medium">
                                                                                {team.name}
                                                                            </Typography>
                                                                        </TableCell>
                                                                        <TableCell align="center">
                                                                            <Typography fontWeight="bold">{team.tournamentPoints || 0}</Typography>
                                                                        </TableCell>
                                                                        <TableCell align="center">
                                                                            {(team.poolmatcheswon || 0) + (team.poolmatchesdraw || 0) + (team.poolmatcheslost || 0)}
                                                                        </TableCell>
                                                                        <TableCell align="center">{team.poolmatcheswon || 0}</TableCell>
                                                                        <TableCell align="center">{team.poolmatchesdraw || 0}</TableCell>
                                                                        <TableCell align="center">{team.poolmatcheslost || 0}</TableCell>
                                                                        <TableCell align="center">
                                                                            <Typography
                                                                                color={team.goalDifference > 0 ? 'success.main' : team.goalDifference < 0 ? 'error.main' : 'text.primary'}
                                                                            >
                                                                                {team.goalDifference > 0 ? '+' : ''}{team.goalDifference || 0}
                                                                            </Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )) : (
                                                                    <TableRow>
                                                                        <TableCell colSpan={8} align="center">
                                                                            <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                                                Aucun classement disponible
                                                                            </Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                                {pools.length === 0 && (
                                    <Grid item xs={12}>
                                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                                            <Typography variant="h6" color="text.secondary">
                                                Aucune poule à afficher
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                )}
                            </Grid>
                        )}
                    </>
                )}
            </Box>

            {/* Dialog: Créer une poule */}
            <Dialog open={createPoolDialogOpen} onClose={() => setCreatePoolDialogOpen(false)}>
                <DialogTitle>Créer une nouvelle poule</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nom de la poule"
                        fullWidth
                        value={newPoolName}
                        onChange={(e) => setNewPoolName(e.target.value)}
                        placeholder="Ex: Poule A"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreatePoolDialogOpen(false)}>Annuler</Button>
                    <Button onClick={handleCreatePool} variant="contained" disabled={loading}>
                        Créer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog: Assigner une équipe */}
            <Dialog open={assignTeamDialogOpen} onClose={() => setAssignTeamDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Ajouter une équipe à {selectedPool?.name}</DialogTitle>
                <DialogContent>
                    {teamsWithoutPool.length > 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                            {teamsWithoutPool.map((team) => (
                                <Button
                                    key={team.id}
                                    variant="outlined"
                                    onClick={() => handleAssignTeam(team.id)}
                                    sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                                >
                                    <Box sx={{ textAlign: 'left' }}>
                                        <Typography variant="body1">{team.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {team.school?.name || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Button>
                            ))}
                        </Box>
                    ) : (
                        <Typography color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                            Toutes les équipes sont déjà assignées à une poule
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAssignTeamDialogOpen(false)}>Fermer</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog: Paramètres de la poule (lieu et créneau) */}
            <Dialog open={poolSettingsDialogOpen} onClose={() => setPoolSettingsDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Paramètres de {selectedPool?.name}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Lieu</InputLabel>
                            <Select
                                value={selectedPlaceId}
                                label="Lieu"
                                onChange={(e) => setSelectedPlaceId(e.target.value)}
                            >
                                <MenuItem value="">
                                    <em>Aucun lieu</em>
                                </MenuItem>
                                {places.map((place) => (
                                    <MenuItem key={place.id} value={place.id}>
                                        {place.name} ({place.numberOfFields} terrain{place.numberOfFields > 1 ? 's' : ''})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Créneau</InputLabel>
                            <Select
                                value={selectedIsMorning}
                                label="Créneau"
                                onChange={(e) => setSelectedIsMorning(e.target.value)}
                            >
                                <MenuItem value={true}>🌅 Matin</MenuItem>
                                <MenuItem value={false}>🌇 Après-midi</MenuItem>
                            </Select>
                        </FormControl>

                        <Alert severity="info">
                            <strong>Important :</strong> Pour que la génération automatique de matchs fonctionne, 
                            chaque poule doit avoir un lieu et un créneau (matin/après-midi) assignés.
                        </Alert>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPoolSettingsDialogOpen(false)}>Annuler</Button>
                    <Button onClick={handleSavePoolSettings} variant="contained" disabled={loading}>
                        Enregistrer
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default GestionPoules;
