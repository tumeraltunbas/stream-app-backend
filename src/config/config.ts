import dotenv from 'dotenv';

dotenv.config();

export const config: Config = {
   port: parseInt(process.env.PORT!)
};

export interface Config {
   port: number;
}

export default config;
