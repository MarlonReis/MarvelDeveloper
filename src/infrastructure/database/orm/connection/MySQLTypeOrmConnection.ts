import 'reflect-metadata'
import { createConnection, Connection } from 'typeorm'

import { Config, ConnectionDatabase } from '@/infrastructure/database/protocol/ConnectionDatabase'
import { Either, failure, success } from '@/shared/Either'
import { DatabaseConnectionError } from '@/infrastructure/error/DatabaseConnectionError'

export class MySQLTypeOrmConnection implements ConnectionDatabase<Connection> {
  private static _connection: Connection = undefined

  async open (config: Config): Promise<Either<DatabaseConnectionError, void>> {
    try {
      const connection: Connection = await createConnection({
        type: 'mysql',
        database: 'marvel_database',
        synchronize: true,
        logging: false,
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        entities: ['src/infrastructure/database/orm/model/*.ts']
      })

      MySQLTypeOrmConnection._connection = connection
      return success()
    } catch (err) {
      return failure(new DatabaseConnectionError(err, 'Internal application error!'))
    }
  }

  async close (): Promise<Either<DatabaseConnectionError, void>> {
    if (MySQLTypeOrmConnection._connection) {
      MySQLTypeOrmConnection._connection.close()
    }
    MySQLTypeOrmConnection._connection = undefined
    return success()
  }

  connection (): Connection {
    return MySQLTypeOrmConnection._connection
  }
}