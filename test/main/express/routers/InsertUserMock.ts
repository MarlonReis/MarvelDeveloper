import { CreateUserData } from '@/domain/model/user/UserData'
import { UserOrm } from '@/infrastructure/database/orm/model/UserOrm'
import { TokenGeneratorFactory } from '@/main/factories/authentication/TokenGeneratorFactory'
import { EncryptsPasswordFactory } from '@/main/factories/EncryptsPasswordFactory'

export const insertUserMock = async (connectionDatabase: any, userData: CreateUserData): Promise<any> => {
  const encryptsPassword = new EncryptsPasswordFactory().makeFactory()
  const passwordEncrypted = await encryptsPassword.execute(userData.password)

  const result = await connectionDatabase.connection()
    .createQueryBuilder().insert().into(UserOrm)
    .values({ ...userData, password: passwordEncrypted.value }).execute()
  const { id } = result.identifiers[0]

  const token = await new TokenGeneratorFactory()
    .makeTokenGenerator().execute(id)

  return { id, token }
}

export const deleteAllUserMock = async (connectionDatabase: any) => {
  await connectionDatabase.connection()
    .createQueryBuilder().delete()
    .from(UserOrm).execute()
}
