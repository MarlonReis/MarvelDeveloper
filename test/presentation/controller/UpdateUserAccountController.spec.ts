import { InvalidParamError } from "@/domain/errors"
import { UpdateUserData } from "@/domain/model/user/UserData"
import { UpdateUserAccount } from "@/domain/usecase/user/UpdateUserAccount"
import {
  UpdateUserAccountController
} from "@/presentation/controller/UpdateUserAccountController"
import { Either, failure, success } from "@/shared/Either"
import { DuplicatePropertyError, NotFoundError } from "@/data/error"

const updateUserAccountStubFactory = (): UpdateUserAccount => {
  class UpdateUserAccountStub implements UpdateUserAccount {
    async execute(data: UpdateUserData): Promise<Either<InvalidParamError, void>> {
      return success()
    }
  }
  return new UpdateUserAccountStub()
}

type TypeSut = {
  updateUserAccountStub: UpdateUserAccount
  sut: UpdateUserAccountController
}

const makeSutFactory = (): TypeSut => {
  const updateUserAccountStub = updateUserAccountStubFactory()
  const sut = new UpdateUserAccountController(updateUserAccountStub)
  return { sut, updateUserAccountStub }
}

const defaultUserDataParam = {
  id: 'valid-id',
  name: 'Any Name',
  email: 'valid@email.com',
  password: 'EncryptedPassword',
  profileImage: 'path-image'
}

describe('UpdateUserAccountController', () => {
  test('should return statusCode 200 when update with success', async () => {
    const { sut } = makeSutFactory()
    const response = await sut.handle({ body: defaultUserDataParam })
    expect(response).toEqual({ statusCode: 200 })
  })

  test('should pass correct params to use case', async () => {
    const { sut, updateUserAccountStub } = makeSutFactory()
    const executeSpy = jest.spyOn(updateUserAccountStub, 'execute')

    const response = await sut.handle({ body: defaultUserDataParam })
    expect(response).toEqual({ statusCode: 200 })

    expect(executeSpy).toBeCalledWith(defaultUserDataParam)
  })

  test('should return statusCode 422 and body error when id is undefined', async () => {
    const { sut } = makeSutFactory()
    const body = Object.assign({}, defaultUserDataParam)
    delete body['id']

    const response = await sut.handle({ body })

    expect(response).toMatchObject({
      statusCode: 422,
      body: { message: "Attribute 'id' is invalid!" }
    })
  })


  test('should return statusCode 422 and body error when email is invalid', async () => {
    const { sut } = makeSutFactory()

    const response = await sut.handle({ body: { ...defaultUserDataParam, email: 'invalid-email' } })

    expect(response).toMatchObject({
      statusCode: 422,
      body: { message: "Attribute 'email' equals 'invalid-email' is invalid!" }
    })
  })


  test('should return statusCode 400 and body error when use case return failure', async () => {
    const { sut, updateUserAccountStub } = makeSutFactory()
    jest.spyOn(updateUserAccountStub, 'execute').
      mockImplementationOnce(() => Promise.resolve(failure(new Error('Any Error'))))

    const response = await sut.handle({ body: defaultUserDataParam })

    expect(response).toMatchObject({
      statusCode: 500,
      body: { message: "Internal server error" }
    })
  })

  test('should return statusCode 404 when not found register by id', async () => {
    const { sut, updateUserAccountStub } = makeSutFactory()

    jest.spyOn(updateUserAccountStub, 'execute').
      mockImplementationOnce(() => Promise.
        resolve(failure(new NotFoundError('Any Error'))))

    const response = await sut.handle({ body: defaultUserDataParam })

    expect(response).toMatchObject({
      statusCode: 404,
      body: { message: 'Any Error' }
    })
  })

  test('should return statusCode 400 when email that is already in use', async () => {
    const { sut, updateUserAccountStub } = makeSutFactory()

    jest.spyOn(updateUserAccountStub, 'execute').
      mockImplementationOnce(() => Promise.
        resolve(failure(new DuplicatePropertyError('Any Error'))))

    const response = await sut.handle({ body: defaultUserDataParam })

    expect(response).toMatchObject({
      statusCode: 400,
      body: { message: 'Any Error' }
    })
  })


})