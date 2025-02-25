import { PrismaClient, STATUS, USERTYPE } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import generateResponse from "../utils/generic/generateResponse";
import moment from "moment";

const prisma = new PrismaClient();

export const createStudentAttendance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body;

    await prisma.attendance.createMany({
      data: body.map((each: any) => ({
        ...each,
        userType: USERTYPE.STUDENT,
        status: STATUS[each.status as keyof typeof STATUS],
      })),
    });
    res
      .status(200)
      .json(generateResponse(true, "Attendance Taken successfully"));
  } catch (err) {
    next(err);
  }
};

export const createTeacherAttendence = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body;

    await prisma.attendance.createMany({
      data: body.map((each: any) => ({
        ...each,
        userType: USERTYPE.TEACHER,
        status: STATUS[each.status as keyof typeof STATUS],
      })),
    });

    res
      .status(200)
      .json(generateResponse(true, "Attendance Taken successfully"));
  } catch (err) {
    next(err);
  }
};

export const updateStudentAttendance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const attendanceUpdates = req.body;

  try {
    for (const update of attendanceUpdates) {
      const { id, ...data } = update;

      await prisma.attendance.update({
        where: { id },
        data,
      });
    }

    res.status(200).json(generateResponse(true, "Updated the Attendance"));
  } catch (err) {
    next(err);
  }
};

export const updateTeacherAttendance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { attendanceId } = req.params;
  try {
    const body = req.body;

    await prisma.attendance.update({
      where: {
        id: attendanceId,
      },
      data: body,
    });

    res.status(200).json(generateResponse(true, "Updated the Attendance"));
  } catch (err) {
    next(err);
  }
};

export const getAttendanceOfAStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (err) {
    next(err);
  }
};

export const getAttendanceOfATeacher = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (err) {
    next(err);
  }
};

export const getAttendenceOfAClass = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { classId } = req.params;
    const { date } = req.body;

    const startOfDate = moment(date).startOf("day").toISOString();
    const endOfDate = moment(date).endOf("day").toISOString();

    const attendanceData = await prisma.attendance.findMany({
      where: {
        standardId: classId,
        date: {
          gte: startOfDate,
          lte: endOfDate,
        },
      },
      include: {
        student: true,
      },
    });

    res
      .status(200)
      .json(
        generateResponse(
          true,
          "Retrived the attendance of class",
          attendanceData
        )
      );
  } catch (err) {
    next(err);
  }
};

export const getStudentAttendanceOfAClassForPastWeek = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { classId } = req.params;

    const endDate = moment().endOf("day").toISOString();
    const startDate = moment().subtract(7, "days").startOf("day").toISOString();

    const totalStudentsOfClass = await prisma.standard.findFirst({
      where: {
        id: classId,
      },
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
    });

    const attendanceData = await prisma.attendance.findMany({
      where: {
        standardId: classId,
        status: "PRESENT",
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    const attendanceCountByDay = attendanceData.reduce(
      (acc: { [key: string]: number }, record) => {
        const date = moment(record.date).startOf("day").toISOString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {}
    );

    res.status(200).json(
      generateResponse(true, "Retrieved the attendance count", {
        totalStudentaInClass: totalStudentsOfClass?._count.students ?? 0,
        daywiseAttendance: attendanceCountByDay,
      })
    );
  } catch (err) {
    next(err);
  }
};
