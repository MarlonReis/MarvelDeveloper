import { EnvironmentConfiguration } from "@/infrastructure/util/EnvironmentConfiguration"
import { MySQLTypeOrmConnection } from "@/infrastructure/database/orm/connection/MySQLTypeOrmConnection"
import { UserDisfavorComicORMRepository } from "@/infrastructure/database/orm"
import { UserOrm } from "@/infrastructure/database/orm/model/UserOrm"
import { StatusUser } from "@/domain/model/user/StatusUser"
import { ComicOrm } from "@/infrastructure/database/orm/model/ComicOrm"
import { RepositoryInternalError } from "@/data/error"

const defaultParamData = {
  name: 'Any Name',
  email: 'valid@email.com',
  status: StatusUser.CREATED,
  password: 'EncryptedPassword',
  profileImage: 'path-image'
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

const config = EnvironmentConfiguration.database()
const connectionDatabase = new MySQLTypeOrmConnection(config)

describe('UserDisfavorComicORMRepository', () => {
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

  test('should return success', async() => {
    const connection = connectionDatabase.connection()
    const comicRepository = connection.getRepository(ComicOrm)
    const userRepository = connection.getRepository(UserOrm)

    const comicSaved = await comicRepository.save(ComicOrm.create(defaultComicData as any).value as any)
    const userSaved = await userRepository.save(UserOrm.create(defaultParamData).value as any)
    const userFound = await userRepository.findOne(userSaved.id)
    userFound.favoriteComics = [comicSaved]
    await userRepository.save(userFound)


    const sut = new UserDisfavorComicORMRepository(connectionDatabase)
    const response = await sut.execute({
      comicId: comicSaved.id,
      userId: userSaved.id
    })
    const userWithoutFavoriteComics = await userRepository.findOne(userSaved.id)

    expect(userWithoutFavoriteComics.favoriteComics).toBeFalsy()
    expect(response.isSuccess()).toBe(true)
  })

  test('should return success', async () => {
    jest.spyOn(connectionDatabase, 'connection').mockImplementationOnce(() => {
      throw new Error('Any message')
    })

    const sut = new UserDisfavorComicORMRepository(connectionDatabase)
    const response = await sut.execute({ comicId: "valid id", userId: "valid id" })
   
    expect(response.value).toEqual(new RepositoryInternalError(new Error('Any message')))
    expect(response.isFailure()).toBe(true)
  })

})