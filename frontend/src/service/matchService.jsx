import { ApiTossConnected } from "./axios";

// ==================== POOLS ====================

/**
 * Récupérer toutes les poules d'un sport
 */
export const getPoolsBySport = async (sportId) => {
    const response = await ApiTossConnected.get(`/pools/sport/${sportId}`);
    return response.data;
};

/**
 * Créer une nouvelle poule
 */
export const createPool = async (poolData) => {
    const response = await ApiTossConnected.post(`/pools/create-pool?name=${encodeURIComponent(poolData.name)}&sport_id=${poolData.sportId}`);
    return response.data;
};

/**
 * Supprimer une poule
 */
export const deletePool = async (poolId) => {
    const response = await ApiTossConnected.delete(`/pools/${poolId}`);
    return response.data;
};

/**
 * Assigner une équipe à une poule
 */
export const assignTeamToPool = async (teamId, poolId) => {
    const response = await ApiTossConnected.post(`/pools/update-team-pool/${teamId}/${poolId}`);
    return response.data;
};

/**
 * Retirer une équipe d'une poule
 */
export const removeTeamFromPool = async (teamId, poolId) => {
    const response = await ApiTossConnected.post(`/pools/remove-team-from-pool/${teamId}/${poolId}`);
    return response.data;
};

/**
 * Récupérer les classements d'un sport
 */
export const getRankings = async (sportId) => {
    const response = await ApiTossConnected.get(`/pools/rankings/${sportId}`);
    return response.data;
};

/**
 * Mettre à jour les paramètres d'une poule (lieu et créneau)
 */
export const updatePoolSettings = async (poolId, settings) => {
    const response = await ApiTossConnected.put(`/pools/${poolId}/settings`, settings);
    return response.data;
};

// ==================== PLACES ====================

/**
 * Récupérer tous les lieux
 */
export const getPlaces = async () => {
    const response = await ApiTossConnected.get('/places');
    return response.data;
};

// ==================== MATCHES ====================

/**
 * Récupérer tous les matchs d'un sport
 */
export const getMatchesBySport = async (sportId) => {
    const response = await ApiTossConnected.get(`/matches/${sportId}`);
    return response.data;
};

/**
 * Générer les matchs de poule pour un sport
 */
export const generatePoolMatches = async (sportId) => {
    const response = await ApiTossConnected.post(`/matches/generate/${sportId}`);
    return response.data;
};

/**
 * Créer un match manuellement
 */
export const createMatch = async (matchData) => {
    const response = await ApiTossConnected.post('/matches/create', matchData);
    return response.data;
};

/**
 * Mettre à jour le score d'un match
 */
export const updateMatchScore = async (matchId, scoreData) => {
    const response = await ApiTossConnected.put(`/matches/score/${matchId}`, scoreData);
    return response.data;
};

/**
 * Modifier un match (horaire, terrain, équipes)
 */
export const modifyMatch = async (matchId, matchData) => {
    const response = await ApiTossConnected.put(`/matches/modify/${matchId}`, matchData);
    return response.data;
};

/**
 * Supprimer un match
 */
export const deleteMatch = async (matchId) => {
    const response = await ApiTossConnected.delete(`/matches/${matchId}`);
    return response.data;
};

/**
 * Supprimer tous les matchs d'un sport
 */
export const deleteAllMatches = async (sportId) => {
    const response = await ApiTossConnected.delete(`/matches/all/${sportId}`);
    return response.data;
};

/**
 * Démarrer un match
 */
export const startMatch = async (matchId) => {
    const response = await ApiTossConnected.put(`/matches/start/${matchId}`);
    return response.data;
};

/**
 * Terminer un match
 */
export const endMatch = async (matchId) => {
    const response = await ApiTossConnected.put(`/matches/end/${matchId}`);
    return response.data;
};

/**
 * Résoudre les sources d'un match (pour phase finale)
 */
export const resolveMatchSources = async (matchId) => {
    const response = await ApiTossConnected.post(`/matches/resolve-sources/${matchId}`);
    return response.data;
};

/**
 * Récupérer les matchs de phase de poules d'une équipe
 */
export const getGroupStageMatchesByTeam = async (teamId) => {
    const response = await ApiTossConnected.get(`/matches/group-stage/team/${teamId}`);
    return response.data;
};

/**
 * Récupérer les matchs de phase finale d'une équipe
 */
export const getKnockoutMatchesByTeam = async (teamId) => {
    const response = await ApiTossConnected.get(`/matches/knockout/team/${teamId}`);
    return response.data;
};

// ==================== SPORTS ====================

/**
 * Récupérer un sport avec ses équipes
 */
export const getSportWithTeams = async (sportId) => {
    const response = await ApiTossConnected.get(`/sports/${sportId}`);
    return response.data;
};

/**
 * Récupérer tous les sports
 */
export const getAllSports = async () => {
    const response = await ApiTossConnected.get('/sports');
    return response.data;
};

// ==================== PLACES ====================

/**
 * Récupérer les places (terrains) d'un sport
 */
export const getPlacesBySport = async (sportId) => {
    const response = await ApiTossConnected.get(`/places/${sportId}`);
    return response.data;
};
