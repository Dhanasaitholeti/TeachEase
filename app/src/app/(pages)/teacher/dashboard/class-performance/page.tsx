"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/component/ui/table";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { Users, GraduationCap, BookOpen } from "lucide-react";
import { getTeacherProfile } from "@/service/teacherService";
import { getClassDetailsById, getClassAttendanceById } from "@/service/class";
import Loading from "@/app/loading";

const ClassPerformance = () => {
  const router = useRouter();
  const search = useSearchParams();
  const adminId = search.get("adminId");
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [attendance, setAttendance] = useState<any>(null);
  const [classId, setClassId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!adminId) {
          const teacherData = await getTeacherProfile();
          console.log("Teacher Data:", teacherData); // Debugging

          if (!teacherData || !teacherData.responsibleForClassId) {
            throw new Error("No class assigned to teacher");
          }
          setClassId(teacherData.responsibleForClassId);
          const classDetails = await getClassDetailsById(
            teacherData.responsibleForClassId
          );
          console.log("Class Details:", classDetails); // Debugging

          setClassData(classDetails);
          const attendanceData = await getClassAttendanceById(
            teacherData.responsibleForClassId
          );
          console.log("📌 Attendance Data:", attendanceData);
          setAttendance(attendanceData);
          // Calculate performance data
          const subjectPerformance = calculateSubjectPerformance(classDetails);
          console.log("Subject Performance:", subjectPerformance); // Debugging
          setPerformanceData(subjectPerformance);

          // Extract teachers from subjects
          const teachers = (classDetails.subjects || []).flatMap((subject) =>
            (subject.teachers || []).map((teacher) => ({
              ...teacher,
              subject: subject.name,
            }))
          );
          console.log("Teachers:", teachers); // Debugging
          setAllTeachers(teachers);
        } else {
          setClassId(adminId);
          const classDetails = await getClassDetailsById(adminId);
          console.log("Class Details:", classDetails); // Debugging

          setClassData(classDetails);
          const attendanceData = await getClassAttendanceById(adminId);
          console.log("📌 Attendance Data:", attendanceData);
          setAttendance(attendanceData);
          // Calculate performance data
          const subjectPerformance = calculateSubjectPerformance(classDetails);
          console.log("Subject Performance:", subjectPerformance); // Debugging
          setPerformanceData(subjectPerformance);

          // Extract teachers from subjects
          const teachers = (classDetails.subjects || []).flatMap((subject) =>
            (subject.teachers || []).map((teacher) => ({
              ...teacher,
              subject: subject.name,
            }))
          );
          console.log("Teachers:", teachers); // Debugging
          setAllTeachers(teachers);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const formatAttendanceData = (attendanceData) => {
    if (!attendanceData?.daywiseAttendance) return [];

    return Object.entries(attendanceData.daywiseAttendance).map(
      ([date, count]) => ({
        date: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        attendance: count,
      })
    );
  };
  const calculateSubjectPerformance = (classData) => {
    if (!classData) {
      console.warn("⚠ No class data available for performance calculation");
      return [];
    }

    const subjects = classData.subjects || [];
    const students = classData.students || [];
    const tests = classData.Test || [];

    console.log("📌 Subjects:", subjects);
    console.log("📌 Students:", students);
    console.log("📌 Tests:", tests);

    if (subjects.length === 0) console.warn("⚠ No subjects found");
    if (students.length === 0) console.warn("⚠ No students found");
    if (tests.length === 0) console.warn("⚠ No tests found");

    const subjectMap = new Map(
      subjects.map((subject) => [subject.id, subject.name])
    );
    const testSubjectMap = new Map(
      tests.map((test) => [test.id, test.subjectId])
    );

    const subjectScores = new Map();
    const subjectTestCounts = new Map();

    students.forEach((student) => {
      (student.marks || []).forEach((mark) => {
        const subjectId = testSubjectMap.get(mark.testId);
        if (subjectId) {
          const subjectName = subjectMap.get(subjectId);
          const currentTotal = subjectScores.get(subjectName) || 0;
          const currentCount = subjectTestCounts.get(subjectName) || 0;

          subjectScores.set(subjectName, currentTotal + mark.score);
          subjectTestCounts.set(subjectName, currentCount + 1);
        }
      });
    });

    const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

    return Array.from(subjectScores.entries()).map(([name, total], index) => ({
      name,
      value: subjectTestCounts.get(name)
        ? Math.round(total / subjectTestCounts.get(name))
        : 0, // Avoid NaN
      color: colors[index % colors.length],
    }));
  };

  const handleStudentClick = (studentId) => {
    router.push(`/student/dashboard?mentorId=${studentId}`);
  };

  const handleTeacherClick = (teacherId) => {
    router.push(`/teacher/dashboard?adminId=${teacherId}`);
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

  if (!classData) {
    return <div className="p-6">No class data available</div>;
  }
  const attendanceChartData = formatAttendanceData(attendance);

  if (!classId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">You have no access to see this content</p>
      </div>
    );
  }
  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {classData.name} - {classData.section}
        </h1>
        <span className="text-gray-500">Medium: {classData.medium}</span>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Class Stats */}
        <div className="space-y-6">
          <Card className="mb-6 p-4 shadow-md border rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Class Teacher
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <div className="flex flex-col">
                <p className="text-gray-700 font-bold lg:text-3xl">
                  {classData.classTeacher?.name}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Email:</span>{" "}
                  {classData.classTeacher?.email}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Mobile:</span>{" "}
                  {classData.classTeacher?.mobile}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Qualification:</span>{" "}
                  {classData.classTeacher?.qualification?.join(", ")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6 flex items-center space-x-4">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Total Students</p>
                  <p className="text-2xl font-bold">
                    {classData.students?.length || 0}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center space-x-4">
                <GraduationCap className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Class Created</p>
                  <p className="text-sm font-medium">
                    {formatDate(classData.created_at)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
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
                    <YAxis
                      domain={[0, attendance?.totalStudentaInClass || 0]}
                      label={{
                        value: "Students Present",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
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
              {attendance?.totalStudentaInClass && (
                <p className="text-sm text-gray-500 mt-2">
                  Total Students: {attendance.totalStudentaInClass}
                </p>
              )}
            </CardContent>
          </Card>
          {/* Students Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Students List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Guardian</TableHead>
                      <TableHead>Contact</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classData.students?.map((student) => (
                      <TableRow
                        key={student.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleStudentClick(student.id)}
                      >
                        <TableCell className="font-medium">
                          {student.name}
                        </TableCell>
                        <TableCell>{student.gender}</TableCell>
                        <TableCell>{student.gaurdianName}</TableCell>
                        <TableCell>{student.mobile}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Performance Chart and Teachers */}
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

          {/* Teachers Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Subject Teachers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Teacher Name</TableHead>
                      <TableHead>Contact</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allTeachers.map((teacher) => (
                      <TableRow
                        key={`${teacher.id}-${teacher.subject}`}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleTeacherClick(teacher.id)}
                      >
                        <TableCell>{teacher.subject}</TableCell>
                        <TableCell className="font-medium">
                          {teacher.name}
                        </TableCell>
                        <TableCell>{teacher.mobile}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClassPerformance;
