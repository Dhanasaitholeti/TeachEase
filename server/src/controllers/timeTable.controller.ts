import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { TimetableGenerator } from "../services/timeTable.service";
import generateResponse from "../utils/generic/generateResponse";

const prisma = new PrismaClient();

export const createTimetable = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { dayOfWeek, startTime, endTime, subjectId, classId, teacherId } =
      req.body;

    const timetable = await prisma.timeTable.create({
      data: {
        dayOfWeek,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        subjectId,
        classId,
        teacherId,
      },
    });

    res.status(201).json(timetable);
  } catch (error) {
    next(error);
  }
};

export const updateTimetable = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { dayOfWeek, startTime, endTime, subjectId, classId, teacherId } =
      req.body;

    const updatedTimetable = await prisma.timeTable.update({
      where: { id },
      data: {
        dayOfWeek,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        subjectId,
        classId,
        teacherId,
      },
    });

    res.status(200).json(updatedTimetable);
  } catch (error) {
    next(error);
  }
};

export const getTimetableForStandard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { standardId } = req.params;

    const timetable = await prisma.timeTable.findMany({
      where: { classId: standardId },
      include: { subject: true, teacher: true },
    });

    res.status(200).json(timetable);
  } catch (error) {
    next(error);
  }
};

export const getTimetableForTeacher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { teacherId } = req.params;

    const timetable = await prisma.timeTable.findMany({
      where: { teacherId },
      include: { subject: true, class: true },
    });

    res.status(200).json(timetable);
  } catch (error) {
    next(error);
  }
};

export const generateTimeTable = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {} = req.body;

    const subjects = ["Math", "Science", "History", "English", "Art"];
    const teachers = [
      "Mr. Smith",
      "Ms. Johnson",
      "Dr. Brown",
      "Mrs. Davis",
      "Mr. Wilson",
    ];
    const prioritySubjects = ["Math", "Science"];

    const generator = new TimetableGenerator(
      8,
      subjects,
      prioritySubjects,
      teachers,
      7
    );

    const timetable = generator.generateTimetable();

    console.log(`**************************************`);
    console.log(timetable, "genearted time table");
    console.log(`**************************************`);

    res
      .status(200)
      .json(generateResponse(true, "Generated the time table", timetable));
  } catch (err) {
    next(err);
  }
};
