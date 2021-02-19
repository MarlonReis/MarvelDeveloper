import { FindUserAccountByTokenData } from "@/domain/usecase/user/FindUserAccountByTokenData"
import { AuthMiddleware } from "@/presentation/middleware/AuthMiddleware"
import { AuthResponse, Role } from "@/domain/model/user/UserData"
import { StatusUser } from "@/domain/model/user/StatusUser"
import { forbidden, ok } from "@/presentation/helper"
import { Either, failure, success } from "@/shared/Either"
import { NotFoundError } from "@/data/error"
import { HttpRequest } from "@/presentation/protocols"


const findByTokenDataStubFactory = (): FindUserAccountByTokenData => {
  class FindUserAccountByTokenDataStub implements FindUserAccountByTokenData {
    async execute(token: string, role: Role): Promise<Either<NotFoundError, AuthResponse>> {
      return success({
        id: 'id-valid',
        email: 'email-valid',
        status: StatusUser.CREATED
      })
    }
  }
  return new FindUserAccountByTokenDataStub()
}

type TypeSut = {
  findByTokenDataStub: FindUserAccountByTokenData
  sut: AuthMiddleware
}

const makeSutFactory = (): TypeSut => {
  const findByTokenDataStub = findByTokenDataStubFactory()
  const sut = new AuthMiddleware(findByTokenDataStub)
  return { findByTokenDataStub, sut }
}

const fakeRequest = (): HttpRequest => ({ headers: { 'Authentication': 'valid-token' } })

describe('AuthMiddleware', () => {
  test('should return 403 when x-access-token not exist in headers', async () => {
    const { sut } = makeSutFactory()
    const response = await sut.handle({ headers: {} })
    expect(response).toEqual(forbidden())
  })

  test('should call find user account by token with correct access token', async () => {
    const { sut, findByTokenDataStub } = makeSutFactory()

    const executeSpy = jest.spyOn(findByTokenDataStub, 'execute')
    await sut.handle(fakeRequest())
    expect(executeSpy).toHaveBeenCalledWith('valid-token')
  })

  test('should return forbidden when not found user account ', async () => {
    const { sut, findByTokenDataStub } = makeSutFactory()

    jest.spyOn(findByTokenDataStub, 'execute').
      mockImplementationOnce(async () => failure(new NotFoundError('Any error')))

    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(forbidden())
  })

  test('should return ok when found user account ', async () => {
    const { sut } = makeSutFactory()

    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(ok())
  })



})