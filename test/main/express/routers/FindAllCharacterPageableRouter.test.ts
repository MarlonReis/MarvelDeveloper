import request from 'supertest'
import app from '@/main/express/config/App'
import {
  ConnectionDatabaseFactory
} from '@/main/factories/ConnectionDatabaseFactory'
import { CharacterOrm } from '@/infrastructure/database/orm/model/CharacterOrm'


const connectionDatabase = new ConnectionDatabaseFactory()
  .makeConnectionFactory()

const getRequest = request(app).get('/api/characters')

const defaultCharacterData = {
  name: "Any Name",
  description: "Any description",
  topImage: "https://example.com/image-top-image.png",
  profileImage: "https://example.com/image-profile-image.png",
}


describe('FindAllCharacterPageableRouter', () => {
  beforeAll(async () => {
    await connectionDatabase.open()
  })

  afterEach(async () => {
    await connectionDatabase.connection().createQueryBuilder().delete()
      .from(CharacterOrm).execute()
  })

  afterAll(async () => {
    await connectionDatabase.close()
  })

  test('should return statusCode 200 when found registers', async () => {
    await connectionDatabase.connection().
      createQueryBuilder().insert().into(CharacterOrm).
      values(defaultCharacterData).execute()


    await getRequest.query({ page: 0, perPage: 20 }).expect(200).
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
      })
  })

})

