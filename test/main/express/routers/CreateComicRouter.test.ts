import request from 'supertest'
import app from '@/main/express/config/App'
import {
  ConnectionDatabaseFactory
} from '@/main/factories/ConnectionDatabaseFactory'
import { CharacterOrm } from '@/infrastructure/database/orm/model/CharacterOrm'
import { ComicOrm } from '@/infrastructure/database/orm/model/ComicOrm'


const connectionDatabase = new ConnectionDatabaseFactory()
  .makeConnectionFactory()

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

describe('CreateComicRouter', () => {
  beforeEach(async () => {
    await connectionDatabase.open()
  })

  afterAll(async () => {
    if (connectionDatabase.connection()) {
      await connectionDatabase.connection().
        createQueryBuilder().delete().
        from(ComicOrm).execute()

      await connectionDatabase.connection().
        createQueryBuilder().delete().
        from(CharacterOrm).execute()
    }

    await connectionDatabase.close()
  })

  test('should return statusCode 201 when create comic', async () => {
    const characterInserted = await connectionDatabase.connection()
      .createQueryBuilder().insert().into(CharacterOrm)
      .values(CharacterOrm.create(defaultCharacterData).value).execute()

    const { id } = characterInserted.identifiers[0]


    await request(app).post('/api/comics').
      send(Object.assign(defaultComicData, {
        characters: [{ id }]
      })).expect(201)

  })

  test('should return statusCode 201 when not have characters', async () => {
    await request(app).post('/api/comics').send(defaultComicData).expect(201)
  })

  test('should return statusCode 404 when not found characters', async () => {
    await request(app).post('/api/comics').send(Object.assign(defaultComicData, {
      characters: [{ id: 'id-not-exist' }]
    })).expect(404, {
      error: 'NotFoundError',
      message: "Cannot found character by id equals 'id-not-exist'!"
    })
  })

  test('should return statusCode 422 when attribute has invalid value', async () => {
    await request(app).post('/api/comics').send({
      ...defaultComicData, title:'In'
    }).expect(422, {
      error: 'InvalidParamError',
      message: "Attribute 'title' equals 'In' is invalid!"
    })
  })

  test('should return statusCode 500 when attribute has invalid value', async () => {
    connectionDatabase.close()
    await request(app).post('/api/comics').send(defaultComicData).expect(500, {
      error: 'InternalServerError',
      message: "Internal server error"
    })
  })


})