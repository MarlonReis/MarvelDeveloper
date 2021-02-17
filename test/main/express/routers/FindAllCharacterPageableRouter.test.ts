import request from 'supertest'
import app from '@/main/express/config/App'
import {
  ConnectionDatabaseFactory
} from '@/main/factories/ConnectionDatabaseFactory'
import { CharacterOrm } from '@/infrastructure/database/orm/model/CharacterOrm'


const connectionDatabase = new ConnectionDatabaseFactory()
  .makeConnectionFactory()

const defaultCharacterData = {
  name: "Any Name",
  description: "Any description",
  topImage: "https://example.com/image-top-image.png",
  profileImage: "https://example.com/image-profile-image.png",
}


describe('FindAllCharacterPageableRouter', () => {

  beforeEach(async () => {
    await connectionDatabase.open()

    await connectionDatabase.connection().
    createQueryBuilder().delete().
    from(CharacterOrm).execute()
  })

  afterAll(async () => {
    await connectionDatabase.close()
  })


  test('should return statusCode 200 when found registers', async (done) => {
    await connectionDatabase.connection().
      createQueryBuilder().insert().into(CharacterOrm).
      values(defaultCharacterData).execute()


    await request(app).get('/api/characters').
      set('Accept', 'application/json').
      expect('Content-Type', /json/).
      query({ page: 0, perPage: 20 }).expect(200).
      then(res => {
        expect(res.body).toEqual({
          from: "0",
          to: 1,
          perPage: 1,
          total: 1,
          currentPage: "0",
          prevPage: false,
          nextPage: true,
          data: [defaultCharacterData]
        })
        done()
      })
  })

  test('should return statusCode 200 and empty data when not found', async (done) => {
    await request(app).get('/api/characters').
      set('Accept', 'application/json').
      expect('Content-Type', /json/).
      query({ page: 0, perPage: 1 }).expect(200).
      then(res => {
        expect(res.body).toEqual({
          from: "0",
          to: 0,
          perPage: 0,
          total: 0,
          currentPage: "0",
          prevPage: false,
          nextPage: false,
          data: []
        })
        done()
      })
  })

  test('should return statusCode 500 when repository throws error', async () => {
    await connectionDatabase.close()

    await request(app).get('/api/characters').
      set('Accept', 'application/json').
      expect('Content-Type', /json/).
      expect(500)
  })


})

