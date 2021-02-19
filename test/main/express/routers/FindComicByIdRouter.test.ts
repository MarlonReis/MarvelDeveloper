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
  edition: "5",
  coverImage: "http://server.com/images.png",
}

describe('FindComicByIdRouter', () => {

  beforeEach(async () => {
    await connectionDatabase.open()
  })

  afterAll(async () => {
    if (connectionDatabase.connection()) {
      await connectionDatabase.connection().
        createQueryBuilder().delete().
        from(ComicOrm).execute()
    }

    await connectionDatabase.close()
  })


  test('should return statusCode 200 when found register', async () => {

    const comicInserted = await connectionDatabase.connection()
      .createQueryBuilder().insert().into(ComicOrm)
      .values(ComicOrm.create(defaultComicData as any).value as any)
      .execute()
    const { id } = comicInserted.identifiers[0]

    await request(app).get(`/api/comics/${id}`).expect(200, { ...defaultComicData, characters: [], id })
  })

  test('should return statusCode 404 when found register', async () => {
    await request(app).get(`/api/comics/id-not-exist`).expect(404, {
      error: 'NotFoundError',
      message: "Cannot found comic by id equals 'id-not-exist'!"
    })
  })


  test('should return statusCode 500 when repository return failure', async () => {
    await connectionDatabase.close()
    
    await request(app).get(`/api/comics/id-not-exist`).expect(500, {
      error: 'InternalServerError',
      message: "Internal server error"
    })
  })

})