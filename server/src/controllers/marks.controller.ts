import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import generateResponse from "../utils/generic/generateResponse";
import moment from "moment";

const prisma = new PrismaClient();

export const createAMarkResultForTest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body;

    const createdMarks = await prisma.marks.createMany({
      data: body,
    });

    res
      .status(200)
      .json(generateResponse(true, "Created a marks", createdMarks));
  } catch (err) {
    next(err);
  }
};

export const updateResultOfTest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { testId } = req.params;

    const body = req.body;

    const updatedMarks = await prisma.marks.update({
      where: {
        id: testId,
      },
      data: body,
    });

    res
      .status(200)
      .json(generateResponse(true, "updated the marks", updatedMarks));
  } catch (err) {
    next(err);
  }
};

export const getResutltsOfATest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { testId } = req.params;

    const marksData = await prisma.marks.findMany({
      where: {
        testId,
      },
      include: {
        student: true,
      },
    });

    res
      .status(200)
      .json(generateResponse(true, "retrived the test results", marksData));
  } catch (err) {
    next(err);
  }
};

export const getPastMarksOfStudents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { studentId } = req.params;

    const endDate = moment().endOf("day").toISOString();
    const startDate = moment()
      .subtract(3, "months")
      .startOf("day")
      .toISOString();

    const studentMarks = await prisma.marks.findMany({
      where: {
        studentId,
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        test: true,
      },
    });

    res.status(200).json(studentMarks);
  } catch (err) {
    next(err);
  }
};
