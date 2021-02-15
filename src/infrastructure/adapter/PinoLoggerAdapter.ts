import { LoggerSystem } from '@/infrastructure/util/LoggerSystem'

import pino from 'pino'

export class PinoLoggerAdapter implements LoggerSystem {
  private readonly logger: pino.Logger

  constructor () {
    this.logger = pino({
      prettyPrint: {
        colorize: true,
        levelFirst: true,
        messageFormat: '{filename}: {msg}',
        translateTime: 'yyyy-mm-dd HH:MM:ss',
        ignore: 'pid,hostname,filename'
      }
    })
  }

  info (fileOrigin: string, message: string): void {
    this.logger.child({ filename: fileOrigin }).info(message)
  }

  error (fileOrigin: string, error: Error): void {
    this.logger.child({ filename: fileOrigin }).error(error)
  }

  warn (fileOrigin: string, message: string): void {
    this.logger.child({ filename: fileOrigin }).warn(message)
  }
}
