import { Router } from "express";
import {
  createTimetable,
  getTimetableForStandard,
  getTimetableForTeacher,
  updateTimetable,
} from "../controllers/timeTable.controller";

const timeTableRoutes = Router();

timeTableRoutes.get("/", createTimetable);

timeTableRoutes.get("/class", getTimetableForStandard);

timeTableRoutes.patch("/", updateTimetable);

timeTableRoutes.get("/teacher", getTimetableForTeacher);

export default timeTableRoutes;
