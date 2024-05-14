import { Request, Response, NextFunction } from "express";
import Joi, { Schema } from "joi";
import { errorResponse } from "../Utils/responseMessages";

const requestParamsMiddleware = (
  validationSchema: Schema
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const validationResult = validationSchema.validate(req.params, {
      abortEarly: false,
    });
    if (validationResult.error) {
      const errMessage = validationResult.error.details[0].message;
      res.send(errorResponse(errMessage));
    } else {
      next();
    }
  };
};

export default requestParamsMiddleware;
