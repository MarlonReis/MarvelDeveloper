import { Connection } from 'typeorm'

import { MySQLTypeOrmConnection } from './MySQLTypeOrmConnection'
import { ConnectionDatabase } from '@/infrastructure/database/protocol/ConnectionDatabase'
import { EnvironmentConfiguration } from '@/infrastructure/util/EnvironmentConfiguration'

export class ConnectionDatabaseFactory {
  private ConnectionDatabaseFactory () { }
  static makeConnectionFactory (): ConnectionDatabase<Connection> {
    const config = EnvironmentConfiguration.database()
    const connection = new MySQLTypeOrmConnection(config)
    return connection
  }
}
