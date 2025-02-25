"use client";
import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/component/ui/card";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { User, GraduationCap, BookOpen, Calendar } from "lucide-react";

import Loading from "@/app/loading";
import { getStudentDetailsById } from "@/service/class";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  const search = useSearchParams();
  const mentorId = search.get("mentorId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let studentId = mentorId;

        if (!studentId) {
          const userData = localStorage.getItem("userData");
          if (!userData)
            throw new Error("User data not found in local storage");

          const parsedUserData = JSON.parse(userData);
          if (!parsedUserData.id) throw new Error("No student ID found");

          studentId = parsedUserData.id;
        }

        const studentDetails = await getStudentDetailsById(studentId);
        if (!studentDetails) throw new Error("Failed to fetch student details");

        setStudentData(studentDetails);
        setPerformanceData(calculateSubjectPerformance(studentDetails));
      } catch (error) {
        console.error("Error fetching student details:", error);
        toast.error(error.message || "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mentorId]);

  const calculateSubjectPerformance = (studentData) => {
    if (!studentData?.marks || studentData.marks.length === 0) {
      return [];
    }

    // Group marks by subject
    const subjectScores = studentData.marks.reduce((acc, mark) => {
      const subjectName = mark.test.subject.name;
      if (!acc[subjectName]) {
        acc[subjectName] = {
          totalScore: 0,
          count: 0,
        };
      }
      acc[subjectName].totalScore += mark.score;
      acc[subjectName].count += 1;
      return acc;
    }, {});

    const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

    // Calculate average scores for each subject
    return Object.entries(subjectScores).map(([name, data]: any[], index) => ({
      name,
      value: Math.round(data?.totalScore / data?.count),
      color: colors[index % colors.length],
    }));
  };

  const formatAttendanceData = (attendanceData) => {
    if (!attendanceData || !Array.isArray(attendanceData)) return [];

    // Group attendance by date
    const groupedData = attendanceData.reduce((acc, record) => {
      const date = new Date(record.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      acc[date] = record.status === "PRESENT" ? 1 : 0;
      return acc;
    }, {});

    return Object.entries(groupedData).map(([date, value]) => ({
      date,
      attendance: value,
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  if (!studentData) {
    return <div className="p-6">No student data available</div>;
  }

  const attendanceChartData = formatAttendanceData(studentData.Attendence);

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{studentData.name}</h1>
        <span className="text-gray-500">Student ID: {studentData.id}</span>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Student Info */}
        <div className="space-y-6">
          <Card className="mb-6 p-4 shadow-md border rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-500">
                <span className="font-medium">Date of Birth:</span>{" "}
                {formatDate(studentData.dateofbirth)}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Gender:</span>{" "}
                {studentData.gender}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Blood Group:</span>{" "}
                {studentData.bloodGroup}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Guardian:</span>{" "}
                {studentData.gaurdianName}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Contact:</span>{" "}
                {studentData.mobile}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Address:</span>{" "}
                {studentData.adress}
              </p>
            </CardContent>
          </Card>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6 flex items-center space-x-4">
                <Calendar className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Joined On</p>
                  <p className="text-sm font-medium">
                    {formatDate(studentData.created_at)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center space-x-4">
                <User className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Attendance</p>
                  <p className="text-2xl font-bold">
                    {studentData.Attendence?.filter(
                      (a) => a.status === "PRESENT"
                    ).length || 0}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Attendance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Attendance Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              {attendanceChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart
                    data={attendanceChartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 1]} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="attendance"
                      stroke="#3b82f6"
                      fill="#93c5fd"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-gray-500">
                  No attendance data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Performance Chart */}
        <div className="space-y-6">
          {/* Performance Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Subject Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              {performanceData.length > 0 ? (
                <PieChart width={400} height={300}>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              ) : (
                <div className="text-center text-gray-500">
                  No performance data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Test Scores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Recent Test Scores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentData.marks?.slice(-5).map((mark) => (
                  <div
                    key={mark.id}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <div>
                      <p className="font-medium">{mark.test.subject.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(mark.test.conductedOn)}
                      </p>
                    </div>
                    <div className="text-lg font-bold">{mark.score}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
