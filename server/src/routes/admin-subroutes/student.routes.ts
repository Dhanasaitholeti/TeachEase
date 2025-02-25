import { Router } from "express";
import {
  getAllStudents,
  createStudent,
} from "../../controllers/student.controller";
import { getClassesAttendanceForThatDay } from "../../controllers/admin.controller";
const adminStudentRoutes = Router();

adminStudentRoutes.get("/all", getAllStudents);

adminStudentRoutes.post("/", createStudent);

adminStudentRoutes.get(
  "/get-attendance-for-today",
  getClassesAttendanceForThatDay
);

adminStudentRoutes.patch("/");

adminStudentRoutes.delete("/");

export default adminStudentRoutes;
