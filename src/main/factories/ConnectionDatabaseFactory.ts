import { Connection } from 'typeorm'

import { MySQLTypeOrmConnection } from '@/infrastructure/database/orm/connection/MySQLTypeOrmConnection'
import { ConnectionDatabase } from '@/infrastructure/database/protocol/ConnectionDatabase'
import { EnvironmentConfiguration } from '@/infrastructure/util/EnvironmentConfiguration'

export class ConnectionDatabaseFactory {
  makeConnectionFactory (): ConnectionDatabase<Connection> {
    const config = EnvironmentConfiguration.database()
    const connection = new MySQLTypeOrmConnection(config)
    return connection
  }
}
