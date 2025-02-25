import { Router } from "express";
import { createAMarkResultForTest } from "../controllers/marks.controller";

const marksRoutes = Router();

marksRoutes.get("/test/:testId");

marksRoutes.post("/:testId", createAMarkResultForTest);

marksRoutes.patch("/");

marksRoutes.delete("/");

export default marksRoutes;
