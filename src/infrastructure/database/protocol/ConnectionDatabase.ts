import { DatabaseConnectionError } from '@/infrastructure/error/DatabaseConnectionError'
import { Either } from '@/shared/Either'

export interface Config {
  host: string
  port: number
  username: string
  password: string
}

export interface ConnectionDatabase {
  connection: unknown
  open: (config: Config) => Promise<Either<DatabaseConnectionError, void>>
  close: () => Promise<Either<DatabaseConnectionError, void>>
}
