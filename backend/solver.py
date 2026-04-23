from models import Flight, Gate
from utils import is_overlapping, can_fit

def solve_csp(flights, gates):
    assignments = {}

    def is_consistent(flight, gate, current_assignments):
        # 1. Size Constraint
        if not can_fit(flight.aircraft_size, gate.max_size):
            return False

        # 2. Overlap Constraint (Binary Constraint)
        for assigned_flight_id, assigned_gate_id in current_assignments.items():
            if assigned_gate_id == gate.gate_id:
                # Find the flight object for the assigned ID
                assigned_flight = next(
                    f for f in flights if f.flight_id == assigned_flight_id
                )
                if is_overlapping(flight, assigned_flight):
                    return False
        return True

    def backtrack(flight_idx):
        if flight_idx == len(flights):
            return True

        current_flight = flights[flight_idx]

        # Try assigning each gate to the current flight
        for gate in gates:
            if is_consistent(current_flight, gate, assignments):
                assignments[current_flight.flight_id] = gate.gate_id

                if backtrack(flight_idx + 1):
                    return True

                # Backtrack if assignment didn't lead to a solution
                del assignments[current_flight.flight_id]

        return False

    if backtrack(0):
        return assignments
    return None


# --- API Endpoints ---


def calculate_min_gates(flights):
    events = []
    for f in flights:
        # Convert "HH:MM" to total minutes
        arr = int(f.arrival.split(':')[0]) * 60 + int(f.arrival.split(':')[1])
        dep = int(f.departure.split(':')[0]) * 60 + int(f.departure.split(':')[1])
        events.append((arr, 1))   # Plane arrived
        events.append((dep, -1))  # Plane left
    
    # Sort: arrivals first if times are equal
    events.sort(key=lambda x: (x[0], -x[1])) 

    max_active = 0
    current_active = 0
    for _, change in events:
        current_active += change
        max_active = max(max_active, current_active)
            
    return max_active
