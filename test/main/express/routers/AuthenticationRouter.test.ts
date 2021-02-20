import request from 'supertest'
import app from '@/main/express/config/App'

import {
  ConnectionDatabaseFactory
} from '@/main/factories/ConnectionDatabaseFactory'


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
})