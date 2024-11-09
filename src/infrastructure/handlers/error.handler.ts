import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors/error';

export const errorHandler = (
   error: CustomError,
   request: Request,
   res: Response,
   next: NextFunction
): void => {
   res.status(error.httpStatusCode).json({
      message: error.message
   });
};
