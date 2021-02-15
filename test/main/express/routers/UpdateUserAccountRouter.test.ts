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

  test('should return statusCode 200 when do update with success', async () => {
    const result = await connectionDatabase.connection()
      .createQueryBuilder().insert().into(UserOrm)
      .values(defaultUserData).execute()
    const { id } = result.identifiers[0]

    await request(app).put('/api/account').send({
      ...defaultUserData, id
    }).expect(200)
  })

})