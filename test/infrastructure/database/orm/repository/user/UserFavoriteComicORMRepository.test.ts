import { EnvironmentConfiguration } from "@/infrastructure/util/EnvironmentConfiguration"
import { MySQLTypeOrmConnection } from "@/infrastructure/database/orm/connection/MySQLTypeOrmConnection"
import { UserOrm } from "@/infrastructure/database/orm/model/UserOrm"
import { ComicOrm } from "@/infrastructure/database/orm/model/ComicOrm"
import { StatusUser } from "@/domain/model/user/StatusUser"
import { Role } from "@/domain/model/user/AuthenticationData"
import { UserFavoriteComicORMRepository } from "@/infrastructure/database/orm"

const config = EnvironmentConfiguration.database()
const connectionDatabase = new MySQLTypeOrmConnection(config)

const defaultParamData = {
  name: 'Any Name',
  email: 'valid@email.com',
  status: StatusUser.CREATED,
  password: 'EncryptedPassword',
  profileImage: 'path-image',
  role: Role.USER
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

describe('UserFavoriteComicORMRepository', () => {

  beforeAll(async () => {
    await connectionDatabase.open()
  })

  afterEach(async () => {
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


  test('should call database connection', async () => {
    const userCreated = await connectionDatabase.connection()
      .createQueryBuilder().insert().into(UserOrm)
      .values(defaultParamData).execute()

    const comicInserted = await connectionDatabase.connection()
      .createQueryBuilder().insert().into(ComicOrm)
      .values(ComicOrm.create(defaultComicData as any).value as any)
      .execute()


    const sut = new UserFavoriteComicORMRepository(connectionDatabase)
    const response = await sut.favoriteComic({
      comicId: comicInserted.identifiers[0].id,
      userId: userCreated.identifiers[0].id
    })

    expect(response.isSuccess()).toBe(true)
  })

  test('should return failure when orm throws error', async () => {

    jest.spyOn(connectionDatabase, 'connection')
      .mockImplementationOnce(() => { throw new Error('Any operation error') })

    const sut = new UserFavoriteComicORMRepository(connectionDatabase)
    const response = await sut.favoriteComic({
      comicId: 'valid_id',
      userId: 'valid_id'
    })

    expect(response.isFailure()).toBe(true)
    expect(response.value).toEqual(new Error('Any operation error'))

  })


})