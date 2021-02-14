import {
  EnvironmentConfiguration
} from "@/infrastructure/util/EnvironmentConfiguration"
import {
  MySQLTypeOrmConnection
} from "@/infrastructure/database/orm/connection/MySQLTypeOrmConnection"
import { UserOrm } from "@/infrastructure/database/orm/model/UserOrm"
import { StatusUser } from "@/domain/model/user/StatusUser"
import {
  FindUserAccountByIdORMRepository
} from "@/infrastructure/database/orm/repository/FindUserAccountByIdORMRepository"
import { NotFoundError, RepositoryInternalError } from "@/data/error"

const config = EnvironmentConfiguration.database()
const connectionDatabase = new MySQLTypeOrmConnection(config)

describe('FindUserAccountByIdRepository', () => {

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

  test('should find user account by id', async () => {
    const result = await connectionDatabase.connection()
      .createQueryBuilder().insert().into(UserOrm)
      .values({
        name: 'Any Name',
        email: 'valid@email.com',
        status: StatusUser.CREATED,
        password: 'EncryptedPassword',
        profileImage: 'path-image'
      }).execute()

    const { id } = result.identifiers[0]

    const sut = new FindUserAccountByIdORMRepository(connectionDatabase)
    const response = await sut.execute(id)

    expect(response.isSuccess()).toBe(true)
    expect(response.value).toMatchObject({
      id: expect.any(String),
      name: 'Any Name',
      email: 'valid@email.com',
      status: StatusUser.CREATED,
      profileImage: 'path-image'
    })

  })

  test('should return failure when not found rester by id', async () => {
    const sut = new FindUserAccountByIdORMRepository(connectionDatabase)
    const response = await sut.execute('invalid-id')

    expect(response.isFailure()).toBe(true)
    expect(response.value).toEqual(new NotFoundError(`Cannot found account by id equals 'invalid-id'!`))
  })

  test('should return failure when repository throws error', async () => {
    
    const sut = new FindUserAccountByIdORMRepository(connectionDatabase)
    jest.spyOn(connectionDatabase, 'connection')
      .mockImplementationOnce(() => { throw new Error('Any message') })
    
    const response = await sut.execute('invalid-id')

    expect(response.isFailure()).toBe(true)
    expect(response.value).toEqual(new RepositoryInternalError(Error('Any message')))
  })


})