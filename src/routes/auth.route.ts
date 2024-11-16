import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post('/', authController.register);
authRouter.post('/login', authController.login);

export default authRouter;
