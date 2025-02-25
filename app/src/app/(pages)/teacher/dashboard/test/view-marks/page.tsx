"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/component/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/component/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/component/ui/table";
import { getClassTestById } from "@/service/class";
import { getTeacherProfile } from "@/service/teacherService";

const ViewMarks = () => {
  const [semester, setSemester] = useState<string>("SA1");
  const [classId, setClassId] = useState("");
  const [testsData, setTestsData] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  const semesters = ["SA1", "SA2", "SA3"];

  const fetchTeacherId = async () => {
    try {
      const data = await getTeacherProfile();
      if (data) {
        setClassId(data.responsibleForClassId);
      }
    } catch {}
  };

  useEffect(() => {
    fetchTeacherId();
  }, []);

  useEffect(() => {
    if (classId) {
      fetchTestsData();
    }
  }, [classId, semester]);

  const fetchTestsData = async () => {
    try {
      const data = await getClassTestById(classId, {
        examType: semester,
      });
      setTestsData(data);

      // Extract unique students and subjects
      if (data.length > 0) {
        setStudents(data[0].class.students);
        const uniqueSubjects = data.map((test) => ({
          id: test.subject.id,
          name: test.subject.name,
          totalMarks: test.totalMarks,
        }));
        setSubjects(uniqueSubjects);
      }
    } catch (error) {
      console.error("Error fetching tests:", error);
    }
  };

  const getStudentScore = (studentId: string, subjectId: string) => {
    const test = testsData.find((t) => t.subject.id === subjectId);
    if (!test) return "-";

    const mark = test.marks?.find((m: any) => m.studentId === studentId);
    return mark ? mark.score : "-";
  };

  const calculateTotalScore = (studentId: string) => {
    let total = 0;
    let totalPossible = 0;

    subjects.forEach((subject) => {
      const score = getStudentScore(studentId, subject.id);
      if (score !== "-") {
        total += Number(score);
        totalPossible += subject.totalMarks;
      }
    });

    return totalPossible > 0 ? `${total}/${totalPossible}` : "-";
  };

  const calculatePercentage = (studentId: string) => {
    const [obtained, total] = calculateTotalScore(studentId)
      .split("/")
      .map(Number);
    if (!obtained || !total) return "-";
    return ((obtained / total) * 100).toFixed(1) + "%";
  };

  if (!classId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">You have no access to see this content</p>
      </div>
    );
  }

  return (
    <div className="px-3 py-5">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>View Marks</CardTitle>
            <Select value={semester} onValueChange={setSemester}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select Semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((sem) => (
                  <SelectItem key={sem} value={sem}>
                    {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Student Name</TableHead>
                  {subjects.map((subject) => (
                    <TableHead key={subject.id} className="text-center">
                      {subject.name}
                      <div className="text-xs text-gray-500">
                        (/{subject.totalMarks})
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="text-center">Total Score</TableHead>
                  <TableHead className="text-center">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.name}
                    </TableCell>
                    {subjects.map((subject) => (
                      <TableCell key={subject.id} className="text-center">
                        {getStudentScore(student.id, subject.id)}
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-medium">
                      {calculateTotalScore(student.id)}
                    </TableCell>
                    <TableCell className="text-center">
                      {calculatePercentage(student.id)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewMarks;
