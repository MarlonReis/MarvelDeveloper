import request from 'supertest'
import app from '@/main/express/config/App'

import {
  ConnectionDatabaseFactory
} from '@/main/factories/ConnectionDatabaseFactory'
import { UserOrm } from '@/infrastructure/database/orm/model/UserOrm'

const connectionDatabase = new ConnectionDatabaseFactory().makeConnectionFactory()

const defaultUserData = {
  name: 'Any Name',
  email: 'valid@email.com',
  password: 'EncryptedPassword',
  profileImage: 'path-image'
}

const requestPut = request(app).put('/api/account')

const insertUser = async (connectionDatabase: any, userData: any): Promise<string> => {
  const result = await connectionDatabase.connection()
    .createQueryBuilder().insert().into(UserOrm)
    .values(userData).execute()
  const { id } = result.identifiers[0]
  return id
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

  test('should return statusCode 422 when id is undefined', async () => {
    await requestPut.send(defaultUserData).expect(422, {
      error: 'MissingParamError',
      message: "Attribute 'id' is invalid!"
    })
  })

  test('should return statusCode 422 when email is invalid', async () => {
    await requestPut.send({
      ...defaultUserData,
      id: 'valid-id',
      email: 'invalid-email'
    }).expect(422, {
      error: 'InvalidParamError',
      message: "Attribute 'email' equals 'invalid-email' is invalid!"
    })
  })


  test('should return statusCode 200 when do update with success', async () => {
    const id = await insertUser(connectionDatabase, defaultUserData)

    await requestPut.send({
      ...defaultUserData, id
    }).expect(200)
  })

  test('should return statusCode 404 when repository throw error', async () => {
    await requestPut.send({
      ...defaultUserData, id: 'id-not-exist'
    }).expect(404, {
      error: 'NotFoundError',
      message: "Cannot found account by id equals 'id-not-exist'!"
    })
  })


  test('should return statusCode 400 when try to use an email that is already in use', async () => {
    await insertUser(connectionDatabase, {
      ...defaultUserData,
      id: undefined,
      email: "any-other@in-use.com"
    })

    const id = await insertUser(connectionDatabase, {
      ...defaultUserData, id: undefined
    })

    await requestPut.send({
      ...defaultUserData,
      email: 'any-other@in-use.com',
      id
    }).expect(400, {
      error: 'BadRequestError',
      message: "Email 'any-other@in-use.com' is already being used by another account!"
    })
  })


})