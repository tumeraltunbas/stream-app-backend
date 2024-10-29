import { Router } from 'express';
import authRouter from './auth.route';

const appRouter: Router = Router();

appRouter.use('/auth', authRouter);

export default appRouter;
