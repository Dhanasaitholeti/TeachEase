import { Router } from "express";
import {
  createTeacher,
  deleteTeacher,
  getAllTeachers,
  getTeacher,
  updateTeacher,
} from "../../controllers/teacher.controller";

const adminteacherSubRoutes = Router();

adminteacherSubRoutes.get("/all", getAllTeachers);

adminteacherSubRoutes.get("/:teacherId", getTeacher);

adminteacherSubRoutes.post("/", createTeacher);

adminteacherSubRoutes.patch("/:teacherId", updateTeacher);

adminteacherSubRoutes.delete("/:teacherId", deleteTeacher);

export default adminteacherSubRoutes;
