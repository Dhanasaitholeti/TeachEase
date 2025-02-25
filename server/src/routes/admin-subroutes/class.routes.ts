import { Router } from "express";
import {
  createClass,
  deleteClass,
  getAllClasses,
  updateClass,
  getClassIds,
} from "../../controllers/standard.controller";

const adminClassRoutes = Router();

adminClassRoutes.get("/", getAllClasses);

adminClassRoutes.post("/", createClass);

adminClassRoutes.patch("/", updateClass);

adminClassRoutes.delete("/", deleteClass);

adminClassRoutes.get("/get-class-ids", getClassIds);

export default adminClassRoutes;
