import {
  EnvironmentConfiguration
} from "@/infrastructure/util/EnvironmentConfiguration"
import {
  MySQLTypeOrmConnection
} from "@/infrastructure/database/orm/connection/MySQLTypeOrmConnection"
import { UserOrm } from "@/infrastructure/database/orm/model/UserOrm"
import { StatusUser } from "@/domain/model/user/StatusUser"
import {
  UpdateUserAccountORMRepository
} from "@/infrastructure/database/orm"
import { UpdateUserData } from "@/domain/model/user/UserData"

const defaultParamData = {
  name: 'Any Name',
  email: 'valid@email.com',
  status: StatusUser.CREATED,
  password: 'EncryptedPassword',
  profileImage: 'path-image'
}

const config = EnvironmentConfiguration.database()
const connectionDatabase = new MySQLTypeOrmConnection(config)

const insertUserData = async (connectionDatabase: MySQLTypeOrmConnection, data: any): Promise<any> => {
  const result = await connectionDatabase.connection()
    .createQueryBuilder().insert().into(UserOrm)
    .values(data).execute()
  const { id } = result.identifiers[0]
  return { id, ...data, }
}

describe('UpdateUserAccountORMRepository', () => {

  beforeAll(async () => {
    await connectionDatabase.open()
  })

  afterEach(async () => {
    await connectionDatabase.connection()
      .createQueryBuilder()
      .delete().from(UserOrm)
      .execute()
  })

  afterAll(async () => {
    await connectionDatabase.close()
  })

  test('should update user account existing', async () => {
    const userInserted = await insertUserData(connectionDatabase, defaultParamData)
    const sut = new UpdateUserAccountORMRepository(connectionDatabase)
    const { id } = userInserted

    const response = await sut.execute({ ...defaultParamData, status: StatusUser.DELETED, id })

    const user = await connectionDatabase.connection().getRepository(UserOrm)
      .createQueryBuilder('users')
      .where('users.id = :id', { id })
      .getOne()

    expect(response.isSuccess()).toBe(true)
    expect(user).toMatchObject({
      ...defaultParamData,
      status: StatusUser.DELETED,
      id
    })
  })

})