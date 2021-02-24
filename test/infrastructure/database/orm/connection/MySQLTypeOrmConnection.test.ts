import { MySQLTypeOrmConnection } from '@/infrastructure/database/orm/connection/MySQLTypeOrmConnection'
import { DatabaseConnectionError } from '@/infrastructure/error/DatabaseConnectionError'
import { EnvironmentConfiguration } from '@/infrastructure/util/EnvironmentConfiguration'
import { Either } from '@/shared/Either'

import * as typeorm from 'typeorm'

const config = EnvironmentConfiguration.database()
const connectionDatabase = new MySQLTypeOrmConnection(config)

describe('MySQLTypeOrmConnection', () => {
  let responseOpenConnection: Either<DatabaseConnectionError, void>

  beforeEach(async () => {
    responseOpenConnection = await connectionDatabase.open()
  })

  afterEach(async () => await connectionDatabase.close())

  test('should connect with database', () => {
    expect(responseOpenConnection.isSuccess()).toBe(true)
    expect(connectionDatabase.connection()).toBeTruthy()
  })

  test('should return failure when cannot cannot connect with database', async () => {
    const connectionDatabase = new MySQLTypeOrmConnection({
      host: 'localhost',
      port: 3306,
      username: 'InvalidUsername',
      password: 'InvalidPassword'

    })
    const response = await connectionDatabase.open()

    expect(response.isFailure()).toBe(true)
    expect(response.value).toBeInstanceOf(DatabaseConnectionError)
    expect(response.value).toMatchObject({
      message: 'Internal application error!',
      cause: expect.any(Error)
    })
  })

  test('should return same error throws by orm', async () => {
    jest.spyOn(typeorm, 'createConnection')
      .mockImplementationOnce(() => {
        throw new Error('Any error')
      })

    const response = await connectionDatabase.open()
    expect(response.isFailure()).toBe(true)
    expect(connectionDatabase.connection()).toBeFalsy()
    expect(response.value).toMatchObject({
      cause: new Error('Any error')
    })
    expect(response.value).toEqual(new DatabaseConnectionError(
      new Error('Any error'),
      'Internal application error!'))
  })

  test('should close connection', async () => {
    const response = await connectionDatabase.close()
    expect(response.isSuccess()).toBe(true)
    expect(connectionDatabase.connection()).toBeFalsy()
  })

  test('should ensure that connection received correct params', async () => {
    const createConnectionSpy = jest.spyOn(typeorm, 'createConnection')

    const connectionDatabase = new MySQLTypeOrmConnection({
      host: 'any-host',
      port: 3306,
      username: 'AnyValidUser',
      password: 'AnyValid'
    })

    await connectionDatabase.open()

    expect(createConnectionSpy).toBeCalledWith({
      type: 'mysql',
      database: 'marvel_database',
      synchronize: expect.any(Boolean),
      logging: expect.any(Boolean),
      host: 'any-host',
      port: expect.any(Number),
      username: 'AnyValidUser',
      password: 'AnyValid',
      entities: expect.any(Array)
    })
  })
})
