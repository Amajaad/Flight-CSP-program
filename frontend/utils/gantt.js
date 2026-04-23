export const buildGanttData = (assignments) => {
  const columns = [
    { type: "string", label: "Flight ID" },
    { type: "string", label: "Gate" },
    { type: "string", label: "Resource" },
    { type: "date", label: "Start Date" },
    { type: "date", label: "End Date" },
    { type: "number", label: "Duration" },
    { type: "number", label: "Percent Complete" },
    { type: "string", label: "Dependencies" },
  ];

  const rows = assignments.map((item) => {
    const [ah, am] = item.arrival.split(":").map(Number);
    const [dh, dm] = item.departure.split(":").map(Number);

    return [
      item.flight_id,
      item.flight_id,
      item.gate_id,
      new Date(2026, 3, 23, ah, am),
      new Date(2026, 3, 23, dh, dm),
      null,
      0,
      null,
    ];
  });

  return [columns, ...rows];
};