import requests
from datetime import datetime
from collections import defaultdict

# ----------------------------
# Configuration
# ----------------------------
USERNAME = "<your_chesscom_username>"
EMAIL = "<your-email>"
YEAR = 2025
MONTH = 12

API_URL = f"https://api.chess.com/pub/player/{USERNAME}/games/{YEAR}/{MONTH:02d}"

HEADERS = {
    "User-Agent": f"games-retriever/1.2 (username: ${USERNAME}; contact: ${EMAIL})"
}

# ----------------------------
# Helper functions
# ----------------------------
def get_game_result(game: str, username: str):
    """
    Returns +1 for win, 0 for draw, -1 for loss
    from the perspective of 'username'.
    """
    username = username.lower()

    if game["white"]["username"].lower() == username:
        result = game["white"]["result"]
        opponent_result = game["black"]["result"]
    else:
        result = game["black"]["result"]
        opponent_result = game["white"]["result"]

    if result == "win":
        return 1
    elif opponent_result == "win":
        return -1
    else:
        return 0  # draw or other non-win result


def calculate_performance(wins, draws, losses):
    total = wins + draws + losses
    if total == 0:
        return 0
    return max(-10, min(10, round(10 * (wins - losses) / total)))


# ----------------------------
# Fetch games
# ----------------------------
response = requests.get(API_URL, headers=HEADERS)
response.raise_for_status()

games = response.json().get("games", [])

# ----------------------------
# Group games by day
# ----------------------------
daily_stats = defaultdict(lambda: {"wins": 0, "draws": 0, "losses": 0})

for game in games:
    # Use end_time for daily grouping
    day = datetime.utcfromtimestamp(game["end_time"]).strftime("%Y-%m-%d")

    result = get_game_result(game, USERNAME)

    if result == 1:
        daily_stats[day]["wins"] += 1
    elif result == -1:
        daily_stats[day]["losses"] += 1
    else:
        daily_stats[day]["draws"] += 1

# ----------------------------
# Output results
# ----------------------------
print(f"Daily performance for {USERNAME} ({YEAR}-{MONTH:02d})\n")

for day in sorted(daily_stats.keys()):
    w = daily_stats[day]["wins"]
    d = daily_stats[day]["draws"]
    l = daily_stats[day]["losses"]

    performance = calculate_performance(w, d, l)

    print(
        f"{day}: "
        f"W={w}, D={d}, L={l} → Performance = {performance:+d}"
    )
