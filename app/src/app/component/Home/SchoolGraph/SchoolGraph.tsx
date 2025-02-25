"use client";
import { getAllClassAttendance } from "@/service/class";
import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ClassData {
  id: string;
  name: string;
  medium: string;
  section: string;
  classTeacherId: string;
  created_at: string;
  updated_at: string;
  _count: {
    Attendance: number;
    students: number;
  };
}

interface AttendanceChartData {
  className: string;
  attendance: number;
}

const SchoolGraph = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceChartData[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassAttendance = async () => {
      try {
        const classesData = await getAllClassAttendance();

        // Transform the API data to calculate attendance percentages
        const formattedData = classesData.map((classItem: ClassData) => {
          // Calculate attendance percentage
          // If no students, set to 0 to avoid division by zero
          const totalStudents = classItem._count.students;
          const presentStudents = classItem._count.Attendance;
          const attendancePercentage =
            totalStudents === 0
              ? 0
              : Math.round((presentStudents / totalStudents) * 100);

          return {
            className: classItem.name,
            attendance: attendancePercentage,
          };
        });

        setAttendanceData(formattedData);
      } catch (error) {
        console.error("Failed to fetch attendance data:", error);
        // Use sample data as fallback
        setAttendanceData([
          { className: "Class 1", attendance: 92 },
          { className: "Class 2", attendance: 88 },
          // other sample data...
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchClassAttendance();
  }, []);

  // Sort data by class number for better visualization
  const sortedData = [...attendanceData].sort((a, b) => {
    // Extract numbers from class names (handles formats like "Class IV", "Class 3", etc.)
    const extractClassNumber = (className: string) => {
      const match = className.match(/(\d+|[IVXLCDM]+)/i);
      if (!match) return 0;

      // Handle Roman numerals if present
      if (/^[IVXLCDM]+$/i.test(match[0])) {
        const romanMap: Record<string, number> = {
          i: 1,
          v: 5,
          x: 10,
          l: 50,
          c: 100,
          d: 500,
          m: 1000,
        };

        const romanNumeral = match[0].toLowerCase();
        let value = 0;

        for (let i = 0; i < romanNumeral.length; i++) {
          const current = romanMap[romanNumeral[i]];
          const next = romanMap[romanNumeral[i + 1]] || 0;

          if (current < next) {
            value -= current;
          } else {
            value += current;
          }
        }

        return value;
      }

      // Handle numeric classes
      return parseInt(match[0]);
    };

    return extractClassNumber(a.className) - extractClassNumber(b.className);
  });

  if (loading) {
    return (
      <div className="w-full bg-white p-6 rounded-lg shadow-md flex justify-center items-center h-80">
        <p className="text-gray-500">Loading attendance data...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-1 text-gray-800">
        Today's Class Attendance
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Showing percentage of students present in each class
      </p>

      {sortedData.length === 0 ? (
        <div className="h-80 w-full flex justify-center items-center">
          <p className="text-gray-500">No attendance data available</p>
        </div>
      ) : (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={sortedData}
              margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="className"
                tick={{ fill: "#6b7280" }}
                axisLine={{ stroke: "#9ca3af" }}
                tickLine={false}
                height={50}
              />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tick={{ fill: "#6b7280" }}
                axisLine={{ stroke: "#9ca3af" }}
                tickLine={false}
              />
              <Tooltip formatter={(value) => `${value}%`} />
              <Area
                type="monotone"
                dataKey="attendance"
                stroke="#3b82f6"
                fill="#93c5fd"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default SchoolGraph;
