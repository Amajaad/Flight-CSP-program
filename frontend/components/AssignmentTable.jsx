import { getDynamicColor } from "../utils/color";

export default function AssignmentTable({ assignments }) {
  if (!assignments.length) {
    return <p className="text-center text-muted">No assignments yet.</p>;
  }

  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th>Flight</th>
          <th>Gate</th>
          <th>Terminal</th>
          <th>Schedule</th>
        </tr>
      </thead>
      <tbody>
        {assignments.map((a) => (
          <tr key={a.flight_id}>
            <td>{a.flight_id}</td>
            <td>
              <span
                className="badge"
                style={{ backgroundColor: getDynamicColor(a.gate_id) }}
              >
                {a.gate_id}
              </span>
            </td>
            <td>{a.terminal}</td>
            <td>{a.arrival} → {a.departure}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}