import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import generateResponse from "../utils/generic/generateResponse";

const prisma = new PrismaClient();

export const createSubject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body;

    const newlyCreatedSubject = await prisma.subject.create({
      data: {
        name: body.name,
        classId: body.classId,
      },
    });

    if (body.teacherId)
      await prisma.subject.update({
        where: {
          id: newlyCreatedSubject.id,
        },
        data: {
          teachers: {
            connect: { id: body.teacherId },
          },
        },
      });

    res
      .status(200)
      .json(generateResponse(true, "New subject Created", newlyCreatedSubject));
  } catch (err) {
    next(err);
  }
};

export const updateExsitingSubject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { subjectId } = req.params;
  try {
    const body = req.body;

    const updatedSubject = await prisma.subject.update({
      where: { id: subjectId },
      data: body,
    });

    res
      .status(200)
      .json(
        generateResponse(true, "Updated the existing subject", updatedSubject)
      );
  } catch (err) {
    next(err);
  }
};

export const deleteASubject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { subjectId } = req.params;
  try {
    const deletedSubject = await prisma.subject.delete({
      where: {
        id: subjectId,
      },
    });
    res
      .status(200)
      .json(generateResponse(true, "deleted the subject", deletedSubject));
  } catch (err) {
    next(err);
  }
};

export const getAllSubjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const query = req.query;
  try {
    const page = Number(query.page) || 1;
    const items = Number(query.items) || 10;
    const skip = (page - 1) * items;

    const subjects = await prisma.subject.findMany({
      skip,
      take: items,
      include: {
        teachers: true,
      },
    });

    const totalSubbjects = await prisma.subject.count();

    const resObj = {
      rows: subjects,
      pagination: {
        totalRecords: totalSubbjects,
        itemsPerPage: items,
        currentPage: page,
        totalPages: Math.ceil(totalSubbjects / items),
      },
    };

    res
      .status(200)
      .json(generateResponse(true, "retrived the subjects", resObj));
  } catch (err) {
    next(err);
  }
};

export const getSubjectsOfAClass = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { classId } = req.params;

    const classSubjects = await prisma.subject.findMany({
      where: {
        classId,
      },
    });

    res
      .status(200)
      .json(
        generateResponse(
          true,
          "retrived the subjects of a class",
          classSubjects
        )
      );
  } catch (err) {
    next(err);
  }
};
