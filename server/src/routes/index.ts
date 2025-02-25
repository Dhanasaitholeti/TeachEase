import { Application, Request, Response } from "express";
import adminRoutes from "./admin.routes";
import teacherRoutes from "./teacher.routes";
import studentRoutes from "./student.routes";
import authRoutes from "./auth.routes";
import timeTableRoutes from "./timetable.routes";
import remainderRoutes from "./remainder.routes";
import marksRoutes from "./marks.routes";

export const RouteHandler = (app: Application) => {
  app.get("/", (req: Request, res: Response) => {
    res.status(200).send("The server is working");
  });

  app.use("/api/admin", adminRoutes);
  app.use("/api/teacher", teacherRoutes);
  app.use("/api/student", studentRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/timetable", timeTableRoutes);
  app.use("/api/remainder", remainderRoutes);
  app.use("/api/marks", marksRoutes);
};
