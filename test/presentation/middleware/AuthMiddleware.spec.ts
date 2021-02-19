import { FindUserAccountByTokenData } from "@/domain/usecase/user/FindUserAccountByTokenData"
import { AuthMiddleware } from "@/presentation/middleware/AuthMiddleware"
import { forbidden } from "@/presentation/helper"
import { NotFoundError } from "@/data/error"
import { AuthResponse, Role } from "@/domain/model/user/UserData"
import { Either, success } from "@/shared/Either"
import { StatusUser } from "@/domain/model/user/StatusUser"


class FindUserAccountByTokenDataStub implements FindUserAccountByTokenData {
  async execute(token: string, role: Role): Promise<Either<NotFoundError, AuthResponse>> {
    return success({
      id: 'id-valid',
      email: 'email-valid',
      status: StatusUser.CREATED
    })
   }
 }


describe('AuthMiddleware', () => {
  test('should return 403 when x-access-token not exist in headers', async () => {
    const findUserAccountByTokenDataStub = new FindUserAccountByTokenDataStub()
    const sut = new AuthMiddleware(findUserAccountByTokenDataStub)
    const response = await sut.handle({ headers: {} })

    expect(response).toEqual(forbidden())
  })

  test('should call find user account by token with correct access token', async () => {  
    const findUserAccountByTokenDataStub = new FindUserAccountByTokenDataStub()
    const executeSpy = jest.spyOn(findUserAccountByTokenDataStub, 'execute')

    const sut = new AuthMiddleware(findUserAccountByTokenDataStub)
    await sut.handle({
      headers: { 'Authentication': 'valid-token' }
    })

    expect(executeSpy).toHaveBeenCalledWith('valid-token')
  })
})