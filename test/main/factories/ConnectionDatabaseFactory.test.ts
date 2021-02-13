import {
  ConnectionDatabaseFactory
} from '@/main/factories/ConnectionDatabaseFactory'

import {
  MySQLTypeOrmConnection
} from '@/infrastructure/database/orm/connection/MySQLTypeOrmConnection'

describe('ConnectionDatabaseFactory', () => {
  test('should create connection factory', () => {
    const sut = ConnectionDatabaseFactory.makeConnectionFactory()
    expect(sut).toBeInstanceOf(MySQLTypeOrmConnection)
  })
})
