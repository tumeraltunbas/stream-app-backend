import { HttpStatus, NotFoundException } from '@nestjs/common';
import { ERROR_CODES, ERROR_MESSAGES } from '../constants/error';
import {
    BaseError,
    ErrorResponseBody,
    ValidationError,
} from '../infrastructure/error/error';

export function errorCodeToMessage(errorCode: string): string {
    return ERROR_MESSAGES[errorCode] ?? ERROR_MESSAGES.process_failure_error;
}

export function createErrorResponseBody<T>(exception: T): ErrorResponseBody {
    const errorResponseBody: ErrorResponseBody = {
        code: ERROR_CODES.processFailureError,
        message: errorCodeToMessage(ERROR_CODES.processFailureError),
        status: HttpStatus.INTERNAL_SERVER_ERROR,
    };

    if (exception instanceof NotFoundException) {
        errorResponseBody['code'] = ERROR_CODES.notFound;
        errorResponseBody['message'] = errorCodeToMessage(ERROR_CODES.notFound);
        errorResponseBody['status'] = HttpStatus.NOT_FOUND;
    }

    if (exception instanceof BaseError) {
        errorResponseBody['code'] = exception.code;
        errorResponseBody['message'] = errorCodeToMessage(
            errorResponseBody.code,
        );
        errorResponseBody['status'] = exception.status;
    }

    if (exception instanceof ValidationError) {
        errorResponseBody['data'] = exception.data;
    }

    return errorResponseBody;
}
