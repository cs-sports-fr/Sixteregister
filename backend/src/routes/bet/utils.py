from typing import Dict, Tuple
import math

def calculate_odds(bets_team_one: int, bets_team_two: int, bets_draw: int = 0) -> Dict[str, float]:
    """
    Calcule les cotes selon le système pari mutuel.
    
    La cote est inversement proportionnelle au pourcentage de paris.
    Plus une équipe est pariée, plus sa cote est basse.
    
    Formule: cote = total_paris / paris_sur_cette_option
    
    Exemple:
    - 100 paris total: 80 sur Team1, 15 sur Team2, 5 sur Draw
    - Cote Team1 = 100/80 = 1.25 (favori)
    - Cote Team2 = 100/15 = 6.67 (outsider)
    - Cote Draw  = 100/5  = 20.0 (très risqué)
    """
    total_bets = bets_team_one + bets_team_two + bets_draw
    
    # Cas où il n'y a pas encore de paris
    if total_bets == 0:
        return {
            "teamOne": 2.0,  # Cotes par défaut équilibrées
            "teamTwo": 2.0,
            "draw": 3.0,
        }
    
    # Ajouter un "floor" minimum pour éviter les cotes infinies
    MIN_BETS = 1  # Simule au moins 1 pari sur chaque option
    
    adjusted_team_one = max(bets_team_one, MIN_BETS)
    adjusted_team_two = max(bets_team_two, MIN_BETS)
    adjusted_draw = max(bets_draw, MIN_BETS)
    adjusted_total = adjusted_team_one + adjusted_team_two + adjusted_draw
    
    return {
        "teamOne": round(adjusted_total / adjusted_team_one, 2),
        "teamTwo": round(adjusted_total / adjusted_team_two, 2),
        "draw": round(adjusted_total / adjusted_draw, 2),
    }


def calculate_score_bonus(
    predicted_score_one: int | None,
    predicted_score_two: int | None,
    actual_score_one: int,
    actual_score_two: int,
) -> int:
    """
    Calcule le bonus de points basé sur la distance euclidienne entre le score prédit et le score réel.
    
    - Score parfait (distance = 0): +50 pts
    - Plus le score est proche, plus le bonus est élevé
    - Au-delà d'une distance de 5, pas de bonus
    
    Formule: bonus = max(0, 50 * (1 - distance / 5))
    
    Exemples:
    - Prédit 2-1, Réel 2-1 → distance=0 → +50 pts
    - Prédit 2-1, Réel 2-0 → distance=1 → +40 pts
    - Prédit 2-1, Réel 3-2 → distance=√2≈1.41 → +36 pts
    - Prédit 2-1, Réel 4-3 → distance=√8≈2.83 → +22 pts
    - Prédit 2-1, Réel 5-5 → distance=√25≈5 → +0 pts
    """
    if predicted_score_one is None or predicted_score_two is None:
        return 0
    
    # Calculer la distance euclidienne
    distance = math.sqrt(
        (predicted_score_one - actual_score_one) ** 2 + 
        (predicted_score_two - actual_score_two) ** 2
    )
    
    # Score parfait = gros bonus
    MAX_BONUS = 50
    MAX_DISTANCE = 5  # Au-delà de cette distance, pas de bonus
    
    if distance >= MAX_DISTANCE:
        return 0
    
    # Bonus linéaire décroissant
    bonus = int(MAX_BONUS * (1 - distance / MAX_DISTANCE))
    return bonus


def calculate_bet_points(
    bet_prediction: str,
    predicted_score_one: int | None,
    predicted_score_two: int | None,
    actual_winner: str,  # "TeamOne", "TeamTwo", "Draw"
    actual_score_one: int,
    actual_score_two: int,
    odds: float
) -> int:
    """
    Calcule les points gagnés pour un pari.
    
    Système de points:
    - Mauvais vainqueur: 0 points
    - Bon vainqueur: 10 * cote points
    - Bonus score: basé sur la distance euclidienne (jusqu'à +50 pts pour score exact)
    """
    # Vérifier si le vainqueur prédit est correct
    if bet_prediction != actual_winner:
        return 0  # Mauvaise prédiction = 0 points
    
    # Points de base * cote
    BASE_POINTS = 10
    points = int(BASE_POINTS * odds)
    
    # Bonus pour le score (basé sur la distance euclidienne)
    score_bonus = calculate_score_bonus(
        predicted_score_one, 
        predicted_score_two, 
        actual_score_one, 
        actual_score_two
    )
    points += score_bonus
    
    return points


def get_winner_from_score(score_one: int, score_two: int) -> str:
    """Détermine le vainqueur à partir du score."""
    if score_one > score_two:
        return "TeamOne"
    elif score_two > score_one:
        return "TeamTwo"
    else:
        return "Draw"