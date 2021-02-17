import request from 'supertest'
import app from '@/main/express/config/App'
import {
  ConnectionDatabaseFactory
} from '@/main/factories/ConnectionDatabaseFactory'
import { CharacterOrm } from '@/infrastructure/database/orm/model/CharacterOrm'


const connectionDatabase = new ConnectionDatabaseFactory()
  .makeConnectionFactory()

const defaultCharacterData = {
  id: undefined,
  name: "Any Name",
  description: "Any description",
  topImage: "https://example.com/image-top-image.png",
  profileImage: "https://example.com/image-profile-image.png",
}

describe('FindCharacterByIdRouter', () => {

  beforeEach(async () => {
    await connectionDatabase.open()

    await connectionDatabase.connection().
      createQueryBuilder().delete().
      from(CharacterOrm).execute()
  })

  afterAll(async () => {
    await connectionDatabase.close()
  })


  test('should return status 200 when found register by id', async () => {
    await connectionDatabase.connection().
      createQueryBuilder().insert().into(CharacterOrm).
      values(defaultCharacterData).execute()
    
    await request(app).get(`/api/characters/${defaultCharacterData.id}`).
      expect(200, defaultCharacterData)
  })
})