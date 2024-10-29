import { Db, MongoClient } from 'mongodb';
import config, { DatabaseConfig } from '../config/config';
import logger from '../utils/logger.util';

const databaseConfig: DatabaseConfig = config.databaseConfig;
const mongoClient: MongoClient = new MongoClient(
   databaseConfig.connectionString
);

let db: Db;

const connect = async (): Promise<Db> => {
   let connection;
   try {
      connection = await mongoClient.connect();
      db = connection.db();
      return db;
   } catch (error) {
      logger.error('Database Service - connect', { error });
      throw Error('DB CONNECTION ERROR');
   }
};

export const getDatabase = async (): Promise<Db> => {
   if (db) {
      return db;
   } else {
      const db = await connect();
      return db;
   }
};

export const initializeDatabase = async () => {
   await connect();
   //TODO: Collection configuration
};
