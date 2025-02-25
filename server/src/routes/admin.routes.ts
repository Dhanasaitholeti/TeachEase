import { Router } from "express";
import teachSubroutes from "./admin-subroutes/teacher.routes";
import subjectSubRoutes from "./admin-subroutes/subject.routes";
import classSubRoutes from "./admin-subroutes/class.routes";
import studentsSubRoutes from "./admin-subroutes/student.routes";

import {
  adminDashboardStats,
  generateNewPresignedUrl,
} from "../controllers/admin.controller";

const adminRoutes = Router();

adminRoutes.use("/teacher", teachSubroutes);

adminRoutes.use("/class", classSubRoutes);

adminRoutes.use("/student", studentsSubRoutes);

adminRoutes.use("/subject", subjectSubRoutes);

adminRoutes.get("/get-stats", adminDashboardStats);

adminRoutes.get("/get-presigned-url", generateNewPresignedUrl);

export default adminRoutes;
