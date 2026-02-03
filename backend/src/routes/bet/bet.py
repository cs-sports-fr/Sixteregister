from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
from infra.prisma import getPrisma
from routes.auth.utils import check_token, check_admin, check_user
from routes.bet.utils import calculate_odds, calculate_bet_points, get_winner_from_score
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
    pointsBet: int  # Nombre de points misés
    predictedScoreTeamOne: Optional[int] = None
    predictedScoreTeamTwo: Optional[int] = None


class BetResponse(BaseModel):
    id: int
    matchId: int
    predictedWinner: str
    pointsBet: int
    predictedScoreTeamOne: Optional[int]
    predictedScoreTeamTwo: Optional[int]
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
        "minBet": 10,
        "maxBet": 500
    }


@bets_router.get("/odds/{match_id}")
async def get_match_odds(match_id: int):
    """Récupérer les cotes actuelles d'un match."""
    match = await prisma.match.find_unique(
        where={"id": match_id},
        include={"bets": True}
    )
    
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    # Compter les paris par prédiction
    bets_team_one = sum(1 for b in match.bets if b.predictedWinner == "TeamOne")
    bets_team_two = sum(1 for b in match.bets if b.predictedWinner == "TeamTwo")
    bets_draw = sum(1 for b in match.bets if b.predictedWinner == "Draw")
    
    odds = calculate_odds(bets_team_one, bets_team_two, bets_draw)
    
    return {
        "matchId": match_id,
        "odds": odds,
        "totalBets": len(match.bets),
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
    
    # Vérifier la mise
    MIN_BET = 10
    MAX_BET = 500
    
    if bet_data.pointsBet < MIN_BET:
        raise HTTPException(status_code=400, detail=f"La mise minimum est de {MIN_BET} points")
    
    if bet_data.pointsBet > MAX_BET:
        raise HTTPException(status_code=400, detail=f"La mise maximum est de {MAX_BET} points")
    
    # Récupérer les points actuels de l'utilisateur
    user = await prisma.user.find_unique(where={"id": user_id})
    if not user or user.betPoints < bet_data.pointsBet:
        raise HTTPException(status_code=400, detail=f"Solde insuffisant. Vous avez {user.betPoints if user else 0} points")
    
    # Vérifier que le match existe et est ouvert aux paris
    match = await prisma.match.find_unique(
        where={"id": bet_data.matchId},
        include={"bets": True}
    )
    
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    # Vérifier que le match n'a pas commencé
    if match.hasStarted:
        raise HTTPException(status_code=400, detail="Cannot bet on a match that has started")
    
    # Vérifier que les paris sont encore ouverts (5 min avant le match)
    # betting_deadline = match.matchTime - timedelta(minutes=5)
    # if datetime.now() > betting_deadline:
    #     raise HTTPException(status_code=400, detail="Betting is closed for this match")
    
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
    
    # Calculer les cotes actuelles pour snapshot
    bets_team_one = sum(1 for b in match.bets if b.predictedWinner == "TeamOne")
    bets_team_two = sum(1 for b in match.bets if b.predictedWinner == "TeamTwo")
    bets_draw = sum(1 for b in match.bets if b.predictedWinner == "Draw")
    
    # Ajouter le nouveau pari au compte
    if bet_data.predictedWinner == "TeamOne":
        bets_team_one += 1
    elif bet_data.predictedWinner == "TeamTwo":
        bets_team_two += 1
    else:
        bets_draw += 1
    
    odds = calculate_odds(bets_team_one, bets_team_two, bets_draw)
    
    # Déduire les points misés du solde de l'utilisateur
    await prisma.user.update(
        where={"id": user_id},
        data={"betPoints": {"decrement": bet_data.pointsBet}}
    )
    
    # Créer le pari
    new_bet = await prisma.bet.create(
        data={
            "userId": user_id,
            "matchId": bet_data.matchId,
            "predictedWinner": bet_data.predictedWinner,
            "pointsBet": bet_data.pointsBet,
            "predictedScoreTeamOne": bet_data.predictedScoreTeamOne,
            "predictedScoreTeamTwo": bet_data.predictedScoreTeamTwo,
            "oddsSnapshotTeamOne": odds["teamOne"],
            "oddsSnapshotTeamTwo": odds["teamTwo"],
            "oddsSnapshotDraw": odds["draw"],
        }
    )
    
    return {
        **new_bet.model_dump(),
        "newBalance": user.betPoints - bet_data.pointsBet
    }


@bets_router.get("/my-bets")
async def get_my_bets(current_user: User = Depends(check_user)):
    """Récupérer tous les paris de l'utilisateur connecté."""
    bets = await prisma.bet.find_many(
        where={"userId": current_user.id},
        include={
            "match": {
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


@bets_router.post("/resolve/{match_id}", dependencies=[Depends(check_admin)])
async def resolve_match_bets(match_id: int):
    """
    Résoudre tous les paris d'un match terminé.
    Appelé automatiquement ou manuellement après la fin du match.
    
    Calcul des gains:
    - Si correct: mise × cote (ex: 50 points × 2.5 = 125 points)
    - Si incorrect: 0 points (la mise a déjà été déduite)
    - Bonus score exact: +50% de la mise
    """
    match = await prisma.match.find_unique(
        where={"id": match_id},
        include={"bets": {"where": {"isResolved": False}}}
    )
    
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    if match.scoreTeamOne is None or match.scoreTeamTwo is None:
        raise HTTPException(status_code=400, detail="Match score not set")
    
    actual_winner = get_winner_from_score(match.scoreTeamOne, match.scoreTeamTwo)
    
    resolved_count = 0
    total_points_distributed = 0
    
    for bet in match.bets:
        # Déterminer la cote utilisée (snapshot au moment du pari)
        if bet.predictedWinner == "TeamOne":
            odds = bet.oddsSnapshotTeamOne or 2.0
        elif bet.predictedWinner == "TeamTwo":
            odds = bet.oddsSnapshotTeamTwo or 2.0
        else:
            odds = bet.oddsSnapshotDraw or 3.0
        
        is_correct = (bet.predictedWinner == actual_winner)
        points = 0
        
        if is_correct:
            # Gain = mise × cote
            points = int(bet.pointsBet * odds)
            
            # Bonus score exact: +50% de la mise
            if (bet.predictedScoreTeamOne == match.scoreTeamOne and 
                bet.predictedScoreTeamTwo == match.scoreTeamTwo):
                points += int(bet.pointsBet * 0.5)
        
        # Mettre à jour le pari
        await prisma.bet.update(
            where={"id": bet.id},
            data={
                "pointsWon": points,
                "isResolved": True,
                "isCorrect": is_correct,
            }
        )
        
        # Ajouter les points gagnés à l'utilisateur
        if points > 0:
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


@bets_router.get("/match/{match_id}/stats")
async def get_match_betting_stats(match_id: int):
    """Statistiques de paris sur un match (pour affichage public)."""
    match = await prisma.match.find_unique(
        where={"id": match_id},
        include={"bets": True}
    )
    
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    total_bets = len(match.bets)
    bets_team_one = sum(1 for b in match.bets if b.predictedWinner == "TeamOne")
    bets_team_two = sum(1 for b in match.bets if b.predictedWinner == "TeamTwo")
    bets_draw = sum(1 for b in match.bets if b.predictedWinner == "Draw")
    
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