import request from 'supertest'
import app from '@/main/express/config/App'
import {
  ConnectionDatabaseFactory
} from '@/main/factories/ConnectionDatabaseFactory'
import { CharacterOrm } from '@/infrastructure/database/orm/model/CharacterOrm'


const connectionDatabase = new ConnectionDatabaseFactory()
  .makeConnectionFactory()

const defaultRequestBody = {
  name: 'Any Name',
  description: 'Any description',
  topImage: 'https://anyserver.com/top-image.png',
  profileImage: 'https://anyserver.com/profileImage.png',
}

describe('CreateCharacterRouter', () => {
  beforeAll(async () => {
    await connectionDatabase.open()
  })

  afterEach(async () => {
    await connectionDatabase.connection()
      .createQueryBuilder().delete()
      .from(CharacterOrm).execute()
  })

  afterAll(async () => {
    await connectionDatabase.close()
  })

  test('should return statusCode 200 when it`s has success', async() => {
    const postRequest = request(app).post('/api/characters')
    await postRequest.send(defaultRequestBody).expect(201)
  })
})