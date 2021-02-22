import { FindUserAccountByTokenData } from "@/domain/usecase/authentication/FindUserAccountByTokenData"
import { AuthMiddleware } from "@/presentation/middleware/AuthMiddleware"
import { AuthResponse } from "@/domain/model/user/AuthenticationData"
import { forbidden, internalServerError, ok, unauthorized } from "@/presentation/helper"
import { Either, failure, success } from "@/shared/Either"
import { NotFoundError } from '@/domain/errors'
import { HttpRequest } from "@/presentation/protocols"


const findByTokenDataStubFactory = (): FindUserAccountByTokenData => {
  class FindUserAccountByTokenDataStub implements FindUserAccountByTokenData {
    async execute(token: string): Promise<Either<NotFoundError, AuthResponse>> {
      return success({
        id: 'id-valid'
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

const fakeRequest = (): HttpRequest => ({ headers: { 'authorization': 'valid-token' } })

describe('AuthMiddleware', () => {
  test('should return 401 when authentication not exist in headers', async () => {
    const { sut } = makeSutFactory()
    const response = await sut.handle({ headers: {} })
    expect(response).toEqual(unauthorized())
  })

  test('should call find user account by token with correct access token', async () => {
    
    const { sut, findByTokenDataStub } = makeSutFactory()

    const executeSpy = jest.spyOn(findByTokenDataStub, 'execute')
    await sut.handle(fakeRequest())
    expect(executeSpy).toHaveBeenCalledWith('valid-token')
  })


  test('should call find user account by token with correct access token and role', async () => {
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
    expect(response).toEqual(ok({ id: 'id-valid' }))
  })

  test('should return 500 when repository return error ', async () => {
    const { sut, findByTokenDataStub } = makeSutFactory()

    jest.spyOn(findByTokenDataStub, 'execute').
      mockImplementationOnce(async () => failure(new Error('Any error')))

    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(internalServerError(new Error('Any error')))
  })
})