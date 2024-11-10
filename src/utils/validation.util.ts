import { validate, ValidationError } from 'class-validator';
import { BaseReqDto } from '../models/dtos/request';
import { NextFunction } from 'express';
import logger from './logger.util';

export class CustomValidationError {
    field: string;
    messages: string[];
}

export const validateDto = async (
    dto: BaseReqDto,
    next: NextFunction
): Promise<CustomValidationError[]> => {
    const mappedErrors: CustomValidationError[] = [];

    let validationErrors: ValidationError[];
    try {
        validationErrors = await validate(dto, {});
    } catch (error) {
        logger.error('Dto validation - validate', { error });
        next(error);
    }

    if (validationErrors?.length > 0) {
        for (const error of validationErrors) {
            const mappedError = new CustomValidationError();
            mappedError.field = error?.property;
            mappedError.messages = Object.values(error?.constraints);

            mappedErrors.push(mappedError);
        }
    }

    return mappedErrors;
};
