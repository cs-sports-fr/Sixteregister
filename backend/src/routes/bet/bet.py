from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
from infra.prisma import getPrisma
from routes.auth.utils import check_token, check_admin, check_user
from routes.bet.utils import calculate_odds, calculate_bet_points_with_stake, get_winner_from_score
from prisma.models import User

bets_router = APIRouter(
    prefix="/bet",
    tags=["bet"],
    dependencies=[Depends(check_token)],
)
prisma = getPrisma()


# ==================== SCHEMAS ====================

class BetCreate(BaseModel):
    matchId: int
    predictedWinner: str  # "TeamOne", "TeamTwo", "Draw"
    predictedScoreTeamOne: Optional[int] = None
    predictedScoreTeamTwo: Optional[int] = None
    stake: int = 10  # Mise par défaut de 10 crédits


class BetResponse(BaseModel):
    id: int
    matchId: int
    predictedWinner: str
    predictedScoreTeamOne: Optional[int]
    predictedScoreTeamTwo: Optional[int]
    stake: int
    pointsWon: int
    isResolved: bool
    isCorrect: Optional[bool]
    oddsSnapshotTeamOne: Optional[float]
    oddsSnapshotTeamTwo: Optional[float]
    oddsSnapshotDraw: Optional[float]


# ==================== ROUTES ====================

@bets_router.get("/balance")
async def get_balance(current_user: User = Depends(check_user)):
    """Récupérer le solde de points de paris de l'utilisateur."""
    user = await prisma.user.find_unique(where={"id": current_user.id})
    return {
        "userId": current_user.id,
        "betPoints": user.betPoints if user else 0,
    }


@bets_router.get("/odds/{match_id}")
async def get_match_odds(match_id: int):
    """Récupérer les cotes actuelles d'un match."""
    match = await prisma.match.find_unique(
        where={"id": match_id}
    )
    
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    # Récupérer les paris du match séparément
    match_bets = await prisma.bet.find_many(where={"matchId": match_id})
    
    # Compter les paris par prédiction
    bets_team_one = sum(1 for b in match_bets if b.predictedWinner == "TeamOne")
    bets_team_two = sum(1 for b in match_bets if b.predictedWinner == "TeamTwo")
    bets_draw = sum(1 for b in match_bets if b.predictedWinner == "Draw")
    
    odds = calculate_odds(bets_team_one, bets_team_two, bets_draw)
    
    return {
        "matchId": match_id,
        "odds": odds,
        "totalBets": len(match_bets),
        "distribution": {
            "teamOne": bets_team_one,
            "teamTwo": bets_team_two,
            "draw": bets_draw,
        }
    }


