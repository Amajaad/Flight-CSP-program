import { Chart } from "react-google-charts";

export default function GanttView({ data, count }) {
  return (
    <Chart
      chartType="Gantt"
      width="100%"
      height={`${count * 40 + 100}px`}
      data={data}
      options={{
        gantt: {
          trackHeight: 40,
        },
      }}
    />
  );
}