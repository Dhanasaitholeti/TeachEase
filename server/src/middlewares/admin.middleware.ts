import { NextFunction, Request, Response } from "express";
import { getEnv } from "../utils/generic/manage-env";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SECRET_KEY = getEnv("JWT_SECRET");

interface DecodedToken {
  id: string;
  email: string;
  role: string;
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access Denied. No token provided." });
    }

    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      SECRET_KEY
    ) as DecodedToken;

    const user = await prisma.admin.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid token. User not found." });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

export default authenticateUser;