@bets_router.post("/place")
async def place_bet(bet_data: BetCreate, current_user: User = Depends(check_user)):
    """Placer un pari sur un match."""
    
    # Récupérer l'utilisateur connecté (avec son ID)
    user_id = current_user.id
    
    # Récupérer l'utilisateur pour vérifier son solde
    user = await prisma.user.find_unique(where={"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Vérifier que la mise est valide
    if bet_data.stake <= 0:
        raise HTTPException(status_code=400, detail="Stake must be positive")
    
    if bet_data.stake > user.betPoints:
        raise HTTPException(status_code=400, detail="Insufficient credits. You have {} credits but tried to bet {}".format(user.betPoints, bet_data.stake))
    
    # Vérifier que le match existe et est ouvert aux paris
    match = await prisma.match.find_unique(
        where={"id": bet_data.matchId}
    )
    
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    # Vérifier que le match n'a pas commencé
    if match.hasStarted:
        raise HTTPException(status_code=400, detail="Cannot bet on a match that has started")
    
    # Vérifier que l'utilisateur n'a pas déjà parié sur ce match
    existing_bet = await prisma.bet.find_unique(
        where={
            "userId_matchId": {
                "userId": user_id,
                "matchId": bet_data.matchId
            }
        }
    )
    
    if existing_bet:
        raise HTTPException(status_code=400, detail="You already placed a bet on this match")
    
    # Récupérer les paris existants pour calculer les cotes
    match_bets = await prisma.bet.find_many(where={"matchId": bet_data.matchId})
    
    # Calculer les cotes actuelles pour snapshot
    bets_team_one = sum(1 for b in match_bets if b.predictedWinner == "TeamOne")
    bets_team_two = sum(1 for b in match_bets if b.predictedWinner == "TeamTwo")
    bets_draw = sum(1 for b in match_bets if b.predictedWinner == "Draw")
    
    # Ajouter le nouveau pari au compte
    if bet_data.predictedWinner == "TeamOne":
        bets_team_one += 1
    elif bet_data.predictedWinner == "TeamTwo":
        bets_team_two += 1
    else:
        bets_draw += 1
    
    odds = calculate_odds(bets_team_one, bets_team_two, bets_draw)
    
    # Déduire la mise du solde de l'utilisateur
    await prisma.user.update(
        where={"id": user_id},
        data={"betPoints": {"decrement": bet_data.stake}}
    )
    
    # Créer le pari
    new_bet = await prisma.bet.create(
        data={
            "userId": user_id,
            "matchId": bet_data.matchId,
            "predictedWinner": bet_data.predictedWinner,
            "predictedScoreTeamOne": bet_data.predictedScoreTeamOne,
            "predictedScoreTeamTwo": bet_data.predictedScoreTeamTwo,
            "stake": bet_data.stake,
            "oddsSnapshotTeamOne": odds["teamOne"],
            "oddsSnapshotTeamTwo": odds["teamTwo"],
            "oddsSnapshotDraw": odds["draw"],
        }
    )
    
    # Récupérer le nouveau solde
    updated_user = await prisma.user.find_unique(where={"id": user_id})
    
    return {
        "id": new_bet.id,
        "matchId": new_bet.matchId,
        "predictedWinner": new_bet.predictedWinner,
        "predictedScoreTeamOne": new_bet.predictedScoreTeamOne,
        "predictedScoreTeamTwo": new_bet.predictedScoreTeamTwo,
        "stake": new_bet.stake,
        "oddsSnapshotTeamOne": new_bet.oddsSnapshotTeamOne,
        "oddsSnapshotTeamTwo": new_bet.oddsSnapshotTeamTwo,
        "oddsSnapshotDraw": new_bet.oddsSnapshotDraw,
        "newBalance": updated_user.betPoints,
        "message": "Bet placed successfully"
    }


@bets_router.get("/my-bets")
async def get_my_bets(current_user: User = Depends(check_user)):
    """Récupérer tous les paris de l'utilisateur connecté."""
    bets = await prisma.bet.find_many(
        where={"userId": current_user.id},
        include={
            "Match": {
                "include": {
                    "teamOne": {"include": {"school": True}},
                    "teamTwo": {"include": {"school": True}},
                }
            }
        },
        order={"createdAt": "desc"}
    )
    return bets


@bets_router.get("/leaderboard")
async def get_leaderboard(limit: int = 50):
    """Récupérer le classement des parieurs."""
    users = await prisma.user.find_many(
        where={"betPoints": {"gt": 0}},
        order={"betPoints": "desc"},
        take=limit,
        include={"school": True}
    )
    
    return [
        {
            "rank": i + 1,
            "userId": u.id,
            "name": f"{u.firstname} {u.lastname}",
            "school": u.school.name if u.school else None,
            "betPoints": u.betPoints,
        }
        for i, u in enumerate(users)
    ]


async def resolve_match_bets_internal(match_id: int):
    """
    Fonction interne pour résoudre les paris d'un match.
    Peut être appelée depuis d'autres modules sans authentification.
    
    Calcul des gains avec mise:
    - Mauvais gagnant: perd la mise
    - Bon gagnant: gagne mise × cote
    - Bonus score: % de la mise selon la proximité du score (jusqu'à +100%)
    """
    match = await prisma.match.find_unique(
        where={"id": match_id}
    )
    
    if not match:
        return {"error": "Match not found", "matchId": match_id}
    
    if match.scoreTeamOne is None or match.scoreTeamTwo is None:
        return {"error": "Match score not set", "matchId": match_id}
    
    # Récupérer les paris non résolus
    unresolved_bets = await prisma.bet.find_many(
        where={"matchId": match_id, "isResolved": False}
    )
    
    if not unresolved_bets:
        return {"matchId": match_id, "resolvedBets": 0, "message": "No unresolved bets"}
    
    actual_winner = get_winner_from_score(match.scoreTeamOne, match.scoreTeamTwo)
    
    resolved_count = 0
    total_points_distributed = 0
    
    for bet in unresolved_bets:
        # Déterminer la cote utilisée (snapshot au moment du pari)
        if bet.predictedWinner == "TeamOne":
            odds = bet.oddsSnapshotTeamOne or 2.0
        elif bet.predictedWinner == "TeamTwo":
            odds = bet.oddsSnapshotTeamTwo or 2.0
        else:
            odds = bet.oddsSnapshotDraw or 3.0
        
        is_correct = (bet.predictedWinner == actual_winner)
        
        # Récupérer la mise (défaut 10 si pas définie)
        stake = bet.stake if bet.stake else 10
        
        # Calculer les points avec le nouveau système basé sur la mise
        points = calculate_bet_points_with_stake(
            bet_prediction=bet.predictedWinner,
            predicted_score_one=bet.predictedScoreTeamOne,
            predicted_score_two=bet.predictedScoreTeamTwo,
            actual_winner=actual_winner,
            actual_score_one=match.scoreTeamOne,
            actual_score_two=match.scoreTeamTwo,
            odds=odds,
            stake=stake
        )
        
        # Mettre à jour le pari
        await prisma.bet.update(
            where={"id": bet.id},
            data={
                "pointsWon": points,
                "isResolved": True,
                "isCorrect": is_correct,
            }
        )
        
        # Ajouter les points gagnés à l'utilisateur (les points peuvent être négatifs si pari perdu)
        await prisma.user.update(
            where={"id": bet.userId},
            data={"betPoints": {"increment": points}}
        )
        total_points_distributed += points
        
        resolved_count += 1
    
    return {
        "matchId": match_id,
        "resolvedBets": resolved_count,
        "totalPointsDistributed": total_points_distributed,
        "actualWinner": actual_winner,
        "actualScore": f"{match.scoreTeamOne}-{match.scoreTeamTwo}"
    }


@bets_router.post("/resolve/{match_id}", dependencies=[Depends(check_admin)])
async def resolve_match_bets(match_id: int):
    """
    Résoudre tous les paris d'un match terminé (route admin).
    Appelé automatiquement ou manuellement après la fin du match.
    """
    result = await resolve_match_bets_internal(match_id)
    
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return result


@bets_router.get("/match/{match_id}/stats")
async def get_match_betting_stats(match_id: int):
    """Statistiques de paris sur un match (pour affichage public)."""
    match = await prisma.match.find_unique(
        where={"id": match_id}
    )
    
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    match_bets = await prisma.bet.find_many(where={"matchId": match_id})
    
    total_bets = len(match_bets)
    bets_team_one = sum(1 for b in match_bets if b.predictedWinner == "TeamOne")
    bets_team_two = sum(1 for b in match_bets if b.predictedWinner == "TeamTwo")
    bets_draw = sum(1 for b in match_bets if b.predictedWinner == "Draw")
    
    odds = calculate_odds(bets_team_one, bets_team_two, bets_draw)
    
    return {
        "matchId": match_id,
        "totalBets": total_bets,
        "odds": odds,
        "percentages": {
            "teamOne": round(bets_team_one / total_bets * 100, 1) if total_bets > 0 else 33.3,
            "teamTwo": round(bets_team_two / total_bets * 100, 1) if total_bets > 0 else 33.3,
            "draw": round(bets_draw / total_bets * 100, 1) if total_bets > 0 else 33.3,
        }
    }