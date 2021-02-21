import {
  EnvironmentConfiguration
} from "@/infrastructure/util/EnvironmentConfiguration"
import {
  MySQLTypeOrmConnection
} from "@/infrastructure/database/orm/connection/MySQLTypeOrmConnection"
import { CharacterOrm } from "@/infrastructure/database/orm/model/CharacterOrm"
import { ComicOrm } from "@/infrastructure/database/orm/model/ComicOrm"
import { FindComicByIdORMRepository } from "@/infrastructure/database/orm"
import { RepositoryInternalError } from "@/data/error"
import { NotFoundError } from '@/domain/errors'

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

describe('FindComicByIdORMRepository', () => {

  beforeAll(async () => {
    await connectionDatabase.open()
  })

  afterEach(async () => {
    await connectionDatabase.connection().createQueryBuilder()
      .delete().from(CharacterOrm).execute()

    await connectionDatabase.connection().createQueryBuilder()
      .delete().from(ComicOrm).execute()
  })

  afterAll(async () => await connectionDatabase.close())

  test('should return success when not found characters', async () => {
    const comicInserted = await connectionDatabase.connection()
      .createQueryBuilder().insert().into(ComicOrm)
      .values(ComicOrm.create(defaultComicData as any).value as any)
      .execute()

    const sut = new FindComicByIdORMRepository(connectionDatabase)
    const response = await sut.execute(comicInserted.identifiers[0].id)

    expect(response.isSuccess()).toBe(true)
    expect(response.value).toMatchObject(Object.assign(defaultComicData, { characters: [] }))
  })


  test('should return success when find by id', async () => {
    const characterInserted = await connectionDatabase.connection()
      .createQueryBuilder().insert().into(CharacterOrm)
      .values(CharacterOrm.create(defaultCharacterData).value)
      .execute()

    const { id } = characterInserted.identifiers[0]

    const comicRepository = connectionDatabase.connection().getRepository(ComicOrm)

    const comicInserted = await comicRepository.save({ ...defaultComicData, characters: [{ id }] } as any)

    const sut = new FindComicByIdORMRepository(connectionDatabase)
    const response = await sut.execute(comicInserted.id)

    expect(response.isSuccess()).toBe(true)
    expect(response.value).toMatchObject(Object.assign(defaultComicData, {
      characters: [defaultCharacterData]
    }))
  })

  test('should return failure when not find by id', async () => {
    const sut = new FindComicByIdORMRepository(connectionDatabase)
    const response = await sut.execute('not-exist-id')

    expect(response.isFailure()).toBe(true)
    expect(response.value).toEqual(new NotFoundError("Cannot found comic by id equals 'not-exist-id'!"));
  })

  test('should return failure when orm throws error', async () => {
    jest.spyOn(connectionDatabase, 'connection').mockImplementationOnce(() =>{ throw new Error("Any error")})
    const sut = new FindComicByIdORMRepository(connectionDatabase)
    const response = await sut.execute('not-exist-id')

    expect(response.isFailure()).toBe(true)
    expect(response.value).toEqual(new RepositoryInternalError(Error("Any error")));
  })


})