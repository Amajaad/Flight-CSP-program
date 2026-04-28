// Simple color palette
const COLOR_PALETTE = [
  "hsl(0, 70%, 45%)",      // Red
  "hsl(240, 70%, 45%)",    // Blue
  "hsl(120, 70%, 45%)",    // Green
  "hsl(60, 70%, 75%)",     // Yellow
  "hsl(300, 70%, 45%)",    // Magenta
  "hsl(180, 70%, 45%)",    // Cyan
  "hsl(30, 70%, 45%)",     // Orange
  "hsl(270, 10%, 45%)",    // Purple
];

let gateColors = {}; // Store gate -> color mapping

/**
 * Simple graph coloring: assign colors to gates so that 
 * gates with overlapping flights never have the same color
 */
export const setAssignmentsForColoring = (assignments) => {
  gateColors = {};
  
  // Get unique gates
  const uniqueGates = [...new Set(assignments.map(a => a.gate_id))];
  
  // For each gate, find which colors are already taken by conflicting gates
  uniqueGates.forEach(gate => {
    const usedColors = new Set();
    
    // Find all flights in this gate
    const gateFlights = assignments.filter(a => a.gate_id === gate);
    
    // For each other gate, check if they conflict
    uniqueGates.forEach(otherGate => {
      if (otherGate !== gate && gateColors[otherGate] !== undefined) {
        // Check if otherGate has any flights that overlap with this gate's flights
        const otherGateFlights = assignments.filter(a => a.gate_id === otherGate);
        
        const hasConflict = gateFlights.some(f1 =>
          otherGateFlights.some(f2 =>
            f1.arrival < f2.departure && f2.arrival < f1.departure
          )
        );
        
        if (hasConflict) {
          usedColors.add(gateColors[otherGate]);
        }
      }
    });
    
    // Find first available color
    let colorIndex = 0;
    while (usedColors.has(colorIndex)) {
      colorIndex++;
    }
    
    gateColors[gate] = colorIndex;
  });
};

/**
 * Get the color assigned to a gate
 */
export const getDynamicColor = (gateId) => {
  const colorIndex = gateColors[gateId] ?? 0;
  return COLOR_PALETTE[colorIndex % COLOR_PALETTE.length];
};