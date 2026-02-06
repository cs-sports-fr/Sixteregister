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
    IconButton,
    Alert,
    CircularProgress,
    Paper,
    Autocomplete,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon,
    EmojiEvents as TrophyIcon,
    PlayArrow as PlayIcon,
    Stop as StopIcon,
} from '@mui/icons-material';
import Navbar from '../../components/navbar/Navbar';
import { routesForAdmin, routesForSuperAdmin } from '../../routes/routes';
import { useAuth } from '../../provider/authProvider';
import {
    getMatchesBySport,
    createMatch,
    updateMatchScore,
    deleteMatch,
    modifyMatch,
    getSportWithTeams,
    startMatch,
    endMatch,
} from '../../service/matchService';

const PhasesFinales = () => {
    const { permission } = useAuth();
    const routes = permission === 'SuperAdminStatus' ? routesForSuperAdmin : routesForAdmin;

    // State
    const [sports, setSports] = useState([]);
    const [selectedSport, setSelectedSport] = useState(null);
    const [matches, setMatches] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Dialog states
    const [createMatchDialogOpen, setCreateMatchDialogOpen] = useState(false);
    const [scoreDialogOpen, setScoreDialogOpen] = useState(false);
    const [editMatchDialogOpen, setEditMatchDialogOpen] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);

    // Form states
    const [newMatch, setNewMatch] = useState({
        phase: 'QuarterFinal',
        teamOneId: null,
        teamTwoId: null,
        matchTime: '',
        field: '1',
    });
    const [scoreTeamOne, setScoreTeamOne] = useState('');
    const [scoreTeamTwo, setScoreTeamTwo] = useState('');

    // Phases disponibles (selon le schema Prisma)
    const phases = [
        { value: 'Roundof64', label: '64èmes de finale' },
        { value: 'Roundof32', label: '32èmes de finale' },
        { value: 'Roundof16', label: 'Huitièmes de finale' },
        { value: 'QuarterFinal', label: 'Quarts de finale' },
        { value: 'SemiFinal', label: 'Demi-finales' },
        { value: 'ThirdPlace', label: 'Match pour la 3ème place' },
        { value: 'Final', label: 'Finale' },
    ];

    // Fetch sports on mount
    useEffect(() => {
        fetchSports();
    }, []);

    // Fetch matches when sport changes
    useEffect(() => {
        if (selectedSport) {
            fetchMatches();
            fetchTeams();
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
            // Filtrer uniquement les matchs de phase finale (pas GroupStage)
            const knockoutMatches = data.filter(m => m.phase !== 'GroupStage');
            setMatches(knockoutMatches);
        } catch (err) {
            setError('Erreur lors du chargement des matchs');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTeams = async () => {
        try {
            const data = await getSportWithTeams(selectedSport);
            setTeams(data.teams?.filter(t => t.status === 'Validated') || []);
        } catch (err) {
            console.error('Erreur lors du chargement des équipes', err);
        }
    };

    const handleCreateMatch = async () => {
        if (!newMatch.teamOneId || !newMatch.teamTwoId) {
            setError('Veuillez sélectionner les deux équipes');
            return;
        }
        if (!newMatch.field) {
            setError('Veuillez spécifier un terrain');
            return;
        }
        try {
            setLoading(true);
            // Créer une date par défaut si non spécifiée (aujourd'hui à 10h)
            let matchTime = newMatch.matchTime;
            if (!matchTime) {
                const today = new Date();
                today.setHours(10, 0, 0, 0);
                matchTime = today.toISOString();
            } else {
                // Convertir l'heure en datetime complet
                const today = new Date();
                const [hours, minutes] = newMatch.matchTime.split(':');
                today.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                matchTime = today.toISOString();
            }
            await createMatch({
                sportId: selectedSport,
                phase: newMatch.phase,
                teamOneId: newMatch.teamOneId,
                teamTwoId: newMatch.teamTwoId,
                matchTime: matchTime,
                field: parseInt(newMatch.field),
                teamOneSource: null,
                teamTwoSource: null,
                placeId: null,
            });
            setSuccess('Match créé avec succès');
            setCreateMatchDialogOpen(false);
            setNewMatch({ phase: 'QuarterFinal', teamOneId: null, teamTwoId: null, matchTime: '', field: '1' });
            fetchMatches();
        } catch (err) {
            setError('Erreur lors de la création du match');
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
        if (scoreTeamOne === scoreTeamTwo) {
            setError('En phase finale, il doit y avoir un vainqueur (pas de match nul)');
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

    const handleOpenEditMatch = (match) => {
        setSelectedMatch(match);
        setNewMatch({
            phase: match.phase,
            teamOneId: match.teamOneId,
            teamTwoId: match.teamTwoId,
            matchTime: match.matchTime || '',
            field: match.field?.toString() || '',
        });
        setEditMatchDialogOpen(true);
    };

    const handleEditMatch = async () => {
        try {
            setLoading(true);
            await modifyMatch(selectedMatch.id, {
                phase: newMatch.phase,
                teamOneId: newMatch.teamOneId,
                teamTwoId: newMatch.teamTwoId,
                matchTime: newMatch.matchTime || null,
                field: newMatch.field ? parseInt(newMatch.field) : null,
            });
            setSuccess('Match modifié avec succès');
            setEditMatchDialogOpen(false);
            fetchMatches();
        } catch (err) {
            setError('Erreur lors de la modification du match');
            console.error(err);
        } finally {
            setLoading(false);
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

    // Grouper les matchs par phase
    const matchesByPhase = phases.reduce((acc, phase) => {
        acc[phase.value] = matches.filter(m => m.phase === phase.value);
        return acc;
    }, {});

    const getPhaseLabel = (phaseValue) => {
        return phases.find(p => p.value === phaseValue)?.label || phaseValue;
    };

    const formatTime = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh" sx={{ bgcolor: 'background.drawer' }}>
            <Navbar navigation={routes} />

            <Box sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography variant="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                        <TrophyIcon sx={{ fontSize: 50, color: 'gold' }} />
                        Phases Finales
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Gérez les matchs éliminatoires
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

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => setCreateMatchDialogOpen(true)}
                        disabled={!selectedSport}
                    >
                        Créer un match
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={fetchMatches}
                        disabled={loading}
                    >
                        Actualiser
                    </Button>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" py={5}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box>
                        {/* Bracket visuel */}
                        <BracketView
                            matchesByPhase={matchesByPhase}
                            phases={phases}
                            getPhaseLabel={getPhaseLabel}
                            formatTime={formatTime}
                            onEditScore={handleOpenScoreDialog}
                            onEditMatch={handleOpenEditMatch}
                            onDelete={handleDeleteMatch}
                            onStart={handleStartMatch}
                            onEnd={handleEndMatch}
                        />

                        {matches.length === 0 && (
                            <Paper sx={{ p: 4, textAlign: 'center', mt: 3 }}>
                                <Typography variant="h6" color="text.secondary">
                                    Aucun match de phase finale
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Créez des matchs éliminatoires pour construire votre bracket.
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    sx={{ mt: 2 }}
                                    onClick={() => setCreateMatchDialogOpen(true)}
                                    disabled={!selectedSport}
                                >
                                    Créer un match
                                </Button>
                            </Paper>
                        )}
                    </Box>
                )}
            </Box>

            {/* Dialog: Créer un match */}
            <Dialog open={createMatchDialogOpen} onClose={() => setCreateMatchDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Créer un match de phase finale</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        <FormControl fullWidth>
                            <InputLabel>Phase</InputLabel>
                            <Select
                                value={newMatch.phase}
                                onChange={(e) => setNewMatch({ ...newMatch, phase: e.target.value })}
                                label="Phase"
                            >
                                {phases.map((phase) => (
                                    <MenuItem key={phase.value} value={phase.value}>
                                        {phase.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Autocomplete
                            options={teams}
                            getOptionLabel={(option) => `${option.name} (${option.school?.name || 'N/A'})`}
                            value={teams.find(t => t.id === newMatch.teamOneId) || null}
                            onChange={(e, value) => setNewMatch({ ...newMatch, teamOneId: value?.id || null })}
                            renderInput={(params) => <TextField {...params} label="Équipe 1" />}
                        />

                        <Autocomplete
                            options={teams}
                            getOptionLabel={(option) => `${option.name} (${option.school?.name || 'N/A'})`}
                            value={teams.find(t => t.id === newMatch.teamTwoId) || null}
                            onChange={(e, value) => setNewMatch({ ...newMatch, teamTwoId: value?.id || null })}
                            renderInput={(params) => <TextField {...params} label="Équipe 2" />}
                        />

                        <TextField
                            label="Heure du match"
                            type="time"
                            value={newMatch.matchTime}
                            onChange={(e) => setNewMatch({ ...newMatch, matchTime: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                        />

                        <TextField
                            label="Terrain"
                            type="number"
                            value={newMatch.field}
                            onChange={(e) => setNewMatch({ ...newMatch, field: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateMatchDialogOpen(false)}>Annuler</Button>
                    <Button onClick={handleCreateMatch} variant="contained" disabled={loading}>
                        Créer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog: Modifier le score */}
            <Dialog open={scoreDialogOpen} onClose={() => setScoreDialogOpen(false)}>
                <DialogTitle>Modifier le score</DialogTitle>
                <DialogContent>
                    {selectedMatch && (
                        <Box sx={{ pt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
                                <Box sx={{ textAlign: 'center', flex: 1 }}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {selectedMatch.teamOne?.name || 'Équipe 1'}
                                    </Typography>
                                </Box>
                                <Typography variant="h5" color="text.secondary">VS</Typography>
                                <Box sx={{ textAlign: 'center', flex: 1 }}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {selectedMatch.teamTwo?.name || 'Équipe 2'}
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
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
                                En phase finale, il doit y avoir un vainqueur
                            </Typography>
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

            {/* Dialog: Modifier un match */}
            <Dialog open={editMatchDialogOpen} onClose={() => setEditMatchDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Modifier le match</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        <FormControl fullWidth>
                            <InputLabel>Phase</InputLabel>
                            <Select
                                value={newMatch.phase}
                                onChange={(e) => setNewMatch({ ...newMatch, phase: e.target.value })}
                                label="Phase"
                            >
                                {phases.map((phase) => (
                                    <MenuItem key={phase.value} value={phase.value}>
                                        {phase.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Autocomplete
                            options={teams}
                            getOptionLabel={(option) => `${option.name} (${option.school?.name || 'N/A'})`}
                            value={teams.find(t => t.id === newMatch.teamOneId) || null}
                            onChange={(e, value) => setNewMatch({ ...newMatch, teamOneId: value?.id || null })}
                            renderInput={(params) => <TextField {...params} label="Équipe 1" />}
                        />

                        <Autocomplete
                            options={teams}
                            getOptionLabel={(option) => `${option.name} (${option.school?.name || 'N/A'})`}
                            value={teams.find(t => t.id === newMatch.teamTwoId) || null}
                            onChange={(e, value) => setNewMatch({ ...newMatch, teamTwoId: value?.id || null })}
                            renderInput={(params) => <TextField {...params} label="Équipe 2" />}
                        />

                        <TextField
                            label="Heure du match"
                            type="time"
                            value={newMatch.matchTime}
                            onChange={(e) => setNewMatch({ ...newMatch, matchTime: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                        />

                        <TextField
                            label="Terrain"
                            type="number"
                            value={newMatch.field}
                            onChange={(e) => setNewMatch({ ...newMatch, field: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditMatchDialogOpen(false)}>Annuler</Button>
                    <Button onClick={handleEditMatch} variant="contained" disabled={loading}>
                        Enregistrer
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

// Composant Bracket visuel
// eslint-disable-next-line no-unused-vars
const BracketView = ({ matchesByPhase, phases, getPhaseLabel, formatTime, onEditScore, onEditMatch, onDelete, onStart, onEnd }) => {
    // Ordre d'affichage pour le bracket: 64èmes -> 32èmes -> Huitièmes -> Quarts -> Demis -> Finale (+ 3ème place)
    const mainBracketPhases = ['Roundof64', 'Roundof32', 'Roundof16', 'QuarterFinal', 'SemiFinal', 'Final'];
    
    const hasMainMatches = mainBracketPhases.some(p => matchesByPhase[p]?.length > 0);
    const hasThirdPlace = matchesByPhase['ThirdPlace']?.length > 0;

    return (
        <Box>
            {/* Tableau principal */}
            {hasMainMatches && (
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TrophyIcon /> Tableau Principal
                        </Typography>
                        <Box sx={{ 
                            display: 'flex', 
                            gap: 2, 
                            overflowX: 'auto', 
                            pb: 2,
                            justifyContent: 'center',
                        }}>
                            {mainBracketPhases.map((phaseKey) => {
                                const phaseMatches = matchesByPhase[phaseKey] || [];
                                if (phaseMatches.length === 0) return null;
                                return (
                                    <Box 
                                        key={phaseKey} 
                                        sx={{ 
                                            minWidth: 250,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold', color: 'text.secondary' }}>
                                            {getPhaseLabel(phaseKey)}
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center', flex: 1 }}>
                                            {phaseMatches.map((match) => (
                                                <MatchCard
                                                    key={match.id}
                                                    match={match}
                                                    formatTime={formatTime}
                                                    onEditScore={onEditScore}
                                                    onEditMatch={onEditMatch}
                                                    onDelete={onDelete}
                                                    onStart={onStart}
                                                    onEnd={onEnd}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Match pour la 3ème place */}
            {hasThirdPlace && (
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ color: 'warning.main' }}>
                            🥉 Match pour la 3ème place
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            {matchesByPhase['ThirdPlace'].map((match) => (
                                <MatchCard
                                    key={match.id}
                                    match={match}
                                    formatTime={formatTime}
                                    onEditScore={onEditScore}
                                    onEditMatch={onEditMatch}
                                    onDelete={onDelete}
                                    onStart={onStart}
                                    onEnd={onEnd}
                                />
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

// Composant carte de match
const MatchCard = ({ match, formatTime, onEditScore, onEditMatch, onDelete, onStart, onEnd }) => {
    const isWinner = (teamId) => match.winnerId && match.winnerId === teamId;
    
    // Déterminer le statut du match
    const getMatchStatus = () => {
        if (match.hasEnded) return { label: 'Terminé', color: 'success' };
        if (match.hasStarted) return { label: 'En cours', color: 'warning' };
        return { label: 'À venir', color: 'default' };
    };
    const status = getMatchStatus();
    
    return (
        <Paper
            elevation={3}
            sx={{
                p: 2,
                minWidth: 220,
                bgcolor: match.winnerId ? 'background.default' : 'background.paper',
                border: match.phase === 'Final' ? '2px solid gold' : '1px solid',
                borderColor: match.phase === 'Final' ? 'gold' : 'divider',
            }}
        >
            {/* Statut du match */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <Typography 
                    variant="caption" 
                    sx={{ 
                        px: 1, 
                        py: 0.25, 
                        borderRadius: 1,
                        bgcolor: status.color === 'success' ? 'success.light' : 
                                 status.color === 'warning' ? 'warning.light' : 'grey.200',
                        color: status.color === 'success' ? 'success.dark' : 
                               status.color === 'warning' ? 'warning.dark' : 'text.secondary',
                    }}
                >
                    {status.label}
                </Typography>
            </Box>

            {/* Équipe 1 */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1,
                    bgcolor: isWinner(match.teamOneId) ? 'success.light' : 'transparent',
                    borderRadius: 1,
                    mb: 0.5,
                }}
            >
                <Typography
                    variant="body2"
                    fontWeight={isWinner(match.teamOneId) ? 'bold' : 'normal'}
                    sx={{ 
                        maxWidth: 150, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {match.teamOne?.name || 'TBD'}
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                    {match.scoreTeamOne ?? '-'}
                </Typography>
            </Box>

            {/* Équipe 2 */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1,
                    bgcolor: isWinner(match.teamTwoId) ? 'success.light' : 'transparent',
                    borderRadius: 1,
                }}
            >
                <Typography
                    variant="body2"
                    fontWeight={isWinner(match.teamTwoId) ? 'bold' : 'normal'}
                    sx={{ 
                        maxWidth: 150, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {match.teamTwo?.name || 'TBD'}
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                    {match.scoreTeamTwo ?? '-'}
                </Typography>
            </Box>

            {/* Info et actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                <Box>
                    <Typography variant="caption" color="text.secondary">
                        {formatTime(match.matchTime)} {match.field ? `• Terrain ${match.field}` : ''}
                    </Typography>
                </Box>
                <Box>
                    {/* Boutons Démarrer/Arrêter */}
                    {!match.hasStarted && !match.hasEnded && (
                        <IconButton size="small" color="success" onClick={() => onStart(match.id)} title="Démarrer le match">
                            <PlayIcon fontSize="small" />
                        </IconButton>
                    )}
                    {match.hasStarted && !match.hasEnded && (
                        <IconButton size="small" color="warning" onClick={() => onEnd(match.id)} title="Terminer le match">
                            <StopIcon fontSize="small" />
                        </IconButton>
                    )}
                    <IconButton size="small" onClick={() => onEditScore(match)} title="Modifier le score">
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => onEditMatch(match)} title="Modifier le match">
                        <EditIcon fontSize="small" color="primary" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => onDelete(match.id)} title="Supprimer">
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>
        </Paper>
    );
};

BracketView.propTypes = {
    matchesByPhase: PropTypes.object.isRequired,
    phases: PropTypes.array.isRequired,
    getPhaseLabel: PropTypes.func.isRequired,
    formatTime: PropTypes.func.isRequired,
    onEditScore: PropTypes.func.isRequired,
    onEditMatch: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onStart: PropTypes.func.isRequired,
    onEnd: PropTypes.func.isRequired,
};

MatchCard.propTypes = {
    match: PropTypes.object.isRequired,
    formatTime: PropTypes.func.isRequired,
    onEditScore: PropTypes.func.isRequired,
    onEditMatch: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onStart: PropTypes.func.isRequired,
    onEnd: PropTypes.func.isRequired,
};

export default PhasesFinales;
