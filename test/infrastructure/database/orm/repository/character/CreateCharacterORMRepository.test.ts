import { EnvironmentConfiguration } from "@/infrastructure/util/EnvironmentConfiguration"
import { MySQLTypeOrmConnection } from "@/infrastructure/database/orm/connection/MySQLTypeOrmConnection"
import {
  CreateCharacterORMRepository
} from "@/infrastructure/database/orm"
import { RepositoryInternalError } from "@/data/error"
import { CharacterOrm } from "@/infrastructure/database/orm/model/CharacterOrm"

const config = EnvironmentConfiguration.database()
const connectionDatabase = new MySQLTypeOrmConnection(config)

const defaultCharacterData = {
  name: 'Any Valid Name',
  description: 'Any description',
  topImage: 'https://example.com/image.png',
  profileImage: 'https://example.com/image.png'
}

describe('CreateCharacterRepository', () => {
  beforeAll(async () => {
    await connectionDatabase.open()
  })

  beforeEach(async() => {
    await connectionDatabase.connection()
    .createQueryBuilder()
    .delete()
    .from(CharacterOrm)
    .execute()
  })

  afterAll(async () => await connectionDatabase.close())

  test('should return success when create character', async () => {
    const sut = new CreateCharacterORMRepository(connectionDatabase)
    const response = await sut.execute(defaultCharacterData)
    expect(response.isSuccess()).toBe(true)
  })

  test('should return failure when attribute is invalid', async () => {
    const sut = new CreateCharacterORMRepository(connectionDatabase)
    const response = await sut.execute({
      ...defaultCharacterData,
      topImage: 'invalid-path'
    })

    expect(response.isFailure()).toBe(true)
    expect(response.value).toMatchObject({
      message: "Attribute 'topImage' equals 'invalid-path' is invalid!"
    })
  })


  test('should return failure when orm throws error', async () => {

    jest.spyOn(connectionDatabase, 'connection').
      mockImplementationOnce(() => { throw new Error("Any error") })

    const sut = new CreateCharacterORMRepository(connectionDatabase)
    const response = await sut.execute(defaultCharacterData)

    expect(response.isFailure()).toBe(true)
    expect(response.value).toEqual(new RepositoryInternalError(Error("Any error")))
    expect(response.value).toMatchObject({
      message: "Any error",
      cause: Error("Any error")
    })
  })
})