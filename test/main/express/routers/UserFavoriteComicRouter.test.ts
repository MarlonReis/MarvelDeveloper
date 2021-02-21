import request from 'supertest'
import app from '@/main/express/config/App'
import {
  ConnectionDatabaseFactory
} from '@/main/factories/ConnectionDatabaseFactory'
import { ComicOrm } from '@/infrastructure/database/orm/model/ComicOrm'
import { deleteAllUserMock, insertUserMock } from './InsertUserMock'
import { Role } from '@/domain/model/user/AuthenticationData'


const connectionDatabase = new ConnectionDatabaseFactory()
  .makeConnectionFactory()

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

describe('UserFavoriteComicRouter', () => {
  let tokenAdmin: string

  beforeEach(async () => {
    await connectionDatabase.open()

    const { token } = await insertUserMock(connectionDatabase, {
      name: 'Any Name',
      email: 'any@valid.com',
      password: 'Password@Valid',
      role: Role.ADMIN
    })

    tokenAdmin = token.value
  })

  afterAll(async () => {
    if (connectionDatabase.connection()) {
      await connectionDatabase.connection().
        createQueryBuilder().delete().
        from(ComicOrm).execute()

      await deleteAllUserMock(connectionDatabase)
    }

    await connectionDatabase.close()
  })


  test('should return 401 when not have token', async () => {
    await request(app).post('/api/account/comics').
      send({ comicId: '' }).expect(401)
  })

  test('should return 200 when favorite comics', async () => {
    const comicInserted = await connectionDatabase.connection()
      .createQueryBuilder().insert().into(ComicOrm)
      .values(ComicOrm.create(defaultComicData as any).value as any)
      .execute()

    const { id } = comicInserted.identifiers[0]

    await request(app).post('/api/account/comics').
      set({ 'Authentication': `Bearer ${tokenAdmin}` }).
      send({ comicId: id }).
      expect(200)
  })

  test('should return 404 when not found comic by id', async () => {
    await request(app).post('/api/account/comics').
      set({ 'Authentication': `Bearer ${tokenAdmin}` }).
      send({ comicId: 'id_not_exist' }).
      expect(404)
  })

  test('should return 400 when comic id undefined', async () => {
    await request(app).post('/api/account/comics').
      set({ 'Authentication': `Bearer ${tokenAdmin}` }).
      send().expect(400)
  })


})