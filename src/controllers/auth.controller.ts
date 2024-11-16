import { RequestHandler } from 'express';
import * as authService from '../services/auth.service';
import { LoginReqDto, RegisterReqDto } from '../models/dtos/request/auth.dto';
import HTTP_CODES from 'http-status-codes';
import { CreateUserResDto, LoginResDto } from '../models/dtos/response/auth.dto';
import { handleResponse } from '../infrastructure/handlers/controller.handler';
import { ServiceResponse } from '../models/dtos/response';

export const register: RequestHandler = async (req, res, next): Promise<void> => {
    const { username, email, password } = req.body;

    const registerReqDto: RegisterReqDto = new RegisterReqDto(
        username,
        email,
        password
    );

    const response: ServiceResponse<CreateUserResDto> = await authService.createUser(
        registerReqDto,
        next
    );

    return handleResponse(HTTP_CODES.CREATED, response, res);
};

export const login: RequestHandler = async (req, res, next): Promise<void> => {
    const { username, password } = req.body;

    const loginReqDto: LoginReqDto = new LoginReqDto(username, password);

    const response: ServiceResponse<LoginResDto> = await authService.login(
        loginReqDto,
        next
    );

    return handleResponse(HTTP_CODES.OK, response, res);
};
