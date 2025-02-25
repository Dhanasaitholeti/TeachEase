import { NextFunction, Request, Response } from "express";
import generateResponse from "../utils/generic/generateResponse";
import { PrismaClient } from "@prisma/client";
import moment from "moment";
import { hashPassword } from "../helpers/auth.helper";

const prisma = new PrismaClient();

export const getMyProgress = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (err) {
    next(err);
  }
};

export const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body;

    const newlyCreatedStudent = await prisma.student.create({
      data: {
        ...body,
        password: await hashPassword(`your-password`),
      },
    });

    await prisma.standard.update({
      where: {
        id: newlyCreatedStudent.standardId,
      },
      data: {
        students: {
          connect: { id: newlyCreatedStudent.id },
        },
      },
    });

    res
      .status(200)
      .json(
        generateResponse(true, "created a new student", newlyCreatedStudent)
      );
  } catch (err) {
    next(err);
  }
};

export const updateStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { studentId } = req.params;
  try {
    const body = req.body;

    const updatedStudent = await prisma.student.update({
      where: {
        id: studentId,
      },
      data: body,
    });

    res
      .status(200)
      .json(generateResponse(true, "updated the student data", updatedStudent));
  } catch (err) {
    next(err);
  }
};

export const deleteStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { studentId } = req.params;
  try {
    const deletedStudent = await prisma.student.delete({
      where: {
        id: studentId,
      },
    });

    res
      .status(200)
      .json(generateResponse(true, "deleted the studentData", deleteStudent));
  } catch (err) {
    next(err);
  }
};

export const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const query = req.query;

  try {
    const { classId } = req.params;

    const page = Number(query.page) || 1;
    const items = Number(query.items) || 10;
    const skip = (page - 1) * items;

    const whereClause = {
      standardId: classId,
    };

    const teachers = await prisma.student.findMany({
      skip,
      take: items,
      where: whereClause,
    });

    const totalTeachers = await prisma.student.count({ where: whereClause });

    const resObj = {
      rows: teachers,
      pagination: {
        totalRecords: totalTeachers,
        itemsPerPage: items,
        currentPage: page,
        totalPages: Math.ceil(totalTeachers / items),
      },
    };

    res
      .status(200)
      .json(generateResponse(true, "retrived the teachers", resObj));
  } catch (err) {
    next(err);
  }
};

export const getStudentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { studentId } = req.params;
    const startOfMonth = moment().startOf("month").toDate();
    const endOfMonth = moment().endOf("month").toDate();

    const studentData = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
      include: {
        Attendence: {
          where: {
            date: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        },
      },
    });

    res.json(generateResponse(true, "retrived student data", studentData));
  } catch (err) {
    next(err);
  }
};

export const getStudentDetailsForDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { studentId } = req.params;

    const endDate = moment().endOf("day").toISOString();
    const startDate = moment()
      .subtract(30, "days")
      .startOf("day")
      .toISOString();

    const studentData = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
      include: {
        Attendence: {
          where: {
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
        marks: {
          include: {
            test: {
              select: {
                id: true,
                conductedOn: true,
                subject: true,
              },
            },
          },
        },
      },
    });

    res
      .status(200)
      .json(generateResponse(true, "retirved the student data", studentData));
  } catch (err) {
    next(err);
  }
};
