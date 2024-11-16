import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validateDtoMiddleware } from '../middlewares/validate-dto.middleware';
import { LoginReqDto, RegisterReqDto } from '../models/dtos/request/auth.dto';

const authRouter = Router();

authRouter.post(
    '/',
    [validateDtoMiddleware(RegisterReqDto)],
    authController.register
);
authRouter.post(
    '/login',
    [validateDtoMiddleware(LoginReqDto)],
    authController.login
);

export default authRouter;
