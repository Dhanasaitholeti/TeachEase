import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getEnv } from "../utils/generic/manage-env";
import { AdminMenu, teacherMenu } from "../static/userMenu";

const prisma = new PrismaClient();

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, passwd } = req.body;
    let userData, userType, redirectionUrl, userMenu: unknown[];

    userData = await prisma.admin.findUnique({ where: { email } });
    userType = "admin";
    redirectionUrl = `${getEnv("WEB_APP_URL")}/admin/dashboard`;
    userMenu = AdminMenu;

    if (!userData) {
      userData = await prisma.teacher.findUnique({ where: { email } });
      userType = "teacher";
      redirectionUrl = `${getEnv("WEB_APP_URL")}/teacher/dashboard`;
      userMenu = teacherMenu;
    }

    if (!userData) {
      userData = await prisma.student.findFirst({
        where: { gaurdianMobile: email },
      });
      userType = "student";
      redirectionUrl = `${getEnv("WEB_APP_URL")}/student/dashboard`;
      userMenu = [
        { title: "Dashboard", icon: "Layout", link: "/teacher/dashboard" },
      ];
    }

    if (!userData) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(passwd, userData.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { id: userData.id, email: userData.email, role: userType },
      getEnv("JWT_SECRET"),
      { expiresIn: "7d" }
    );

    res.json({
      token,
      userData: {
        id: userData.id,
        email: userData.email,
        type: userType,
        name: userData.name,
      },
      userMenu,
      redirectionUrl,
    });
  } catch (err) {
    next(err);
  }
};
