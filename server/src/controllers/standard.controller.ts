import { NextFunction, Request, Response } from "express";
import generateResponse from "../utils/generic/generateResponse";
import { PrismaClient } from "@prisma/client";
import moment from "moment";

const prisma = new PrismaClient();

export const createClass = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body;

    const newlyCreatedClass = await prisma.standard.create({
      data: {
        ...body,
        teachers: {
          connect: body.teacherId,
        },
      },
    });

    if (body.classTeacherId)
      await prisma.teacher.update({
        where: {
          id: body.classTeacherId,
        },
        data: {
          responsibleForClassId: newlyCreatedClass.id,
        },
      });

    res
      .status(200)
      .json(generateResponse(true, "created a new student", newlyCreatedClass));
  } catch (err) {
    next(err);
  }
};

export const updateClass = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { classId } = req.params;
  try {
    const body = req.body;

    const updatedStudent = await prisma.standard.update({
      where: {
        id: classId,
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

export const deleteClass = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { classId } = req.params;
  try {
    const deletedStudent = await prisma.standard.delete({
      where: {
        id: classId,
      },
    });

    res
      .status(200)
      .json(generateResponse(true, "deleted the studentData", deletedStudent));
  } catch (err) {
    next(err);
  }
};

export const getClassIds = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const classes = await prisma.standard.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    res
      .status(200)
      .json(generateResponse(true, "retrived the classes id", classes));
  } catch (err) {
    next(err);
  }
};

export const getAllClasses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const query = req.query;

  try {
    const page = Number(query.page) || 1;
    const items = Number(query.items) || 10;
    const skip = (page - 1) * items;

    const todayStart = moment().startOf("day").toDate();
    const todayEnd = moment().endOf("day").toDate();

    const classes = await prisma.standard.findMany({
      skip,
      take: items,
      include: {
        classTeacher: true,
        Attendance: {
          where: {
            date: {
              gte: todayStart,
              lte: todayEnd,
            },
          },
        },
        students: true,
        _count: {
          select: { students: true },
        },
      },
    });

    const totalClasses = await prisma.standard.count();

    const resObj = {
      rows: classes,
      pagination: {
        totalRecords: totalClasses,
        itemsPerPage: items,
        currentPage: page,
        totalPages: Math.ceil(totalClasses / items),
      },
    };

    res
      .status(200)
      .json(generateResponse(true, "retrived the teachers", resObj));
  } catch (err) {
    next(err);
  }
};

export const getClassDashboardById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { classId } = req.params;

    const dashBoardData = await prisma.standard.findUnique({
      where: {
        id: classId,
      },
      include: {
        students: {
          include: {
            marks: true,
          },
        },
        teachers: true,
        classTeacher: true,
        Test: true,
        subjects: {
          include: {
            teachers: true,
          },
        },
      },
    });

    res
      .status(200)
      .json(generateResponse(true, "Retrived class dashboard", dashBoardData));
  } catch (err) {
    next(err);
  }
};
