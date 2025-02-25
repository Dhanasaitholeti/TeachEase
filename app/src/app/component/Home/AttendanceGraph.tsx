"use client";
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
import { format, parseISO } from "date-fns";
import { getClassIds } from "@/service/class";
import { getStudentAttendance } from "@/service/teacherService";

interface AttendanceData {
  date: string;
  attendance: number;
}

const AttendanceGraph: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [classOptions, setClassOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [selectedClass, setSelectedClass] = useState<string>("");

  // Fetch class options
  useEffect(() => {
    const fetchClassIds = async () => {
      try {
        const data = await getClassIds();
        setClassOptions(data);
        if (data.length > 0) {
          setSelectedClass(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClassIds();
  }, []);

  // Fetch attendance data
  useEffect(() => {
    if (!selectedClass) return;

    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const data = await getStudentAttendance(selectedClass);

        console.log("API Response:", data); // Debugging log

        if (!data || !data.daywiseAttendance) {
          throw new Error("Invalid data format received.");
        }

        const totalStudents = data.totalStudentaInClass || 1; // Prevent division by zero

        // Convert API response into Recharts format
        const transformedData = Object.entries(data.daywiseAttendance).map(
          ([date, presentCount]) => ({
            date: format(new Date(date), "yyyy-MM-dd"),
            attendance: Math.min(
              100,
              Math.round((Number(presentCount) / totalStudents) * 100)
            ), // Ensure percentage does not exceed 100
          })
        );

        console.log("Transformed Data:", transformedData); // Debugging log

        setAttendanceData(transformedData);
        setError(null);
      } catch (err) {
        setError("Failed to load attendance data.");
        setAttendanceData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [selectedClass]);

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      {/* Title and Dropdown in One Row */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Student Attendance Over the Past 7 Days
          </h2>
          <p className="text-sm text-gray-500">
            Percentage of students present each day
          </p>
        </div>

        {/* Dropdown for Class Selection */}
        <div>
          <label className="text-sm font-medium text-gray-600 mr-2">
            Select Class:
          </label>
          <select
            className="border rounded-md p-2 w-[150px] ml-auto"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {classOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Show Graph or Messages */}
      {loading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : attendanceData.length === 0 ? (
        <p className="text-gray-500 text-center">
          No attendance data available.
        </p>
      ) : (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart
              data={attendanceData}
              margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(new Date(date), "MMM dd")}
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
              <Tooltip
                labelFormatter={(date) => format(parseISO(date), "PPPP")}
              />
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

export default AttendanceGraph;
