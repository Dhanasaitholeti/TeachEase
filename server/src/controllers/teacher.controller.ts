import { NextFunction, Request, Response } from "express";
import { EXAMTYPE, PrismaClient, TESTTYPE } from "@prisma/client";
import generateResponse from "../utils/generic/generateResponse";
import {
  generateQuestions,
  generateSyllabusPlanner,
} from "../services/openai.service";
import { hashPassword } from "../helpers/auth.helper";

const prisma = new PrismaClient();

export const generateQuestionPaper = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body;

    const generatedQuestions = await generateQuestions(
      body.marks,
      body.difficulty_level,
      body.lessons
    );

    if (!generateQuestionPaper) {
      throw new Error("Unable to generate question paper, Try Again");
    }

    const newTest = await prisma.test.create({
      data: {
        subjectId: body.subjectId,
        conductedById: body.teacherId,
        questionPaper: generatedQuestions,
        type: TESTTYPE[(body.testType ?? "MIXED") as keyof typeof TESTTYPE],
        totalMarks: body.marks,
        classId: body.classId,
        examType: EXAMTYPE[(body.examType ?? null) as keyof typeof EXAMTYPE],
      },
    });

    res
      .status(200)
      .json(
        generateResponse(true, "generated questions for your test", newTest.id)
      );
  } catch (err) {
    next(err);
  }
};

export const generateSyllabusPlan = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { topic, subtopics, timePeriod, startDate, endDate } = req.body;

    if (!topic || !Array.isArray(subtopics) || !timePeriod) {
      res.status(400).json({
        error: "Invalid input. Topic, subtopics, and time period are required.",
      });
      return;
    }

    const syllabusPlanner = await generateSyllabusPlanner(
      topic,
      subtopics,
      timePeriod,
      startDate,
      endDate
    );

    res
      .status(200)
      .json(
        generateResponse(true, "Generated the Syllabus Plan", syllabusPlanner)
      );
  } catch (err) {
    next(err);
  }
};

export const createTeacher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { subjectId, ...body } = req.body;

    const newlyCreatedTeacher = await prisma.teacher.create({
      data: {
        ...body,
        password: await hashPassword(
          `${body.email.substring(0, 4)}-${body.mobile.slice(-4)}`
        ),
      },
    });

    if (body.responsibleForClassId)
      await prisma.standard.update({
        where: {
          id: body.responsibleForClassId,
        },
        data: {
          classTeacherId: newlyCreatedTeacher.id,
        },
      });

    if (subjectId)
      await prisma.teacher.update({
        where: {
          id: newlyCreatedTeacher.id,
        },
        data: {
          subjects: {
            connect: {
              id: subjectId,
            },
          },
        },
      });

    res
      .status(201)
      .json(generateResponse(true, "created new teacher", newlyCreatedTeacher));
  } catch (err) {
    next(err);
  }
};

export const updateTeacher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { teacherId } = req.params;

  try {
    const { body } = req.body;

    const updatedTeacher = await prisma.teacher.update({
      where: {
        id: teacherId,
      },
      data: body,
    });

    res
      .status(200)
      .json(generateResponse(true, "updated the teacher data", updatedTeacher));
  } catch (err) {
    next(err);
  }
};

export const deleteTeacher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { teacherId } = req.params;
  try {
    const deleted = await prisma.teacher.delete({
      where: {
        id: teacherId,
      },
    });

    res
      .status(200)
      .json(generateResponse(true, "deleted the teacher", deleted));
  } catch (err) {
    next(err);
  }
};

export const getAllTeachers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const query = req.query;
  try {
    const page = Number(query.page) || 1;
    const items = Number(query.items) || 10;
    const skip = (page - 1) * items;

    const teachers = await prisma.teacher.findMany({
      skip,
      take: items,
    });

    const totalTeachers = await prisma.teacher.count();

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

export const getTeacher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { teacherId } = req.params;
  try {
    const teacherData = await prisma.teacher.findUnique({
      where: {
        id: teacherId,
      },
      include: {
        Standard: true,
        standards: true,
        subjects: true,
      },
    });

    res
      .status(200)
      .json(generateResponse(true, "Get the teacher Data", teacherData));
  } catch (err) {
    next(err);
  }
};

export const getStudentsAndSubjectsOfClass = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { classId } = req.params;
    const { examType } = req.body;

    const testsData = await prisma.test.findMany({
      where: {
        classId,
        examType,
      },
      include: {
        subject: true,
        class: {
          include: {
            students: true,
          },
        },
        marks: {
          include: {
            student: true,
            test: {
              include: {
                subject: true,
              },
            },
          },
        },
      },
    });

    res
      .status(200)
      .json(generateResponse(true, "retrived the subjects", testsData));
  } catch (err) {
    console.log(`**************************************`);
    console.log("error", err);
    console.log(`**************************************`);
    next(err);
  }
};
