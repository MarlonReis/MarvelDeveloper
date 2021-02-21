import request from 'supertest'
import app from '@/main/express/config/App'
import {
  ConnectionDatabaseFactory
} from '@/main/factories/ConnectionDatabaseFactory'
import { UserOrm } from '@/infrastructure/database/orm/model/UserOrm'
import { CreateUserAccountORMRepository } from '@/infrastructure/database/orm'

const connectionDatabase = new ConnectionDatabaseFactory()
  .makeConnectionFactory()



const defaultRequestBody = {
  name: 'Any Name',
  email: 'any@email.com.br',
  password: 'Any@Password'
}

describe('CreateUserAccountRouter', () => {
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

  test('should create user account with success and return statusCode 200', async () => {
    await request(app).post('/api/account/create-users-accounts').send(defaultRequestBody).expect(201)
  })

  test('should return statusCode 400 when email is duplicate', async () => {
    const repository = new CreateUserAccountORMRepository(connectionDatabase)
    await repository.execute({
      ...defaultRequestBody, email: 'duplicate-email@email.com.br'
    })

    await request(app).post('/api/account/create-users-accounts').send({
      ...defaultRequestBody,
      email: 'duplicate-email@email.com.br'
    }).expect(400, {
      error: 'BadRequestError',
      message: "Email 'duplicate-email@email.com.br' is already being used by another account!"
    })
  })

  test('should return statusCode 422 when name is invalid', async () => {
    await request(app).post('/api/account/create-users-accounts').send({
      ...defaultRequestBody, name: 'An'
    }).expect(422, {
      message: "Attribute 'name' is invalid!",
      error: 'MissingParamError'
    })
  })
})
