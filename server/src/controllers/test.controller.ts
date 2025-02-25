import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import generateResponse from "../utils/generic/generateResponse";
import moment from "moment";

const prisma = new PrismaClient();

export const getTestById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { testId } = req.params;
  try {
    const testData = await prisma.test.findUnique({
      where: {
        id: testId,
      },
    });

    res
      .status(200)
      .json(generateResponse(true, "Retrived test data", testData));
  } catch (err) {
    next(err);
  }
};

const fetchTests = async (
  filterType: string | null,
  filterId: string | null,
  classId: string | null,
  startDate: string,
  endDate: string
) => {
  const startOfDate = moment(startDate).startOf("day").toISOString();
  const endOfDate = moment(endDate).startOf("day").toISOString();

  const whereClause: any = {
    conductedOn: {
      gte: startOfDate,
      lte: endOfDate,
    },
  };

  switch (filterType) {
    case "subject":
      whereClause.subjectId = filterId;
      break;
    case "teacher":
      whereClause.conductedById = filterId;
      break;
    default:
      break;
  }

  if (classId) {
    whereClause.classId = classId;
  }

  return await prisma.test.findMany({
    where: whereClause,
  });
};

export const getTests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { filterType } = req.query;
    const { subjectId, teacherId, classId, startDate, endDate } = req.body;

    if (filterType && filterType !== "subject" && filterType !== "teacher") {
      res.status(400).json(generateResponse(false, "Invalid filter type"));
      return;
    }

    let filterId: string | null = null;
    let requiredIdName: string | null = null;

    switch (filterType) {
      case "subject":
        filterId = subjectId;
        requiredIdName = "Subject";
        break;
      case "teacher":
        filterId = teacherId;
        requiredIdName = "Teacher";
        break;
      default:
        break;
    }

    if (filterType && !filterId) {
      res
        .status(400)
        .json(generateResponse(false, `${requiredIdName} ID is required`));
      return;
    }

    const testsData = await fetchTests(
      filterType || null,
      filterId,
      classId || null,
      startDate,
      endDate
    );

    const message =
      filterType === "subject"
        ? "Retrieved tests by subject"
        : filterType === "teacher"
        ? "Retrieved tests conducted by teacher"
        : "Retrieved tests conducted in the class";

    res.status(200).json(generateResponse(true, message, testsData));
  } catch (err) {
    next(err);
  }
};

export const getTestsOfAClass = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { classId } = req.params;
    const { examType } = req.body;

    const tests = await prisma.test.findMany({
      where: {
        classId,
        examType,
      },
      include: {
        subject: true,
      },
    });

    res
      .status(200)
      .json(generateResponse(true, "retrived tests of a class", tests));
  } catch (err) {
    next(err);
  }
};
