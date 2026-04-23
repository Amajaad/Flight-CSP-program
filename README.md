This is a structured `README.md` designed specifically for a software engineering portfolio. It highlights the technical stack, the mathematical theory behind the CSP, and clear instructions for setup.

---

# ✈️ Airport Gate Assignment System (CSP Solver)

A full-stack application developed to solve the **Airport Gate Assignment Problem** using Constraint Satisfaction Problem (CSP) techniques and Graph Theory. The system optimizes airport infrastructure usage by resolving schedule overlaps while respecting physical aircraft size constraints.

## 🚀 Key Features

* **CSP Backtracking Solver:** A Python-based backend that resolves overlaps in flight grounding times.
* **Chromatic Number Calculation:** Implements a Sweep-line algorithm to determine the theoretical minimum number of gates ($\chi(G)$) required for a schedule.
* **Dual-View Frontend:** A React-based interface featuring a data-rich table and an interactive, color-coded Gantt chart.
* **Constraint Engine:** Handles both binary constraints (time overlaps) and unary constraints (aircraft size vs. gate capacity).

---

## 🏗️ Architecture & Technology Stack

The project uses a **Monorepo** structure to separate the computational engine from the presentation layer.

### Backend (FastAPI)
* **Language:** Python 3.10+
* **Algorithm:** Backtracking Search with recursive consistency checking.
* **Theory:** Interval Graph modeling for overlap detection.

### Frontend (React)
* **UI Framework:** React with Bootstrap 5 for responsive design.
* **Visualization:** `react-google-charts` for dynamic Gantt rendering.
* **State Management:** Functional components with `useState` and `useEffect`.

---

## 🛠️ Installation & Setup

### 1. Backend Setup
```bash
cd backend
# Install dependencies
pip install fastapi uvicorn pydantic
# Start the server
python main.py
```
The FastAPI server will run at `http://localhost:8000`.

### 2. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install
npm install react-google-charts
# Start the React app
npm start
```
The application will open automatically at `http://localhost:3000`.

---

## 📊 Mathematical Logic

This system treats airport logistics as a **Graph Coloring Problem**:

1.  **Nodes ($V$):** Each flight in the schedule.
2.  **Edges ($E$):** An edge exists between two nodes if their time intervals $[Arrival, Departure]$ overlap.
3.  **Colors ($C$):** The available physical gates.

The solver finds a valid assignment such that for every edge $(u, v) \in E$, the color assigned to $u$ is different from the color assigned to $v$, while also ensuring the physical size of the aircraft is $\le$ the gate's maximum capacity.

The **Chromatic Number** ($\chi(G)$) displayed in the dashboard represents the "Peak Occupancy"—the absolute minimum number of gates needed to avoid delays for that specific day.

---

## 📂 Project Structure

```text
airport-gate-project/
├── backend/
│   ├── main.py            # FastAPI server & CSP Solver logic
│   └── airport_data.json  # Input dataset (Flights & Gates)
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main UI, Tab logic & API integration
│   │   └── main.jsx       # React entry point
│   ├── package.json       # JS dependencies
│   └── ... 
└── README.md              # Project documentation
```

---

## 🎓 Academic Context
Developed as a technical project to analyze the impact of scheduling on **Capital Expenditure (CAPEX)** for airport terminals. By identifying the chromatic number, airport authorities can optimize construction costs by matching physical infrastructure to mathematical necessity.
