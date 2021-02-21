import {
  EnvironmentConfiguration
} from "@/infrastructure/util/EnvironmentConfiguration"
import {
  MySQLTypeOrmConnection
} from "@/infrastructure/database/orm/connection/MySQLTypeOrmConnection"
import { UserOrm } from "@/infrastructure/database/orm/model/UserOrm"
import { StatusUser } from "@/domain/model/user/StatusUser"
import {
  UpdateUserAccountORMRepository
} from "@/infrastructure/database/orm"

import { RepositoryInternalError } from "@/data/error"
import { InvalidParamError } from "@/domain/errors"

const defaultParamData = {
  name: 'Any Name',
  email: 'valid@email.com',
  status: StatusUser.CREATED,
  password: 'EncryptedPassword',
  profileImage: 'path-image'
}

const config = EnvironmentConfiguration.database()
const connectionDatabase = new MySQLTypeOrmConnection(config)


describe('UpdateUserAccountORMRepository', () => {

  beforeAll(async () => {
    await connectionDatabase.open()
  })

  afterEach(async () => {
    await connectionDatabase.connection()
      .createQueryBuilder()
      .delete().from(UserOrm)
      .execute()
  })

  afterAll(async () => {
    await connectionDatabase.close()
  })

  test('should update user account existing', async () => {

    const result = await connectionDatabase.connection()
      .createQueryBuilder().insert().into(UserOrm)
      .values(defaultParamData).execute()

    const { id } = result.identifiers[0]

    const sut = new UpdateUserAccountORMRepository(connectionDatabase)
    const response = await sut.execute({ ...defaultParamData, status: StatusUser.DELETED, id })

    const user = await connectionDatabase.connection().getRepository(UserOrm)
      .createQueryBuilder('users')
      .where('users.id = :id', { id })
      .getOne()

    expect(response.isSuccess()).toBe(true)
    expect(user).toMatchObject({
      ...defaultParamData,
      status: StatusUser.DELETED,
      id
    })
  })

  test('should return failure when repository throws', async () => {
    jest.spyOn(connectionDatabase, 'connection').mockImplementationOnce(() => {
      throw new Error('Any error')
    })
    const sut = new UpdateUserAccountORMRepository(connectionDatabase)
    const response = await sut.execute({ ...defaultParamData, id: 'any-id' })

    expect(response.isFailure()).toBe(true)
    expect(response.value).toBeInstanceOf(RepositoryInternalError)
    expect(response.value).toEqual(new RepositoryInternalError(new Error('Any error')))
  })

  test('should return failure when user data is invalid', async () => {
    const sut = new UpdateUserAccountORMRepository(connectionDatabase)
    const response = await sut.execute({
      ...defaultParamData,
      id: 'valid-id',
      email:'invalid-email'
    })

    expect(response.isFailure()).toBe(true)
    expect(response.value).toBeInstanceOf(InvalidParamError)
    expect(response.value).toMatchObject({
      message: "Attribute 'email' equals 'invalid-email' is invalid!"
    })
  })

})