import express from 'express';
import config from './config/config';
import appRouter from './routes';
import { errorHandler } from './infrastructure/handlers/error.handler';
import * as databaseService from './services/database.service';

const app = express();

databaseService.initializeDatabase().then(() => {
    app.use(express.json());
    app.use('/api', appRouter);
    app.use(errorHandler);
    app.listen(config.port);
});
