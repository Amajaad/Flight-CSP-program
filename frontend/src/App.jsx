import React, { useState } from "react";
import { Chart } from "react-google-charts";



function App() {
  const [assignments, setAssignments] = useState([]);
  const [chromaticNumber, setChromaticNumber] = useState(0);
  const [totalGates, setTotalGates] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("table");
  const [selectedScenario, setSelectedScenario] = useState("airport_data.json");
  

  

  const getDynamicColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      // A larger prime multiplier helps spread the hash values
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Use the Golden Ratio conjugate to jump around the color wheel
    const goldenRatioConjugate = 0.618033988749895;
    let h = Math.abs((hash * goldenRatioConjugate * 360) % 360);

    // Return HSL: (Hue, Saturation, Lightness)
    // 70% saturation and 45% lightness ensures colors are "bold" and white text pops
    return `hsl(${h}, 70%, 45%)`;
  };

  const handleSolve = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/solve?scenario=${selectedScenario}`);

      if (!response.ok) {
        let errBody = {};
        try {
          errBody = await response.json();
        } catch {
          // ignore parse errors
        }
        alert(`Server error: ${errBody.detail || response.statusText}`);
        return;
      }

      const data = await response.json();

      setAssignments(data.assignments || []);
      setChromaticNumber(data.chromatic_number ?? 0);
      setTotalGates(data.total_gates ?? 0);

      if (data.status === "error") {
        alert(
          `Constraint Error: This schedule requires at least ${data.chromatic_number} gates, but logical constraints might make it impossible with the current layout.`,
        );
      }
    } catch (err) {
      console.error(err);
      alert(
        "Network error communicating with backend. Is the backend running?",
      );
    } finally {
      setLoading(false);
    }
  };

  // --- Gantt Chart Data Preparation ---
  const ganttColumns = [
    { type: "string", label: "Flight ID" },
    { type: "string", label: "Gate" },
    { type: "string", label: "Resource" },
    { type: "date", label: "Start Date" },
    { type: "date", label: "End Date" },
    { type: "number", label: "Duration" },
    { type: "number", label: "Percent Complete" },
    { type: "string", label: "Dependencies" },
  ];

  const ganttRows = assignments.map((item) => {
    const [arrH, arrM] = item.arrival.split(":").map(Number);
    const [depH, depM] = item.departure.split(":").map(Number);

    return [
      item.flight_id,
      item.flight_id,
      item.gate_id,
      new Date(2026, 3, 23, arrH, arrM),
      new Date(2026, 3, 23, depH, depM),
      null,
      0,
      null,
    ];
  });

  const ganttData = [ganttColumns, ...ganttRows];

  return (
    <div className="container-fluid py-5 overflow-hidden">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h2 className="fw-bold text-secondary mb-2">Airport Gate System</h2>
        <section>
          <div className="d-flex gap-3 align-items-center mb-2">
                    {/* Scenario Selector */}
                    <select 
                      className="form-select w-auto" 
                      value={selectedScenario} 
                      onChange={(e) => setSelectedScenario(e.target.value)}
                    >
                      <option value="airport_data.json">Scenario 1: Normal</option>
                      <option value="airport_data_2.json">Scenario 2: Peak</option>
                      <option value="airport_data_3.json">Scenario 3: Restricted</option>
                    </select>
          
                    
                  </div>
        
        </section>
        <button
          className="btn btn-primary"
          onClick={handleSolve}
          disabled={loading}
        >
          {loading ? "Solving CSP..." : "Run Assignment"}
        </button>
      </div>

      <div className="row mb-4">
        <div className="col-md-6 mb-5">
          <div className="card bg-primary text-white p-3 shadow-sm">
            <h6 className="text-uppercase opacity-75">
              Minimum Gates Required
            </h6>
            <h2 className="display-4 fw-bold">{chromaticNumber}</h2>
            <p className="mb-0">Calculated via Sweep-line Algorithm</p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card bg-dark text-white p-3 shadow-sm">
            <h6 className="text-uppercase opacity-75">
              Physical Gates Available
            </h6>
            <h2 className="display-4 fw-bold">{totalGates}</h2>
            <p className="mb-0 text-info">
              {totalGates === 0
                ? "Run assignment to check capacity"
                : chromaticNumber > totalGates
                  ? "⚠️ Infrastructure Insufficient"
                  : "✅ Capacity Adequate"}
            </p>
          </div>
        </div>
      </div>

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
            disabled={assignments.length === 0}
          >
            Gantt Chart
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {activeTab === "table" && (
          <div className="card shadow-sm">
            <div className="card-body">
              {assignments.length > 0 ? (
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Flight</th>
                      <th>Gate</th>
                      <th>Terminal</th>
                      <th>Schedule</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map((a) => (
                      <tr key={a.flight_id}>
                        <td className="fw-bold">{a.flight_id}</td>
                        <td>
                          <span
                            className="badge p-2"
                            style={{
                              backgroundColor: getDynamicColor(a.gate_id),
                              color: "white",
                              minWidth: "60px",
                            }}
                          >
                            {a.gate_id}
                          </span>
                        </td>
                        <td>{a.terminal}</td>
                        <td>
                          <span className="text-muted">{a.arrival}</span>
                          <i className="bi bi-arrow-right mx-2"></i>
                          <span className="text-muted">{a.departure}</span>
                        </td>
                        <td>
                          <span className="badge rounded-pill bg-success-subtle text-success border border-success">
                            Assigned
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted">
                    No assignments yet. Click "Run Assignment" to solve the CSP.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "gantt" && assignments.length > 0 && (
          <div
            style={{ overflowX: "auto", overflowY: "auto", maxHeight: "600px" }}
          >
            <Chart
              chartType="Gantt"
              width="100%"
              height={`${assignments.length * 40 + 100}px`}
              data={ganttData}
              options={{
                height: assignments.length * 40 + 100,
                gantt: {
                  trackHeight: 40,
                  palette: [
                    { color: "#5e97f6", dark: "#2a56c6", light: "#c6dafc" },
                    { color: "#db4437", dark: "#a52714", light: "#f4c7c1" },
                    { color: "#f4b400", dark: "#ee8100", light: "#fce8b2" },
                    { color: "#0f9d58", dark: "#0b8043", light: "#b7e1cd" },
                    { color: "#ab47bc", dark: "#6a1b9a", light: "#e1bee7" },
                    { color: "#00acc1", dark: "#00838f", light: "#b2ebf2" },
                    { color: "#ff7043", dark: "#e64a19", light: "#ffccbc" },
                  ],
                  labelStyle: { fontSize: 14, color: "#333" },
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
