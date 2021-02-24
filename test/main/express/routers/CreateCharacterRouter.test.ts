import request from 'supertest'
import app from '@/main/express/config/App'
import {
  ConnectionDatabaseFactory
} from '@/main/factories/ConnectionDatabaseFactory'
import { CharacterOrm } from '@/infrastructure/database/orm/model/CharacterOrm'
import { deleteAllUserMock, insertUserMock } from './InsertUserMock'
import { Role } from '@/domain/model/user/AuthenticationData'


const connectionDatabase = new ConnectionDatabaseFactory()
  .makeConnectionFactory()

const defaultRequestBody = {
  name: 'Any Name',
  description: 'Any description',
  topImage: 'https://anyserver.com/top-image.png',
  profileImage: 'https://anyserver.com/profileImage.png',
}

describe('CreateCharacterRouter', () => {
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

  afterEach(async () => {
    if (connectionDatabase.connection())
      await deleteAllUserMock(connectionDatabase)
  })


  afterAll(async () => {
    await connectionDatabase.connection().createQueryBuilder().delete()
      .from(CharacterOrm).execute()

    await connectionDatabase.close()
  })

  test('should return statusCode 401 when not have token', async () => {
    await request(app).
      post('/api/characters').
      send(defaultRequestBody).
      expect(401)
  })

  test('should return statusCode 200 when it`s has success', async () => {
    await request(app).post('/api/characters').
      set({ 'Authorization': `Bearer ${tokenAdmin}` }).
      send(defaultRequestBody).expect(201)
  })

  test('should return statusCode 422 when name is invalid', async () => {
    await request(app).post('/api/characters').
      set({ 'Authorization': `Bearer ${tokenAdmin}` }).
      send({
        ...defaultRequestBody,
        name: 'in'
      }).expect(422, {
        message: "Attribute 'name' is invalid!",
        error: 'MissingParamError'
      })
  })

  test('should return statusCode 500 when internal error', async () => {
    await connectionDatabase.close()
    await request(app).post('/api/characters').
      set({ 'Authorization': `Bearer ${tokenAdmin}` })
      .send(defaultRequestBody).expect(500, {
        error: 'InternalServerError',
        message: 'Internal server error'
      })
  })

})