from datetime import datetime

# --- Helper Functions ---


def parse_time(time_str: str):
    return datetime.strptime(time_str, "%H:%M")


def is_overlapping(f1 , f2) -> bool:
    """Returns True if two flight grounding intervals overlap."""
    s1, e1 = parse_time(f1.arrival), parse_time(f1.departure)
    s2, e2 = parse_time(f2.arrival), parse_time(f2.departure)
    return s1 < e2 and s2 < e1


def can_fit(flight_size: str, gate_max_size: str) -> bool:
    """Checks if the aircraft size fits the gate capacity."""
    size_map = {"Small": 1, "Medium": 2, "Large": 3}
    return size_map[gate_max_size] >= size_map[flight_size]