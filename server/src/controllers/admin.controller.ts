import { NextFunction, Request, Response } from "express";
import { getPreSignedUrl } from "../services/s3.service";
import generateResponse from "../utils/generic/generateResponse";
import { PrismaClient, STATUS } from "@prisma/client";

const prisma = new PrismaClient();

export const generateNewPresignedUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body;
  try {
    const { fileName } = body;

    const presignedurl = await getPreSignedUrl(fileName);

    res
      .status(200)
      .json(generateResponse(true, "Presigned url generated", presignedurl));
  } catch (err) {
    next(err);
  }
};

export const adminDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const students = await prisma.student.count();
    const teachers = await prisma.teacher.count();
    const classes = await prisma.standard.count();

    const presentes = await prisma.attendance.count({
      where: {
        status: "PRESENT",
      },
    });

    res.status(200).json(
      generateResponse(true, "returned stats", {
        totalStudents: students,
        totalTeachers: teachers,
        totalClasses: classes,
        totalPresentees: presentes,
      })
    );
  } catch (err) {
    next(err);
  }
};

export const getClassesAttendanceForThatDay = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const activeClasses = await prisma.standard.findMany({
      include: {
        _count: {
          select: {
            Attendance: {
              where: {
                status: STATUS.PRESENT,
              },
            },
            students: true,
          },
        },
      },
    });

    res
      .status(200)
      .json(
        generateResponse(
          true,
          "Retrived current day Attendence of all classes",
          activeClasses
        )
      );
  } catch (err) {
    next(err);
  }
};
