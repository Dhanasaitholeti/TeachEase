import { NextFunction, Request, Response } from "express";
import generateResponse from "../utils/generic/generateResponse";
import { ZodError } from "zod";
import { error } from "console";

const ErrorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ZodError) {
    res
      .status(403)
      .json(generateResponse(false, "Input validation failed", err.errors));

    return;
  }

  console.log(error, "error");

  res
    .status(400)
    .json(generateResponse(false, err.message ?? "something went wrong"));
};

export default ErrorMiddleware;
