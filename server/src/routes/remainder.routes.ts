import { Router } from "express";
import {
  createReminder,
  getRemindersForDate,
  updateReminder,
} from "../controllers/remainders.controller";

const remainderRoutes = Router();

remainderRoutes.post("/get", getRemindersForDate);

remainderRoutes.post("/", createReminder);

remainderRoutes.patch("/", updateReminder);

export default remainderRoutes;
