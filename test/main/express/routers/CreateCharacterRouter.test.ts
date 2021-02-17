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

const postRequest = request(app).post('/api/characters')

describe('CreateCharacterRouter', () => {
  beforeEach(async () => {
    await connectionDatabase.open()
  })

  afterAll(async () => {
    await connectionDatabase.connection().createQueryBuilder().delete()
      .from(CharacterOrm).execute()

    await connectionDatabase.close()
  })

  test('should return statusCode 200 when it`s has success', async () => {
    await postRequest.send(defaultRequestBody).expect(201)
  })

  test('should return statusCode 422 when name is invalid', async () => {
    await postRequest.send({
      ...defaultRequestBody,
      name: 'in'
    }).expect(422, {
      message: "Attribute 'name' is invalid!",
      error: 'MissingParamError'
    })
  })

  test('should return statusCode 500 when internal error', async () => {
    await connectionDatabase.close()
    await postRequest.send(defaultRequestBody).expect(500, {
      error: 'InternalServerError',
      message: 'Internal server error'
    })
  })
})