import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import generateResponse from "../utils/generic/generateResponse";

const prisma = new PrismaClient();

export const createReminder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      description,
      priority,
      dateOfReminder,
      status,
      teacherId,
      adminId,
    } = req.body;

    const reminder = await prisma.reminder.create({
      data: {
        title,
        description,
        priority,
        dateOfReminder: new Date(dateOfReminder),
        status,
        teacherId,
        adminId,
      },
    });

    res.status(201).json(reminder);
  } catch (error) {
    next(error);
  }
};

export const updateReminder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { title, description, priority, dateOfReminder, status } = req.body;

    const updatedReminder = await prisma.reminder.update({
      where: { id },
      data: {
        title,
        description,
        priority,
        dateOfReminder: new Date(dateOfReminder),
        status,
      },
    });

    res.status(200).json(updatedReminder);
  } catch (error) {
    next(error);
  }
};

export const getRemindersForDate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date, relatedTo } = req.body;

    console.log(`**************************************`);
    console.log(req.body, "req body");
    console.log(`**************************************`);

    const targetDate = date ? new Date(date) : new Date();

    const reminders = await prisma.reminder.findMany({
      where: {
        dateOfReminder: {
          gte: new Date(targetDate.setHours(0, 0, 0, 0)),
          lt: new Date(targetDate.setHours(23, 59, 59, 999)),
        },
      },
      include: {
        teacher: relatedTo === "Teacher",
        admin: relatedTo === "Admin",
      },
    });

    const sortedReminders = reminders.sort((a, b) => {
      const priorityOrder: { [key: string]: number } = {
        high: 1,
        medium: 2,
        low: 3,
      };
      return (
        priorityOrder[a.priority as keyof typeof priorityOrder] -
        priorityOrder[b.priority as keyof typeof priorityOrder]
      );
    });

    res
      .status(200)
      .json(generateResponse(true, "retrieved the reminders", sortedReminders));
  } catch (error) {
    next(error);
  }
};
