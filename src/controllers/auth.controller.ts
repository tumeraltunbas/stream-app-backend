import { RequestHandler } from 'express';
import { createUser } from '../services/auth.service';
import { RegisterReqDto } from '../models/dtos/request/auth.dto';
import HTTP_CODES from 'http-status-codes';
import { CreateUserResDto } from '../models/dtos/response/auth.dto';
import { handleResponse } from '../infrastructure/handlers/controller.handler';
import { validateDto } from '../utils/validation.util';

export const register: RequestHandler = async (
    req,
    res,
    next
): Promise<void> => {
    const { username, email, password } = req.body;

    const registerReqDto: RegisterReqDto = new RegisterReqDto(
        username,
        email,
        password
    );

    const mappedErrors = await validateDto(registerReqDto, next);

    if (mappedErrors.length > 0) {
        return next(mappedErrors);
    }

    const response: CreateUserResDto = await createUser(registerReqDto, next);
    handleResponse(HTTP_CODES.CREATED, response, res);
};
