import { NotFoundError } from "@/data/error"
import { AuthData } from "@/domain/model/user/AuthenticationData"
import { Authentication } from "@/domain/usecase/authentication/Authentication"
import { Either, success } from "@/shared/Either"
import {
  AuthenticationController
} from "@/presentation/controller/authentication/AuthenticationController"
import { badRequest, ok, unProcessableEntity } from "@/presentation/helper"
import { InvalidParamError } from "@/domain/errors"

const authenticationStubFactory = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async execute(auth: AuthData): Promise<Either<NotFoundError, string>> {
      return success("token-valid")
    }
  }
  return new AuthenticationStub()
}

type TypeSut = {
  authenticationStub: Authentication
  sut: AuthenticationController
}

const makeSutFactory = (): TypeSut => {
  const authenticationStub = authenticationStubFactory()
  const sut = new AuthenticationController(authenticationStub)
  return { sut, authenticationStub }
}

describe('AuthenticationController', () => {
  test('should call authentication use case with correct params', async () => {
    const { sut, authenticationStub } = makeSutFactory()

    const executeSpy = jest.spyOn(authenticationStub, 'execute')

    await sut.handle({ body: { email: 'email@email.com.br', password: 'AnyPassword' } })

    expect(executeSpy).toHaveBeenCalledWith({
      email: 'email@email.com.br',
      password: 'AnyPassword'
    })
  })

  test('should return 422 when email is invalid', async () => {
    const { sut } = makeSutFactory()
    const response = await sut.handle({
      body: {
        email: 'invalid-email.com.br',
        password: 'AnyPassword'
      }
    })

    expect(response.statusCode).toBe(422)
    expect(response).toEqual(unProcessableEntity(
      new InvalidParamError('email', 'invalid-email.com.br')
    ))
  })


  test('should return 400 when not have parameter', async () => {
    const { sut } = makeSutFactory()
    const response = await sut.handle({})

    expect(response.statusCode).toBe(400)
    expect(response).toEqual(badRequest(`Attributes 'email' and 'password'  is required!`))
  })


  test('should return 400 when body not have attribute password', async () => {
    const { sut } = makeSutFactory()
    const response = await sut.handle({
      body: { email: 'invalid@email.com.br' }
    })

    expect(response.statusCode).toBe(422)
    expect(response).toEqual(unProcessableEntity(
      new InvalidParamError('password', undefined)
    ))
  })


  test('should return 200 when auth return success', async () => {
    const { sut } = makeSutFactory()
    const response = await sut.handle({
      body: { email: 'invalid@email.com.br', password: 'AnyPassword' }
    })

    expect(response.statusCode).toBe(200)
    expect(response).toEqual(ok({ token: `Bearer token-valid` }))
  })



})