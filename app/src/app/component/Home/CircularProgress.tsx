"use client";

import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

const CircularProgress = ({ remainingHours }: { remainingHours: number }) => {
  const totalHours = 8; // Define total hours
  const progress = ((totalHours - remainingHours) / totalHours) * 100;

  const data = [{ name: "Progress", value: progress, fill: "#007bff" }];

  return (
    <div className="lg:h-[275px] bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col items-center lg:mt-4">
      <h2 className="text-lg font-semibold text-gray-700">Daily Progress</h2>
      <RadialBarChart
        width={160}
        height={160}
        innerRadius="80%"
        outerRadius="100%"
        barSize={10}
        data={data}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialBar
          dataKey="value"
          startAngle={90}
          endAngle={-270}
          background={{ fill: "#E0E0E0" }}
        />
      </RadialBarChart>
      <p className="text-lg font-bold text-gray-800">
        {remainingHours} hrs left
      </p>
    </div>
  );
};

export default CircularProgress;
