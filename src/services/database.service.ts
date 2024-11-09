import { Db, MongoClient } from 'mongodb';
import config, { DatabaseConfig } from '../config/config';
import logger from '../utils/logger.util';
import schemaValidations from '../models/schema_validations';

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
   await configureCollections();
};

const configureCollections = async () => {
   const dbCollections = await db.listCollections().toArray();

   for (const collection of schemaValidations) {
      const isExist = dbCollections.find(
         (c) => c.name === collection.collectionName
      );

      if (isExist) {
         try {
            await db.command({
               collMod: collection.collectionName,
               ...collection.validations,
               validationAction: 'error',
               validationLevel: 'strict'
            });
         } catch (error) {
            logger.error('Database Service - configure collections', {
               collectionName: collection.collectionName,
               error
            });
         }
      } else {
         try {
            await db.createCollection(collection.collectionName, {
               ...collection.validations,
               validationAction: 'error',
               validationLevel: 'strict'
            });
         } catch (error) {
            logger.error('Database Service - configure collections', { error });
         }
      }
   }
};
