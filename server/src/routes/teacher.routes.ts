import { Router } from "express";
import {
  createStudent,
  deleteStudent,
  getAllStudents,
  updateStudent,
  getStudentById,
  getStudentDetailsForDashboard,
} from "../controllers/student.controller";
import {
  generateQuestionPaper,
  generateSyllabusPlan,
  getStudentsAndSubjectsOfClass,
} from "../controllers/teacher.controller";
import {
  createStudentAttendance,
  getAttendenceOfAClass,
  getStudentAttendanceOfAClassForPastWeek,
  updateStudentAttendance,
} from "../controllers/attendacne.controller";
import { getTestById } from "../controllers/test.controller";
import { generateTimeTable } from "../controllers/timeTable.controller";
import { getClassDashboardById } from "../controllers/standard.controller";

const teacherRoutes = Router();

teacherRoutes.get("/get-all-students/:classId", getAllStudents);

teacherRoutes.get("/get-student/:studentId", getStudentById);

teacherRoutes.get("/student-dashboard-data/:studentId", getStudentDetailsForDashboard);

teacherRoutes.post("/create-student", createStudent);

teacherRoutes.patch("/update-student/:studentId", updateStudent);

teacherRoutes.delete("/delete-student/:studentId", deleteStudent);

teacherRoutes.post("/take-attendance", createStudentAttendance);

teacherRoutes.post("/get-attendance/class/:classId", getAttendenceOfAClass);

teacherRoutes.post("/update-took-attendance", updateStudentAttendance);

teacherRoutes.post("/generate-test-paper", generateQuestionPaper);

teacherRoutes.post("/generate/syllabus-plan", generateSyllabusPlan);

teacherRoutes.get("/test/:testId", getTestById);

teacherRoutes.get(
  "/student/get-attendance-report/:classId",
  getStudentAttendanceOfAClassForPastWeek
);

teacherRoutes.post("/generate-time-table", generateTimeTable);

teacherRoutes.get("/get-class-dashboard/:classId", getClassDashboardById);

teacherRoutes.post("/get-class-tests/:classId", getStudentsAndSubjectsOfClass);

export default teacherRoutes;
