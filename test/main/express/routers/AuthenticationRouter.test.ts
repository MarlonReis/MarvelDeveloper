import request from 'supertest'
import app from '@/main/express/config/App'

import {
  ConnectionDatabaseFactory
} from '@/main/factories/ConnectionDatabaseFactory'
import { CreateUserAccountFactory } from '@/main/factories/user/CreateUserAccountFactory'
import { UserOrm } from '@/infrastructure/database/orm/model/UserOrm'


const connectionDatabase = new ConnectionDatabaseFactory()
  .makeConnectionFactory()


describe('AuthenticationRouter', () => {
  beforeEach(async () => {
    await connectionDatabase.open()

    const factory = new CreateUserAccountFactory().makeCreateUserAccountFactory()
    await factory.execute({
      name: 'Any Name',
      email: 'any@email.com.br',
      password: 'Any@Password'
    })

  })



  afterAll(async () => {
    await connectionDatabase.connection()
      .createQueryBuilder().delete()
      .from(UserOrm).execute()

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

  test('should return statusCode 200 and token then authenticate user', async () => {
    await request(app).post('/api/auth').send({
      email: 'any@email.com.br',
      password: 'Any@Password'
    }).expect(200).then(res => {
      expect(res.body).toHaveProperty('token')
      expect(res.body).toMatchObject({
        token: expect.stringMatching(/^Bearer\s.{24,}$/)
      })
    })
  })


  test('should return statusCode 401 and set incorrect password', async () => {
    await request(app).post('/api/auth').send({
      email: 'any@email.com.br',
      password: 'IncorrectPassword'
    }).expect(401)
  })

})