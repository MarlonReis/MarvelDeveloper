import { InvalidParamError } from '@/domain/errors'
import { CreateUserData } from '@/domain/model/user/UserData'
import { CreateUserAccount } from '@/domain/usecase/CreateUserAccount'
import {
  CreateUserAccountController
} from '@/presentation/controller/CreateUserAccountController'
import { Either, failure, success } from '@/shared/Either'
import { badRequest, createSuccess, internalServerError, unProcessableEntity } from '@/presentation/helper'
import { BadRequestError, MissingParamError } from '@/presentation/error'
import { DuplicatePropertyError } from '@/data/error'

const createUserAccountStubFactory = (): CreateUserAccount => {
  class CreateUserAccountStub implements CreateUserAccount {
    async execute (data: CreateUserData): Promise<Either<InvalidParamError, void>> {
      return success()
    }
  }
  return new CreateUserAccountStub()
}

interface TypeSut {
  createUserAccountStub: CreateUserAccount
  sut: CreateUserAccountController
}

const makeSutFactory = (): TypeSut => {
  const createUserAccountStub = createUserAccountStubFactory()
  const sut = new CreateUserAccountController(createUserAccountStub)
  return { createUserAccountStub, sut }
}

const defaultRequestBody = {
  name: 'Any Name',
  email: 'valid@email.com',
  password: 'ValidPassword'
}

describe('CreateUserAccountController', () => {
  test('should return statusCode 201 when create with success', async () => {
    const { sut } = makeSutFactory()
    const response = await sut.handle({ body: defaultRequestBody })

    expect(response).toEqual(createSuccess())
    expect(response).toMatchObject({
      statusCode: 201
    })
  })

  test('should return statusCode 500 when CreateUserAccount return error', async () => {
    const { sut, createUserAccountStub } = makeSutFactory()

    jest.spyOn(createUserAccountStub, 'execute')
      .mockImplementationOnce(async () => await Promise.resolve(failure(new Error('Any Error'))))

    const response = await sut.handle({ body: defaultRequestBody })

    expect(response).toEqual(internalServerError(new Error('Any Error')))
    expect(response).toMatchObject({
      statusCode: 500,
      body: {
        message: 'Internal server error',
        cause: new Error('Any Error')
      }
    })
  })

  test('should return statusCode 400 when email is duplicate', async () => {
    const { sut, createUserAccountStub } = makeSutFactory()

    const duplicatePropertyError = new DuplicatePropertyError('Any Error')

    jest.spyOn(createUserAccountStub, 'execute')
      .mockImplementationOnce(async () => failure(duplicatePropertyError))

    const response = await sut.handle({ body: defaultRequestBody })

    expect(response).toEqual(badRequest('Any Error'))
    expect(response.body).toEqual(new BadRequestError('Any Error'))
    expect(response).toMatchObject({
      statusCode: 400,
      body: {
        message: 'Any Error'
      }
    })
  })

  test('should return statusCode 422 when name is invalid', async () => {
    const { sut } = makeSutFactory()
    const response = await sut.handle({
      body: { ...defaultRequestBody, name: 'An' }
    })

    expect(response).toEqual(unProcessableEntity(new MissingParamError('name')))
    expect(response).toMatchObject({
      statusCode: 422,
      body: {
        message: "Attribute 'name' is invalid!"
      }
    })
  })

  test('should return statusCode 422 when email is invalid', async () => {
    const { sut } = makeSutFactory()
    const response = await sut.handle({
      body: { ...defaultRequestBody, email: 'invalid-email.com' }
    })

    expect(response).toEqual(unProcessableEntity(new MissingParamError('email')))
    expect(response).toMatchObject({
      statusCode: 422,
      body: {
        message: "Attribute 'email' is invalid!"
      }
    })
  })

  test('should return statusCode 422 when password is invalid', async () => {
    const { sut } = makeSutFactory()
    const response = await sut.handle({
      body: { ...defaultRequestBody, password: 'inv' }
    })

    expect(response).toEqual(unProcessableEntity(new MissingParamError('password')))
    expect(response).toMatchObject({
      statusCode: 422,
      body: {
        message: "Attribute 'password' is invalid!"
      }
    })
  })
})
