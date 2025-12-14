import itertools
from datetime import timedelta
from datetime import datetime, timedelta
from typing import List
import itertools

def generate_round_robin_matches(teams):
    team_ids = [team.id for team in teams]
    
    # Check if the number of teams is 4
    if len(team_ids) == 4:
        # Assign specific match order for four teams
        matches = [
            {'team_one_id': team_ids[0], 'team_two_id': team_ids[1]},  # A vs B
            {'team_one_id': team_ids[2], 'team_two_id': team_ids[3]},  # C vs D
            {'team_one_id': team_ids[0], 'team_two_id': team_ids[2]},  # A vs C
            {'team_one_id': team_ids[1], 'team_two_id': team_ids[3]},  # B vs D
            {'team_one_id': team_ids[0], 'team_two_id': team_ids[3]},  # A vs D
            {'team_one_id': team_ids[1], 'team_two_id': team_ids[2]},  # B vs C
        ]
    else:
        # For other numbers of teams, generate all combinations
        matches = []
        for team_one_id, team_two_id in itertools.combinations(team_ids, 2):
            matches.append({
                'team_one_id': team_one_id,
                'team_two_id': team_two_id,
            })

    return matches


from datetime import timedelta

## pools c'est tous les matches dans un tableau de tableau avec chaque tableau representant une poule 
from datetime import timedelta
from datetime import datetime, timedelta


def schedule_matches(pools: List[List[dict]], number_of_fields: int, match_length: int, start_time: datetime) -> List[dict]:
    """
    Schedules matches for a given set of pools starting from start_time.

    Args:
        pools: List of lists, where each sublist contains matches for a pool.
        number_of_fields: Number of fields available per time slot.
        match_length: Duration of each match in minutes.
        start_time: The starting datetime for scheduling.

    Returns:
        A list of scheduled match dictionaries containing 'match', 'time_slot', 'field', and 'pool'.
    """
    scheduled_matches = []
    current_time = start_time
    total_pools = len(pools)
    pool_order = list(range(total_pools))

    def matches_left() -> bool:
        return any(pool for pool in pools)

    while matches_left():
        # Start a new scheduling cycle
        cycle_matches_played = {p: 0 for p in pool_order}  # Matches played per pool in this cycle

        while True:
            # Check if the cycle is complete
            if all(
                (cycle_matches_played[p] >= 2 or len(pools[p]) == 0)
                for p in pool_order
            ):
                break  # Cycle complete

            fields_available = number_of_fields
            can_play_this_timeslot = False

            # Attempt to schedule matches in the current time slot
            for p in pool_order:
                if pools[p] and cycle_matches_played[p] < 2:
                    can_play_this_timeslot = True
                    matches_to_schedule = min(2 - cycle_matches_played[p], len(pools[p]), fields_available)

                    for _ in range(matches_to_schedule):
                        match = pools[p].pop(0)
                        field_number = number_of_fields - fields_available + 1
                        scheduled_matches.append({
                            'match': match,
                            'time_slot': current_time,
                            'field': field_number,
                            'pool': p + 1
                        })
                        cycle_matches_played[p] += 1
                        fields_available -= 1
                        if fields_available == 0:
                            break  # No more fields available in this time slot

                if fields_available == 0:
                    break  # Move to the next time slot

            # If no matches were scheduled in this time slot, exit the loop
            if not can_play_this_timeslot:
                break

            # Move to the next time slot
            current_time += timedelta(minutes=match_length)

        # Cycle complete, continue if there are matches left
    # Sort the scheduled matches by time_slot and field
    scheduled_matches.sort(key=lambda x: (x['time_slot'], x['field']))
    return scheduled_matches
