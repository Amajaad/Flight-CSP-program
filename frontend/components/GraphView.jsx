import { getDynamicColor } from "../utils/color";

export default function GraphView({ assignments }) {
  const canvasRef = React.useRef();

  React.useEffect(() => {
    if (!canvasRef.current || assignments.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get unique gates
    const gates = [...new Set(assignments.map(a => a.gate_id))];
    
    // Position nodes in a circle
    const radius = 150;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const positions = {};

    gates.forEach((gate, i) => {
      const angle = (i / gates.length) * 2 * Math.PI;
      positions[gate] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });

    // Draw edges (conflicts)
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 1;
    for (let i = 0; i < gates.length; i++) {
      for (let j = i + 1; j < gates.length; j++) {
        const gate1 = gates[i];
        const gate2 = gates[j];
        
        // Check if they conflict
        const flights1 = assignments.filter(a => a.gate_id === gate1);
        const flights2 = assignments.filter(a => a.gate_id === gate2);
        
        const hasConflict = flights1.some(f1 =>
          flights2.some(f2 =>
            f1.arrival < f2.departure && f2.arrival < f1.departure
          )
        );
        
        if (hasConflict) {
          ctx.beginPath();
          ctx.moveTo(positions[gate1].x, positions[gate1].y);
          ctx.lineTo(positions[gate2].x, positions[gate2].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes (gates)
    gates.forEach(gate => {
      const { x, y } = positions[gate];
      const color = getDynamicColor(gate);
      
      // Circle
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, 2 * Math.PI);
      ctx.fill();
      
      // Label
      ctx.fillStyle = "white";
      ctx.font = "bold 12px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(gate, x, y);
    });
  }, [assignments]);

  return (
    <div style={{ textAlign: "center" }}>
      <canvas
        ref={canvasRef}
        width={600}
        height={500}
        style={{ border: "1px solid #ddd", borderRadius: "4px" }}
      />
    </div>
  );
}