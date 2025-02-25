"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/app/component/ui/card";
import { Button } from "@/app/component/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/component/ui/select";
import { Input } from "@/app/component/ui/input";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { addTest, getClassTestById } from "@/service/class";
import { getTeacherProfile } from "@/service/teacherService";
import { toast } from "react-toastify";

interface Test {
  id: string;
  subjectId: string;
  subject: {
    id: string;
    name: string;
  };
  totalMarks: number;
  class: any;
  marks: Array<{
    id: string;
    studentId: string;
    score: number;
  }>;
  questionPaper: {
    mcq: any[];
    short_answers: string[];
    fill_in_the_blanks: string[];
  };
}

const AddMarks: React.FC = () => {
  const [semester, setSemester] = useState<string>("SA1");
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [tests, setTests] = useState<Test[]>([]);
  const [marks, setMarks] = useState<Record<string, number>>({});
  const [classId, setClassId] = useState("");
  const [trigger, setTrigger] = useState(false);
  const [updatedStudents, setUpdatedStudents] = useState<Set<string>>(
    new Set()
  );

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
      fetchTests();
    }
  }, [classId, semester, trigger]);

  useEffect(() => {
    if (tests.length > 0) {
      updateMarksForCurrentStudent();
    }
  }, [currentStudentIndex, tests]);

  const fetchTests = async () => {
    try {
      const data = await getClassTestById(classId, {
        examType: semester,
      });
      setTests(data);

      // Track which students already have marks
      const studentsWithMarks = new Set<string>();
      data.forEach((test) => {
        test.marks?.forEach((mark) => {
          if (mark.score > 0) {
            studentsWithMarks.add(mark.studentId);
          }
        });
      });

      setUpdatedStudents(studentsWithMarks);
      updateMarksForCurrentStudent(data);
    } catch (error) {
      console.error("Error fetching tests:", error);
    }
  };

  const updateMarksForCurrentStudent = (currentTests = tests) => {
    if (currentTests.length === 0) return;

    const currentStudent = currentTests[0]?.class.students[currentStudentIndex];
    if (!currentStudent) return;

    const studentMarks: Record<string, number> = {};
    currentTests.forEach((test) => {
      const existingMark = test.marks?.find(
        (mark) => mark.studentId === currentStudent.id
      );
      studentMarks[test.subjectId] = existingMark?.score || 0;
    });
    setMarks(studentMarks);
  };

  const handlePrevStudent = () => {
    setCurrentStudentIndex((prev) =>
      prev === 0 ? tests[0]?.class.students.length - 1 : prev - 1
    );
  };

  const handleNextStudent = () => {
    setCurrentStudentIndex((prev) =>
      prev === tests[0]?.class.students.length - 1 ? 0 : prev + 1
    );
  };

  const handleUpdateMarks = async () => {
    const currentStudent = tests[0]?.class.students[currentStudentIndex];
    const marksData = Object.entries(marks).map(([subjectId, mark]) => ({
      studentId: currentStudent.id,
      score: mark,
      testId: tests.find((test) => test.subjectId === subjectId)?.id,
    }));

    try {
      await addTest("cm7gcvotg0001o8ttdhxq1nnp", marksData);
      setUpdatedStudents((prev) => new Set([...prev, currentStudent.id]));
      toast.success("Added Successfully");
      setTrigger(!trigger);
    } catch {
      toast.error("Try Again Later!");
    }
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
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
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
            <div className="text-sm font-medium text-gray-500">
              Total Marks Available:{" "}
              {tests.reduce((sum, test) => sum + test.totalMarks, 0)}
            </div>
          </div>

          {tests.length > 0 && tests[0].class.students.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevStudent}
                  className="hover:bg-gray-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="text-center flex items-center gap-2">
                  <h3 className="font-bold text-lg">
                    {tests[0].class.students[currentStudentIndex].name}
                  </h3>
                  {updatedStudents.has(
                    tests[0].class.students[currentStudentIndex].id
                  ) && <Check className="h-5 w-5 text-green-500" />}
                  <p className="text-sm text-gray-500">
                    ID: {tests[0].class.students[currentStudentIndex].id}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextStudent}
                  className="hover:bg-gray-200"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4">
                {tests.map((test) => (
                  <div
                    key={test.id}
                    className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm"
                  >
                    <span className="min-w-32 font-medium capitalize">
                      {test.subject.name}:
                    </span>
                    <div className="flex-1">
                      <Input
                        type="number"
                        value={marks[test.subjectId] || ""}
                        onChange={(e) =>
                          setMarks((prev) => ({
                            ...prev,
                            [test.subjectId]: Number(e.target.value),
                          }))
                        }
                        className="w-full"
                        min="0"
                        max={test.totalMarks}
                      />
                    </div>
                    <span className="text-sm text-gray-500">
                      /{test.totalMarks}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Total Marks Obtained:</span>
                  <span className="text-lg font-bold">
                    {Object.values(marks).reduce((a, b) => a + b, 0)}/
                    {tests.reduce((sum, test) => sum + test.totalMarks, 0)}
                  </span>
                </div>
                <Button
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={handleUpdateMarks}
                >
                  Update Marks
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AddMarks;
