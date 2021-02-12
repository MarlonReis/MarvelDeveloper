import { DatabaseConnectionError } from '@/infrastructure/error/DatabaseConnectionError'
import { Either } from '@/shared/Either'

export interface ConfigConnection {
  host: string
  port: number
  username: string
  password: string
}

export interface ConnectionDatabase<T> {
  open: () => Promise<Either<DatabaseConnectionError, void>>
  close: () => Promise<Either<DatabaseConnectionError, void>>
  connection: () => T
}
