import json
from pathlib import Path
from typing import List, Tuple

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import Flight, Gate
from solver import calculate_min_gates, solve_csp

app = FastAPI(title="Airport Gate Assignment API")

# --- Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://flight-csp.netlify.app", 
        "http://localhost:3000", 
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Configuration ---
DATA_DIR = Path(__file__).parent / "data"

def load_scenario_data(scenario_name: str) -> Tuple[List[Flight], List[Gate]]:
    """
    Helper function to safely load flight and gate data from a JSON file.
    """
    # Security: prevent directory traversal by taking only the filename
    safe_name = Path(scenario_name).name
    data_path = DATA_DIR / safe_name

    if not data_path.exists():
        raise FileNotFoundError(f"Scenario file '{safe_name}' not found.")

    with open(data_path, "r") as f:
        raw = json.load(f)

    flights = [Flight(**fl) for fl in raw.get("flights", [])]
    gates = [Gate(**g) for g in raw.get("gates", [])]
    
    return flights, gates


@app.get("/solve")
async def assign_gates(scenario: str = "airport_data_3.json"):
    try:
        # Load data using the helper function
        flights, gates = load_scenario_data(scenario)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing data: {str(e)}")

    # Run the CSP Solver
    solution = solve_csp(flights, gates)
    min_required = calculate_min_gates(flights)

    if solution is None:
        raise HTTPException(
            status_code=422,
            detail={
                "error": "No valid assignment found.",
                "min_gates_required": min_required,
                "provided_gates": len(gates)
            }
        )

    # Format the response
    assignments = []
    for flight in flights:
        # Match the assigned gate ID back to its object to get terminal info
        gate_info = next((g for g in gates if g.gate_id == solution[flight.flight_id]), None)
        
        if gate_info:
            assignments.append({
                "flight_id": flight.flight_id,
                "gate_id": gate_info.gate_id,
                "terminal": gate_info.terminal,
                "arrival": flight.arrival,
                "departure": flight.departure,
                "aircraft_size": flight.aircraft_size,
                "airline": flight.airline,
            })

    return {
        "status": "success",
        "chromatic_number": min_required,
        "total_flights": len(flights),
        "total_gates": len(gates),
        "assignments": assignments,
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)