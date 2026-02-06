import { ApiTossConnected } from "./axios";

/**
 * Service pour gérer les paris
 */

// Récupérer les cotes d'un match
export const getMatchOdds = async (matchId) => {
  const response = await ApiTossConnected.get(`/bet/odds/${matchId}`);
  return response.data;
};

// Placer un pari
export const placeBet = async (betData) => {
  const response = await ApiTossConnected.post('/bet/place', betData);
  return response.data;
};

// Récupérer mes paris
export const getMyBets = async () => {
  const response = await ApiTossConnected.get('/bet/my-bets');
  return response.data;
};

// Récupérer le classement
export const getLeaderboard = async (limit = 50) => {
  const response = await ApiTossConnected.get(`/bet/leaderboard?limit=${limit}`);
  return response.data;
};

// Récupérer les stats d'un match
export const getMatchBettingStats = async (matchId) => {
  const response = await ApiTossConnected.get(`/bet/match/${matchId}/stats`);
  return response.data;
};

// Récupérer les infos de l'utilisateur connecté (pour betPoints)
export const getCurrentUser = async () => {
  const response = await ApiTossConnected.get('/users/me');
  return response.data;
};

// Récupérer le rang de l'utilisateur dans le classement
export const getUserRank = async () => {
  const leaderboard = await getLeaderboard(1000); // Récupérer tout le classement
  const currentUser = await getCurrentUser();
  const userRank = leaderboard.findIndex(u => u.userId === currentUser.id) + 1;
  return userRank || null; // null si non classé
};
