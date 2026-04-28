import { useState, useMemo } from "react";
import { useAssignments } from "../hooks/useAssignments";
import AssignmentTable from "../components/AssignmentTable";
import ConflictMatrix from "../components/ConflictMatrix";
import GanttView from "../components/GanttView";
import { buildGanttData } from "../utils/gantt";
import { setAssignmentsForColoring } from "../utils/color";

function App() {
  const [scenario, setScenario] = useState("airport_data.json");
  const [activeTab, setActiveTab] = useState("table");

  const { assignments, chromaticNumber, totalGates, loading, solve } =
    useAssignments();

  const handleSolve = async () => {
    try {
      const data = await solve(scenario);

      if (data.status === "error") {
        alert(
          `Constraint Error: Needs at least ${data.chromatic_number} gates.`,
        );
      } else if (data.assignments && data.assignments.length > 0) {
        // Initialize graph coloring with assignments
        setAssignmentsForColoring(data.assignments);
      }
    } catch {
      alert("Backend error");
    }
  };

  // memoized derived data
  const ganttData = useMemo(() => buildGanttData(assignments), [assignments]);

  return (
    <div className="container-fluid py-5">
      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h2 className="fw-bold text-secondary">Airport Gate System</h2>

        <div className="d-flex gap-3 align-items-center">
          <select
            className="form-select w-auto"
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
          >
            <option value="airport_data.json">Scenario 1: Normal</option>
            <option value="airport_data_2.json">Scenario 2: Peak</option>
            <option value="airport_data_3.json">Scenario 3: Restricted</option>
          </select>

          <button
            className="btn btn-primary"
            onClick={handleSolve}
            disabled={loading}
          >
            {loading ? "Solving CSP..." : "Run Assignment"}
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="card bg-primary text-white p-3 shadow-sm">
            <h6 className="text-uppercase opacity-75">
              Minimum Gates Required
            </h6>
            <h2 className="display-5 fw-bold">{chromaticNumber}</h2>
            <small>Sweep-line Algorithm</small>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card bg-dark text-white p-3 shadow-sm">
            <h6 className="text-uppercase opacity-75">
              Physical Gates Available
            </h6>
            <h2 className="display-5 fw-bold">{totalGates}</h2>
            <small className="text-info">
              {totalGates === 0
                ? "Run assignment to check"
                : chromaticNumber > totalGates
                  ? "⚠️ Insufficient"
                  : "✅ Adequate"}
            </small>
          </div>
        </div>
      </div>

      {/* TABS */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "table" ? "active" : ""}`}
            onClick={() => setActiveTab("table")}
          >
            Data Table
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "gantt" ? "active" : ""}`}
            onClick={() => setActiveTab("gantt")}
            disabled={!assignments.length}
          >
            Gantt Chart
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "matrix" ? "active" : ""}`}
            onClick={() => setActiveTab("matrix")}
            disabled={!assignments.length}
          >
            Conflict Matrix
          </button>
        </li>
      </ul>

      {/* TAB CONTENT */}
      <div className="tab-content">
        {/* TABLE */}
        {activeTab === "table" && (
          <div className="card shadow-sm">
            <div className="card-body">
              <AssignmentTable assignments={assignments} />
            </div>
          </div>
        )}

        {/* GANTT */}
        {activeTab === "gantt" && assignments.length > 0 && (
          <div className="card shadow-sm">
            <div className="card-body" style={{ overflow: "auto" }}>
              <GanttView data={ganttData} count={assignments.length} />
            </div>
          </div>
        )}

        {/* MATRIX */}
        {activeTab === "matrix" && assignments.length > 0 && (
          <div className="card shadow-sm">
            <div className="card-body">
            
              <ConflictMatrix assignments={assignments} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
