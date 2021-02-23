import {
  EnvironmentConfiguration
} from "@/infrastructure/util/EnvironmentConfiguration"
import {
  MySQLTypeOrmConnection
} from "@/infrastructure/database/orm/connection/MySQLTypeOrmConnection"
import { FindAllComicsORMPageableRepository, FindAllUserFavoriteComicsPageableORMRepository } from "@/infrastructure/database/orm"
import { ComicOrm } from "@/infrastructure/database/orm/model/ComicOrm"
import { RepositoryInternalError } from "@/data/error"
import { UserOrm } from "@/infrastructure/database/orm/model/UserOrm"
import { StatusUser } from "@/domain/model/user/StatusUser"
import { Pagination } from "@/domain/helper/Pagination"
import { ComicResponse } from "@/domain/model/comic/ComicData"
import { failure } from "@/shared/Either"



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
  characters:[]
}

const defaultParamData = {
  name: 'Any Name',
  email: 'valid@email.com',
  status: StatusUser.CREATED,
  password: 'EncryptedPassword',
  profileImage: 'path-image'
}


describe('FindAllUserFavoriteComicsPageableORMRepository', () => {
  beforeAll(async () => {
    await connectionDatabase.open()
  })

  beforeEach(async () => {
    await connectionDatabase.connection()
      .createQueryBuilder()
      .delete().from(UserOrm)
      .execute()

    await connectionDatabase.connection()
      .createQueryBuilder()
      .delete().from(ComicOrm)
      .execute()
  })

  afterAll(async () => {
    await connectionDatabase.close()
  })

  test('should return success when found register', async () => {
    const connection = connectionDatabase.connection()
    const comicRepository = connection.getRepository(ComicOrm)
    const userRepository = connection.getRepository(UserOrm)

    const comicSaved = await comicRepository.save(ComicOrm.create(defaultComicData as any).value as any)
    const userSaved = await userRepository.save(UserOrm.create(defaultParamData).value as any)
    const userFound = await userRepository.findOne(userSaved.id)
    userFound.favoriteComics = [comicSaved]
    await userRepository.save(userFound)


    const sut = new FindAllUserFavoriteComicsPageableORMRepository(connectionDatabase)
    const response = await sut.execute(userSaved.id, 1, 2)

    expect(response.isSuccess()).toBe(true)
    expect((response.value as Pagination<ComicResponse>).data).toHaveLength(1)
    expect(response.value).toMatchObject({
      from: 1,
      to: 1,
      perPage: 1,
      total: 1,
      currentPage: 1,
      prevPage: false,
      nextPage: false,
      data: expect.any(Array)
    })
  })

  test('should return success with empty data when not found', async () => {
 
    const sut = new FindAllUserFavoriteComicsPageableORMRepository(connectionDatabase)
    const response = await sut.execute('id-not-exist', 1, 2)

    expect(response.isSuccess()).toBe(true)
    expect((response.value as Pagination<ComicResponse>).data).toHaveLength(0)
    expect(response.value).toMatchObject({
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


  test('should return failure when orm throws error', async () => {
    jest.spyOn(connectionDatabase, 'connection').
      mockImplementationOnce(() =>{ throw new Error("Any error")})
 
    const sut = new FindAllUserFavoriteComicsPageableORMRepository(connectionDatabase)
    const response = await sut.execute('id-not-exist', 1, 2)

    expect(response.isFailure()).toBe(true)
    expect(response.value).toEqual(new RepositoryInternalError(new Error("Any error")))
   
  })


})


