import 'reflect-metadata'
import { createConnection, Connection } from 'typeorm'

import { Config, ConnectionDatabase } from '@/infrastructure/database/protocol/ConnectionDatabase'
import { Either, failure, success } from '@/shared/Either'
import { DatabaseConnectionError } from '@/infrastructure/error/DatabaseConnectionError'

export const MySQLTypeOrmConnection: ConnectionDatabase = {
  connection: Connection,
  async open (config: Config): Promise<Either<DatabaseConnectionError, void>> {
    try {
      const connection: Connection = await createConnection({
        type: 'mysql',
        database: 'marvel_database',
        synchronize: true,
        logging: true,
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password
      })

      this.connection = connection
      return success()
    } catch (err) {
      return failure(new DatabaseConnectionError(err, 'Internal application error!'))
    }
  },
  async close (): Promise<Either<DatabaseConnectionError, void>> {
    if (this.connection) {
      this.connection.close()
    }
    this.connection = undefined
    return success()
  }
}
