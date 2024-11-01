import { NextFunction, RequestHandler } from 'express';
import { createUser } from '../services/auth.service';
import { RegisterReqDto } from '../models/dtos/request/auth.dto';
import { successResponseHandler } from '../infrastructure/handlers/success.handler';
import HTTP_CODES from 'http-status-codes';
import { CreateUserResDto } from '../models/dtos/response/auth.dto';

export const register: RequestHandler = async (
   req,
   res,
   next
): Promise<void> => {
   const { username, email, password } = req.body;

   const registerReqDto: RegisterReqDto = {
      username,
      email,
      password
   };

   const response: CreateUserResDto = await createUser(registerReqDto, next);

   res.status(HTTP_CODES.CREATED).cookie('jwt', response.token).json({});
};
