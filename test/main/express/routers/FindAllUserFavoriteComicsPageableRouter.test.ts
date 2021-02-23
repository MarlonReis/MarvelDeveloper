import request from 'supertest'
import app from '@/main/express/config/App'
import {
  ConnectionDatabaseFactory
} from '@/main/factories/ConnectionDatabaseFactory'
import { ComicOrm } from '@/infrastructure/database/orm/model/ComicOrm'
import { insertUserMock } from './InsertUserMock'
import { Role } from '@/domain/model/user/AuthenticationData'
import { UserOrm } from '@/infrastructure/database/orm/model/UserOrm'

const connectionDatabase = new ConnectionDatabaseFactory()
  .makeConnectionFactory()

const defaultComicData = {
  title: "Any Title",
  published: "2020-10-10",
  writer: "Any Writer",
  penciler: "Any Penciler",
  coverArtist: "Any Cover Artist",
  description: "Any Description",
  edition: 5,
  coverImage: "http://server.com/images.png",
  characters: []
}


describe('FindAllUserFavoriteComicsPageableRouter', () => {

  beforeEach(async () => {
    await connectionDatabase.open()

    await connectionDatabase.connection().
      createQueryBuilder().delete().
      from(UserOrm).execute()

    await connectionDatabase.connection().
      createQueryBuilder().delete().
      from(ComicOrm).execute()
  })

  afterAll(async () => {
    await connectionDatabase.close()
  })

  test('should return 401 when not have token', async () => {
    await request(app).get('/api/users/comics').
      set('Accept', 'application/json').
      expect('Content-Type', /json/).
      expect(401)
  })

  test('should return 200 when not have comics', async () => {

    const { token } = await insertUserMock(connectionDatabase, {
      name: 'Any Name',
      email: 'any@valid.com',
      password: 'Password@Valid',
      role: Role.ADMIN
    })

    await request(app).get('/api/users/comics').
      set({ 'Authorization': `Bearer ${token.value}` }).
      set('Accept', 'application/json').
      expect('Content-Type', /json/).
      expect(200)
  })

  test('should return 500 when not have database connection', async () => {

    const { token } = await insertUserMock(connectionDatabase, {
      name: 'Any Name',
      email: 'any@valid.com',
      password: 'Password@Valid',
      role: Role.ADMIN
    })

    await connectionDatabase.close()

    await request(app).get('/api/users/comics').
      set({ 'Authorization': `Bearer ${token.value}` }).
      set('Accept', 'application/json').
      expect('Content-Type', /json/).
      expect(500)
  })

})