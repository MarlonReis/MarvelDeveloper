import {
  ConnectionDatabaseFactory
} from '@/main/factories/ConnectionDatabaseFactory'

import {
  MySQLTypeOrmConnection
} from '@/infrastructure/database/orm/connection/MySQLTypeOrmConnection'

describe('ConnectionDatabaseFactory', () => {
  test('should create connection factory', () => {
    const sut = new ConnectionDatabaseFactory()
    const response = sut.makeConnectionFactory()
    expect(response).toBeInstanceOf(MySQLTypeOrmConnection)
  })
})
