import json
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import Flight, Gate
from solver import calculate_min_gates, solve_csp

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://flight-csp.netlify.app"
    ],  # In production, replace "*" with your React URL
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_PATH = Path(__file__).parent / "data" / "airport_data_3.json"


def load_data():
    with open(DATA_PATH, "r") as f:
        raw = json.load(f)
    flights = [Flight(**fl) for fl in raw["flights"]]
    gates = [Gate(**g) for g in raw["gates"]]
    return flights, gates


@app.get("/solve")
async def assign_gates(scenario: str = "airport_data.json"):
    # Security check: Ensure the file stays within the data directory
    safe_name = Path(scenario).name
    data_path = Path(__file__).parent / "data" / safe_name

    if not data_path.exists():
        raise HTTPException(status_code=404, detail="Scenario file not found")

    with open(data_path, "r") as f:
        raw = json.load(f)

    flights = [Flight(**fl) for fl in raw["flights"]]
    gates = [Gate(**g) for g in raw["gates"]]

    solution = solve_csp(flights, gates)
    min_required = calculate_min_gates(flights)

    if solution is None:
        raise HTTPException(
            status_code=422,
            detail=f"No valid assignment found. Minimum gates required: {min_required}",
        )

    # These must be indented inside the function
    result = []
    for flight in flights:
        gate_info = next(g for g in gates if g.gate_id == solution[flight.flight_id])
        result.append(
            {
                "flight_id": flight.flight_id,
                "gate_id": gate_info.gate_id,
                "terminal": gate_info.terminal,
                "arrival": flight.arrival,
                "departure": flight.departure,
                "aircraft_size": flight.aircraft_size,
                "airline": flight.airline,
            }
        )

    return {
        "status": "success",
        "chromatic_number": min_required,
        "total_flights": len(flights),
        "total_gates": len(gates),
        "assignments": result,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
