import {
  EnvironmentConfiguration
} from "@/infrastructure/util/EnvironmentConfiguration"
import {
  MySQLTypeOrmConnection
} from "@/infrastructure/database/orm/connection/MySQLTypeOrmConnection"
import { CharacterOrm } from "@/infrastructure/database/orm/model/CharacterOrm"
import { FindCharacterByIdORMRepository } from "@/infrastructure/database/orm"
import { NotFoundError, RepositoryInternalError } from "@/data/error"
import { failure } from "@/shared/Either"

const config = EnvironmentConfiguration.database()
const connectionDatabase = new MySQLTypeOrmConnection(config)

const defaultCharacterData = {
  name: "Any Name",
  description: "Any description",
  topImage: "https://example.com/image-top-image.png",
  profileImage: "https://example.com/image-profile-image.png",
}

describe('FindCharacterByIdORMRepository', () => {

  beforeAll(async () => {
    await connectionDatabase.open()
  })

  beforeEach(async () => {
    await connectionDatabase.connection()
      .createQueryBuilder()
      .delete()
      .from(CharacterOrm)
      .execute()
  })

  afterAll(async () => await connectionDatabase.close())

  test('should return success when found character by id', async () => {
    const character = CharacterOrm.create(defaultCharacterData)

    const characterInserted = await connectionDatabase.connection()
      .createQueryBuilder().insert().into(CharacterOrm)
      .values(character.value).execute()

    const { id } = characterInserted.identifiers[0]

    const sut = new FindCharacterByIdORMRepository(connectionDatabase)
    const response = await sut.execute(id)

    expect(response.isSuccess()).toBe(true)
    expect(response.value).toEqual({
      ...defaultCharacterData,
      id, comic: undefined
    })
  })

  test('should return failure when not found register by id ', async () => {
    const sut = new FindCharacterByIdORMRepository(connectionDatabase)
    const response = await sut.execute('valid-id')

    expect(response.isFailure()).toBe(true)
    expect(response.value).toEqual(new NotFoundError("Cannot found character by id equals 'valid-id'!"))
    expect(response.value).toMatchObject({
      message: "Cannot found character by id equals 'valid-id'!"
    })
  })

  test('should return failure when orm throws error', async () => {

    jest.spyOn(connectionDatabase, 'connection').
      mockImplementationOnce(() => { throw new Error("Any error") })

    const sut = new FindCharacterByIdORMRepository(connectionDatabase)
    const response = await sut.execute('valid-id')

    expect(response.isFailure()).toBe(true)
    expect(response.value).toEqual(new RepositoryInternalError(new Error("Any error")))
    expect(response.value).toMatchObject({
      cause: new Error("Any error"),
      message: "Any error"
    })
  })


})