import { Router } from "express";
import {
  createSubject,
  deleteASubject,
  getAllSubjects,
  getSubjectsOfAClass,
  updateExsitingSubject,
} from "../../controllers/subject.controller";

const adminSubjectRoutes = Router();

adminSubjectRoutes.get("/all", getAllSubjects);

adminSubjectRoutes.get("/class-subjects/:classId", getSubjectsOfAClass);

adminSubjectRoutes.post("/", createSubject);

adminSubjectRoutes.patch("/", updateExsitingSubject);

adminSubjectRoutes.delete("/", deleteASubject);

export default adminSubjectRoutes;
