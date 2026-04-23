import { getDynamicColor } from "../utils/color";

export default function ConflictMatrix({ assignments }) {
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-sm text-center">
        <thead>
          <tr>
            <th>#</th>
            {assignments.map((a) => (
              <th
                key={a.flight_id}
                style={{
                  backgroundColor: getDynamicColor(a.gate_id),
                  color: "white",
                }}
              >
                {a.flight_id}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {assignments.map((f1) => (
            <tr key={f1.flight_id}>
              <td className="fw-bold">{f1.flight_id}</td>

              {assignments.map((f2) => {
                const isSelf = f1.flight_id === f2.flight_id;
                const overlap =
                  f1.arrival < f2.departure &&
                  f2.arrival < f1.departure;

                return (
                  <td
                    key={f2.flight_id}
                    className={
                      isSelf
                        ? "bg-light"
                        : overlap
                        ? "bg-danger-subtle text-danger"
                        : "text-muted"
                    }
                  >
                    {isSelf ? "-" : overlap ? "1" : "0"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}