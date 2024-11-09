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
      accessToken: {
         name: process.env.ACCESS_TOKEN_NAME!,
         secretKey: process.env.ACCESS_TOKEN_SECRET_KEY!,
         expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN!
      },
      refreshToken: {
         name: process.env.REFRESH_TOKEN_NAME!,
         secretKey: process.env.REFRESH_TOKEN_SECRET_KEY!,
         expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN!
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
   accessToken: {
      name: string;
      expiresIn: string;
      secretKey: string;
   };
   refreshToken: {
      name: string;
      expiresIn: string;
      secretKey: string;
   };
}

export default config;
