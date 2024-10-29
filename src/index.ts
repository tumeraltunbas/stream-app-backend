import express from 'express';
import config from './config/config';
import appRouter from './routes';
import * as databaseService from './services/database.service';
import { errorHandler } from './infrastructure/handlers/error.handler';

async function build() {
   const app = express();
   await databaseService.initializeDatabase();

   app.use(express.json());
   app.use('/api', appRouter);
   app.use(errorHandler);

   app.listen(config.port);
}

build();
