import { pinoHttp, type HttpLogger } from 'pino-http';
import pino from 'pino';

const logger: HttpLogger = pinoHttp({
  level: process.env.PINO_LOG_LEVEL || 'info',
  formatters: {
    level: (label: string) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;
