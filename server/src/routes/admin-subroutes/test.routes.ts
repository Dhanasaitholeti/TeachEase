import { Router } from "express";
import {
  getTestById,
  getTests,
  getTestsOfAClass,
} from "../../controllers/test.controller";

const adminTestSubRoutes = Router();

adminTestSubRoutes.get("/get-test/:testId", getTestById);

adminTestSubRoutes.get("/get-test-of-class/:classId", getTestsOfAClass);

adminTestSubRoutes.post("/get-tests", getTests);

adminTestSubRoutes.patch("/update-test/:testId");

adminTestSubRoutes.delete("/");

export default adminTestSubRoutes;
