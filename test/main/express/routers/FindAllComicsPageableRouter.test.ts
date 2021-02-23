import request from 'supertest'
import app from '@/main/express/config/App'
import {
  ConnectionDatabaseFactory
} from '@/main/factories/ConnectionDatabaseFactory'
import { ComicOrm } from '@/infrastructure/database/orm/model/ComicOrm'


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


describe('FindAllComicsPageableRouter', () => {
  beforeEach(async () => {
    await connectionDatabase.open()

    await connectionDatabase.connection().
      createQueryBuilder().delete().
      from(ComicOrm).execute()
  })

  afterAll(async () => {
    await connectionDatabase.close()
  })


  test('should return statusCode 200 when found register', async () => {
    await connectionDatabase.connection().
      createQueryBuilder().insert().into(ComicOrm).
      values(defaultComicData as any).execute()


    await request(app).get('/api/comics').
      set('Accept', 'application/json').
      expect('Content-Type', /json/).
      query({ page: 1, perPage: 10 }).
      expect(200,{
        from: '1',
        to: 1,
        perPage: 1,
        total: 1,
        currentPage: '1',
        prevPage: false,
        nextPage: false,
        data: [defaultComicData]
      })
  })

  test('should return statusCode 200 when data is empty', async () => {
    await request(app).get('/api/comics').
      set('Accept', 'application/json').
      expect('Content-Type', /json/).
      query({ page: 1, perPage: 10 }).
      expect(200,{
        from: '1',
        to: 0,
        perPage: 0,
        total: 0,
        currentPage: '1',
        prevPage: false,
        nextPage: false,
        data: []
      })
  })

  test('should return statusCode 500 when have internal error', async () => {
    await connectionDatabase.close()
    await request(app).get('/api/comics').
      set('Accept', 'application/json').
      expect('Content-Type', /json/).
      query({ page: 1, perPage: 10 }).
      expect(500)
  })

})