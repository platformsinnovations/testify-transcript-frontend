"use client";
import { RadialBarChart, RadialBar, Legend } from "recharts";

const data = [
  { name: "Blue", value: 30, fill: "#42A5F5" },
  { name: "Green", value: 30, fill: "#2ECC71" },
  { name: "Yellow", value: 30, fill: "#F5B041" },
  { name: "Red", value: 30, fill: "#E74C3C" },
];

export default function DonutChart() {
  return (
    <div className="flex justify-center items-center h-[300px]">
      <RadialBarChart
        width={300}
        height={300}
        cx="50%"
        cy="50%"
        innerRadius="30%"
        outerRadius="90%"
        barSize={40}
        data={data}
      >
        <RadialBar
          minAngle={15}
          background
          clockWise
          dataKey="value"
        />
        <Legend iconSize={10} layout="vertical" verticalAlign="middle" />
      </RadialBarChart>
    </div>
  );
}
