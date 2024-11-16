import { StatusCodes } from 'http-status-codes';
import * as ERROR_CODES from '../../contants/error';

export class CustomError extends Error {
    httpStatusCode: number;

    constructor(httpStatusCode: number, errorMessage: string) {
        super(errorMessage);
        this.httpStatusCode = httpStatusCode;
    }
}

export class InternalServerError extends CustomError {
    constructor() {
        super(StatusCodes.INTERNAL_SERVER_ERROR, ERROR_CODES.InternalServerError);
    }
}

export class BusinessRuleError extends CustomError {
    constructor(message: string) {
        super(StatusCodes.BAD_REQUEST, message);
    }
}
