import { useState } from "react";

export const useAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [chromaticNumber, setChromaticNumber] = useState(0);
  const [totalGates, setTotalGates] = useState(0);
  const [loading, setLoading] = useState(false);

  const solve = async (scenario) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://flight-csp-program.onrender.com/solve?scenario=${scenario}`,
      );
      const data = await res.json();

      setAssignments(data.assignments || []);
      setChromaticNumber(data.chromatic_number ?? 0);
      setTotalGates(data.total_gates ?? 0);

      return data;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    assignments,
    chromaticNumber,
    totalGates,
    loading,
    solve,
  };
};
