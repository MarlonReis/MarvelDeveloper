import request from 'supertest'
import app from '@/main/express/config/App'

import {
  ConnectionDatabaseFactory
} from '@/main/factories/ConnectionDatabaseFactory'
import { CreateUserAccountFactory } from '@/main/factories/user/CreateUserAccountFactory'


const connectionDatabase = new ConnectionDatabaseFactory()
  .makeConnectionFactory()


describe('AuthenticationRouter', () => {
  beforeEach(async () => {
    await connectionDatabase.open()
  })

  afterAll(async () => {
    await connectionDatabase.close()
  })

  test('should return statusCode 401 when not found user', async () => {
    await request(app).post('/api/auth').send({
      email: 'not-exist@this-email.com',
      password: 'Password@Valid'
    }).expect(401, {
      error: 'UnauthorizedError',
      message: 'Access unauthorized'
    })
  })

  test('should return statusCode 422 when not send email attributes', async () => {
    await request(app).post('/api/auth').expect(422, {
      error: 'InvalidParamError',
      message: "Attribute 'email' equals 'undefined' is invalid!"
    })
  })

  test('should return statusCode 422 when not send password attributes', async () => {
    await request(app).post('/api/auth').send({
      email: 'not-exist@this-email.com'
    }).expect(422, {
      error: 'InvalidParamError',
      message: "Attribute 'password' equals 'undefined' is invalid!"
    })
  })



})