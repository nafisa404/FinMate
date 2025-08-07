# CAGR + ROI
def calculate_roi(initial, current):
    """
    ROI = (Current - Initial) / Initial * 100
    """
    try:
        roi = ((current - initial) / initial) * 100
        return round(roi, 2)
    except ZeroDivisionError:
        return 0.0

def calculate_cagr(initial_value, final_value, years):
    """
    Compound Annual Growth Rate
    Formula: ((FV / PV) ** (1/n)) - 1
    """
    try:
        cagr = ((final_value / initial_value) ** (1 / years)) - 1
        return round(cagr * 100, 2)
    except (ZeroDivisionError, ValueError):
        return 0.0