import {
  EnvironmentConfiguration
} from "@/infrastructure/util/EnvironmentConfiguration"
import {
  MySQLTypeOrmConnection
} from "@/infrastructure/database/orm/connection/MySQLTypeOrmConnection"
import { FindAllComicsORMPageableRepository } from "@/infrastructure/database/orm"
import { ComicOrm } from "@/infrastructure/database/orm/model/ComicOrm"
import { RepositoryInternalError } from "@/data/error"


const config = EnvironmentConfiguration.database()
const connectionDatabase = new MySQLTypeOrmConnection(config)

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


describe('FindAllComicsORMPageableRepository', () => {

  beforeAll(async () => {
    await connectionDatabase.open()
  })

  beforeEach(async () => {
    await connectionDatabase.connection()
      .createQueryBuilder()
      .delete().from(ComicOrm)
      .execute()
  })

  afterAll(async () => {
    await connectionDatabase.close()
  })


  test('should return success when found register ', async () => {
    await connectionDatabase.connection()
      .createQueryBuilder().insert().into(ComicOrm)
      .values(ComicOrm.create(defaultComicData as any).value as any)
      .execute()

    const sut = new FindAllComicsORMPageableRepository(connectionDatabase)
    const response = await sut.execute(1, 1)

    expect(response.isSuccess()).toBe(true)
    expect(response.value).toEqual({
      from: 1,
      to: 1,
      perPage: 1,
      total: 1,
      currentPage: 1,
      prevPage: false,
      nextPage: false,
      data: expect.arrayContaining([
        Object.assign(defaultComicData, {
          id: expect.any(String),
          edition: 5,
          characters: []
        })
      ])
    })
  })

  test('should return empty when not found', async () => {
    const sut = new FindAllComicsORMPageableRepository(connectionDatabase)
    const response = await sut.execute(1, 1)

    expect(response.isSuccess()).toBe(true)
    expect(response.value).toEqual({
      from: 1,
      to: 0,
      perPage: 0,
      total: 0,
      currentPage: 1,
      prevPage: false,
      nextPage: false,
      data: []
    })
  })

  test('should return failure when orm throw error', async () => {
    jest.spyOn(connectionDatabase, 'connection').
      mockImplementationOnce(() => { throw new Error("Any error") })
   
    const sut = new FindAllComicsORMPageableRepository(connectionDatabase)
    const response = await sut.execute(1, 1)

    expect(response.isFailure()).toBe(true)
    expect(response.value).toEqual(new RepositoryInternalError(Error("Any error")));
  })

})