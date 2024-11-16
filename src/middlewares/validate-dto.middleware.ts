import { NextFunction, Request, RequestHandler, Response } from 'express';
import { validate, ValidationError } from 'class-validator';
import logger from '../utils/logger.util';

export class CustomValidationError {
    field: string;
    messages: string[];
}

export const validateDtoMiddleware = (dtoType: any): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dto = new dtoType(...Object.values(req.body));

        const mappedErrors: CustomValidationError[] = [];

        let validationErrors: ValidationError[];
        try {
            validationErrors = await validate(dto, {});
        } catch (error) {
            logger.error('Dto validation - validate', { error });
            return next(error);
        }

        if (validationErrors?.length > 0) {
            for (const error of validationErrors) {
                const mappedError = new CustomValidationError();
                mappedError.field = error?.property;
                mappedError.messages = Object.values(error?.constraints);

                mappedErrors.push(mappedError);
            }
        }

        if (mappedErrors.length > 0) {
            return next(mappedErrors);
        }

        next();
    };
};
