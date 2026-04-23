from pydantic import BaseModel
from typing import List

class Flight(BaseModel):
    flight_id: str
    arrival: str
    departure: str
    aircraft_size: str
    airline: str


class Gate(BaseModel):
    gate_id: str
    max_size: str
    terminal: str


class GateAssignmentRequest(BaseModel):
    flights: List[Flight]
    gates: List[Gate]