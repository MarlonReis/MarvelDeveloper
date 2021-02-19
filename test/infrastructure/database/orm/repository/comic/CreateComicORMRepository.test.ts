import { EnvironmentConfiguration } from "@/infrastructure/util/EnvironmentConfiguration"
import { MySQLTypeOrmConnection } from "@/infrastructure/database/orm/connection/MySQLTypeOrmConnection"
import { CharacterOrm } from "@/infrastructure/database/orm/model/CharacterOrm"
import { CreateComicORMRepository } from "@/infrastructure/database/orm"
import { ComicOrm } from "@/infrastructure/database/orm/model/ComicOrm"
import { RepositoryInternalError } from "@/data/error"

const config = EnvironmentConfiguration.database()
const connectionDatabase = new MySQLTypeOrmConnection(config)


const defaultCharacterData = {
  name: "Any Name",
  description: "Any description",
  topImage: "https://example.com/image-top-image.png",
  profileImage: "https://example.com/image-profile-image.png",
}

const defaultComicData = {
  title: "Any Title",
  published: "2020-10-10",
  writer: "Any Writer",
  penciler: "Any Penciler",
  coverArtist: "Any Cover Artist",
  description: "Any Description",
  edition: "5",
  coverImage: "http://server.com/images.png",
}


describe('CreateComicORMRepository', () => {
  beforeAll(async () => {
    await connectionDatabase.open()
  })

  afterEach(async () => {
    await connectionDatabase.connection()
      .createQueryBuilder()
      .delete()
      .from(CharacterOrm)
      .execute()

    await connectionDatabase.connection()
      .createQueryBuilder()
      .delete()
      .from(ComicOrm)
      .execute()
  })

  afterAll(async () => await connectionDatabase.close())

  test('should return success when create register', async () => {
    const characterInserted = await connectionDatabase.connection()
      .createQueryBuilder().insert().into(CharacterOrm)
      .values(CharacterOrm.create(defaultCharacterData).value).execute()

    const { id } = characterInserted.identifiers[0]

    const sut = new CreateComicORMRepository(connectionDatabase)
    const response = await sut.execute({
      ...defaultComicData,
      characters: [{ id }]
    })

    expect(response.isSuccess()).toBe(true)
  })

  test('should return failure when receive invalid param', async () => {
    const sut = new CreateComicORMRepository(connectionDatabase)
    const response = await sut.execute({ ...defaultComicData, title: undefined } as any)

    expect(response.isFailure()).toBe(true)
    expect(response.value).toMatchObject({
      message: "Attribute 'title' equals 'undefined' is invalid!"
    })
  })

  test('should return failure when orm throws error', async () => {
    
    jest.spyOn(connectionDatabase, 'connection').
      mockImplementationOnce(() => { throw new Error("Any error") })
    
    const sut = new CreateComicORMRepository(connectionDatabase)
    const response = await sut.execute(defaultComicData as any)

    expect(response.isFailure()).toBe(true)
    expect(response.value).toEqual(new RepositoryInternalError(new Error("Any error")))
    expect(response.value).toMatchObject({
      cause: new Error("Any error"),
      message: "Any error"
    })
  })


})