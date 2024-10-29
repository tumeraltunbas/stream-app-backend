import winston from 'winston';
const { combine, timestamp, json } = winston.format;

const logger: winston.Logger = winston.createLogger({
   level: 'info',
   format: combine(timestamp(), json()),
   transports: [new winston.transports.Console()]
});

export default logger;
