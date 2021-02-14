import { LoggerSystem } from '@/infrastructure/util/LoggerSystem'

import * as pino from 'pino'

const logger = pino.default({
  prettyPrint: {
    colorize: true,
    levelFirst: true,
    messageFormat: '{filename}: {msg}',
    translateTime: 'yyyy-mm-dd HH:MM:ss',
    ignore: 'pid,hostname,filename'
  }
})

export class PinoLoggerAdapter implements LoggerSystem {
  info (fileOrigin: string, message: string): void {
    logger.child({ filename: fileOrigin }).info(message)
  }

  error (fileOrigin: string, error: Error): void {
    logger.child({ filename: fileOrigin }).error(error)
  }

  warn (fileOrigin: string, message: string): void {
    logger.child({ filename: fileOrigin }).warn(message)
  }
}
