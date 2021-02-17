import { EnvironmentConfiguration } from "@/infrastructure/util/EnvironmentConfiguration"
import {
  MySQLTypeOrmConnection
} from "@/infrastructure/database/orm/connection/MySQLTypeOrmConnection"
import { CharacterOrm } from "@/infrastructure/database/orm/model/CharacterOrm"
import { FindAllCharacterPageableORMRepository } from "@/infrastructure/database/orm"

const config = EnvironmentConfiguration.database()
const connectionDatabase = new MySQLTypeOrmConnection(config)

const defaultCharacterData = {
  name: "Any Name",
  description: "Any description",
  topImage: "https://example.com/image-top-image.png",
  profileImage: "https://example.com/image-profile-image.png",
}

describe('FindAllCharacterPageableORMRepository', () => {
  beforeAll(async () => {
    await connectionDatabase.open()
  })

  beforeEach(async () => {
    await connectionDatabase.connection().
      createQueryBuilder().delete().
      from(CharacterOrm).execute()
  })

  afterAll(async () => await connectionDatabase.close())

  test('should return success with data pageable', async () => {
    await connectionDatabase.connection()
      .createQueryBuilder().insert().into(CharacterOrm)
      .values(defaultCharacterData).execute()

    const sut = new FindAllCharacterPageableORMRepository(connectionDatabase)
    const response = await sut.execute(1, 10)

    expect(response.isSuccess()).toBe(true)
    expect(response.value).toEqual({
      from: 1,
      to: 1,
      perPage: 1,
      total: 1,
      currentPage: 1,
      prevPage: false,
      nextPage: false,
      data: expect.arrayContaining([
        defaultCharacterData
      ])
    })
  })
})