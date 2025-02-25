import { Router } from "express";
import { userLogin } from "../controllers/authentication.controller";

const authRoutes = Router();

authRoutes.post("/login", userLogin);

export default authRoutes;
