import dotenv from 'dotenv';

dotenv.config();

export const config: Config = {
   port: parseInt(process.env.PORT!),
   databaseConfig: {
      connectionString: process.env.MONGO_CONNECTION_STRING!
   },
   securityConfig: {
      password: {
         saltLength: 15
      },
      jwt: {
         cookieName: process.env.JWT_COOKIE_NAME!,
         secretKey: process.env.JWT_SECRET_KEY!,
         expiresIn: process.env.JWT_EXPIRES_IN!
      }
   }
};

export interface Config {
   port: number;
   databaseConfig: DatabaseConfig;
   securityConfig: SecurityConfig;
}

export interface DatabaseConfig {
   connectionString: string;
}

export interface SecurityConfig {
   password: {
      saltLength: number;
   };
   jwt: {
      cookieName: string;
      secretKey: string;
      expiresIn: string;
   };
}

export default config;
