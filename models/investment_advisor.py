# Suggest investments
def suggest_investment_strategy(risk_profile, amount):
    """
    Suggests where to invest based on risk profile.

    Args:
        risk_profile (str): 'conservative', 'moderate', 'aggressive'
        amount (float): Amount to invest

    Returns:
        dict: Suggested asset allocation
    """
    allocation = {
        "conservative": {"FD/Bonds": 0.6, "Mutual Funds": 0.3, "Gold": 0.1},
        "moderate": {"Mutual Funds": 0.5, "Stocks": 0.3, "Gold": 0.2},
        "aggressive": {"Stocks": 0.6, "Mutual Funds": 0.3, "Crypto": 0.1},
    }

    if risk_profile not in allocation:
        return {"Error": "Invalid risk profile"}

    suggestion = {}
    for asset, ratio in allocation[risk_profile].items():
        suggestion[asset] = round(amount * ratio, 2)

    return suggestion