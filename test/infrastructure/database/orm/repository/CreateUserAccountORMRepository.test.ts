import { RepositoryInternalError } from '@/data/error'
import { MySQLTypeOrmConnection } from '@/infrastructure/database/orm/connection/MySQLTypeOrmConnection'
import { CreateUserAccountORMRepository } from '@/infrastructure/database/orm/repository/CreateUserAccountORMRepository'

const connectionDatabase = new MySQLTypeOrmConnection({
  host: 'localhost',
  port: 3306,
  username: 'admin',
  password: 'M4rv3lD4t4BaS3'
})

describe('CreateUserAccountORMRepository', () => {
  beforeEach(async () => {
    await connectionDatabase.open()
  })

  afterEach(async () => await connectionDatabase.close())

  test('should create user account and return success', async () => {
    const sut = new CreateUserAccountORMRepository(connectionDatabase)
    const response = await sut.execute({
      name: 'Any Name',
      email: 'example@email.com.br',
      password: 'V4lid@P4ssW0rd'
    })

    expect(response.isSuccess()).toBe(true)
  })

  test('should return error when not have connection with database', async () => {
    await connectionDatabase.close()
    const sut = new CreateUserAccountORMRepository(connectionDatabase)
    const response = await sut.execute({
      name: 'Any Name',
      email: 'example@email.com.br',
      password: 'V4lid@P4ssW0rd'
    })

    expect(response.isFailure()).toBe(true)
    expect(response.value).toBeInstanceOf(RepositoryInternalError)
    expect(response.value).toMatchObject({
      message: expect.any(String),
      cause: expect.any(Error)
    })
  })

  test('should return same error that orm throws', async () => {
    jest.spyOn(connectionDatabase, 'connection')
      .mockImplementationOnce(() => { throw new Error('Any operation error') })

    const sut = new CreateUserAccountORMRepository(connectionDatabase)
    const response = await sut.execute({
      name: 'Any Name',
      email: 'example@email.com.br',
      password: 'V4lid@P4ssW0rd'
    })

    const errorThrows = Error('Any operation error')

    expect(response.isFailure()).toBe(true)
    expect(response.value).toBeInstanceOf(RepositoryInternalError)
    expect(response.value).toMatchObject({
      message: errorThrows.message,
      cause: errorThrows
    })
  })
})
