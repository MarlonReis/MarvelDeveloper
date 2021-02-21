import request from 'supertest'
import app from '@/main/express/config/App'

import {
  ConnectionDatabaseFactory
} from '@/main/factories/ConnectionDatabaseFactory'
import { UserOrm } from '@/infrastructure/database/orm/model/UserOrm'
import { insertUserMock } from './InsertUserMock'

const connectionDatabase = new ConnectionDatabaseFactory().makeConnectionFactory()

const defaultUserData = {
  name: 'Any Name',
  email: 'valid@email.com',
  password: 'EncryptedPassword',
  profileImage: 'path-image'
}

describe('UpdateUserAccountRouter', () => {

  beforeAll(async () => {
    await connectionDatabase.open()
  })

  afterEach(async () => {
    await connectionDatabase.connection()
      .createQueryBuilder().delete()
      .from(UserOrm).execute()
  })

  afterAll(async () => {
    await connectionDatabase.close()
  })

  test('should return statusCode 422 when email is invalid', async () => {
    const { token } = await insertUserMock(connectionDatabase, defaultUserData)

    await request(app).put('/api/account')
      .set({ 'Authentication': `Bearer ${token.value}` })
      .send({ ...defaultUserData, email: 'invalid-email' }).
      expect(422, {
        error: 'InvalidParamError',
        message: "Attribute 'email' equals 'invalid-email' is invalid!"
      })
  })

  test('should return statusCode 200 when do update with success', async () => {
    const { token } = await insertUserMock(connectionDatabase, defaultUserData)

    await request(app).put('/api/account')
      .set({ 'Authentication': `Bearer ${token.value}` })
      .send(defaultUserData).expect(200)
  })

  test('should return statusCode 400 when try to use an email that is already in use', async () => {
    await insertUserMock(connectionDatabase, {
      ...defaultUserData,
      email: "any-other@in-use.com"
    })

    const { id, token } = await insertUserMock(connectionDatabase, {
      ...defaultUserData, id: undefined
    } as any)

    await request(app).put('/api/account').send({
      ...defaultUserData, email: 'any-other@in-use.com', id
    }).set({ 'Authentication': `Bearer ${token.value}` })
      .expect(400, {
        error: 'BadRequestError',
        message: "Email 'any-other@in-use.com' is already being used by another account!"
      })
  })


  test('should return statusCode 401 when try without access token', async () => {
    await request(app).put('/api/account').
      send(defaultUserData).
      expect(401, {
        error: 'UnauthorizedError',
        message: 'Access unauthorized'
      })
  })


})