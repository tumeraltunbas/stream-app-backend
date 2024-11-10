import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors/error';
import { CustomValidationError } from '../../utils/validation.util';
import { StatusCodes } from 'http-status-codes';

export const errorHandler = (
    error: CustomError | CustomValidationError[],
    request: Request,
    res: Response,
    next: NextFunction
): void => {
    if (error instanceof CustomError) {
        res.status(error.httpStatusCode).json({ message: error.message });
        return undefined;
    }

    if (
        (error as CustomValidationError[])?.at(0) instanceof
        CustomValidationError
    ) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: error });
        return undefined;
    }
};
