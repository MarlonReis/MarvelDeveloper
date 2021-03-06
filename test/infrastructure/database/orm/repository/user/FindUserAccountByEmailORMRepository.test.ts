import {
  FindUserAccountByEmailORMRepository
} from '@/infrastructure/database/orm/repository/user/FindUserAccountByEmailORMRepository'

import {
  MySQLTypeOrmConnection
} from '@/infrastructure/database/orm/connection/MySQLTypeOrmConnection'

import {
  CreateUserAccountORMRepository
} from '@/infrastructure/database/orm/repository/user/CreateUserAccountORMRepository'
import { UserOrm } from '@/infrastructure/database/orm/model/UserOrm'
import { StatusUser } from '@/domain/model/user/StatusUser'
import { RepositoryInternalError } from '@/data/error'
import { NotFoundError } from '@/domain/errors'
import { EnvironmentConfiguration } from '@/infrastructure/util/EnvironmentConfiguration'

describe('FindUserAccountByEmailORMRepository', () => {
  let connectionDatabase: MySQLTypeOrmConnection
  let sut: FindUserAccountByEmailORMRepository

  beforeAll(async () => {
    const config = EnvironmentConfiguration.database()
    connectionDatabase = new MySQLTypeOrmConnection(config)
    await connectionDatabase.open()
  })

  beforeEach(async () => {
    sut = new FindUserAccountByEmailORMRepository(connectionDatabase)

    await connectionDatabase.connection()
      .createQueryBuilder()
      .delete()
      .from(UserOrm)
      .execute()
  })

  afterAll(async () => {
    await connectionDatabase.close()
  })

  test('should return user account when found by email', async () => {
    const createUserAccount = new CreateUserAccountORMRepository(connectionDatabase)
    await createUserAccount.execute({
      name: 'Any Name', email: 'example@email.com.br', password: 'V4lid@P4ssW0rd'
    })

    await createUserAccount.execute({
      name: 'Other Any Name', email: 'other@example.com.br', password: 'V4lid@P4ssW0rd'
    })

    const response = await sut.execute('example@email.com.br')
    expect(response.isSuccess()).toBe(true)
    expect(response.value).toMatchObject({
      name: 'Any Name',
      email: 'example@email.com.br',
      status: StatusUser.CREATED
    })
  })

  test('should return not found when not found register', async () => {
    const response = await sut.execute('not_exist@email.com')
    expect(response.isFailure()).toBe(true)
    expect(response.value).toBeInstanceOf(NotFoundError)
    expect(response.value).toMatchObject({
      message: "Cannot found account by email equals 'not_exist@email.com'!"
    })
  })

  test('should return same error that orm throws', async () => {
    jest.spyOn(connectionDatabase, 'connection')
      .mockImplementationOnce(() => { throw new Error('Any operation error') })

    sut = new FindUserAccountByEmailORMRepository(connectionDatabase)

    const response = await sut.execute('not_exist@email.com')
    expect(response.isFailure()).toBe(true)
    expect(response.value).toEqual(new RepositoryInternalError(new Error('Any operation error')))
  })
})
