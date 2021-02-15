import { DbCreateUserAccount } from '@/data/usecase/user/DbCreateUserAccount'
import { CreateUserData } from '@/domain/model/user/UserData'
import { Either, failure, success } from '@/shared/Either'
import {
  NotFoundError,
  DuplicatePropertyError,
  RepositoryInternalError,
  InvalidPasswordParameterError
} from '@/data/error'
import { EncryptsPassword } from '@/data/protocol/EncryptsPassword'
import { CreateUserAccountRepository } from '@/data/repository/user/CreateUserAccountRepository'
import { FindUserAccountByEmailRepository } from '@/data/repository/user/FindUserAccountByEmailRepository'
import { InvalidParamError } from '@/domain/errors'
import { StatusUser } from '@/domain/model/user/StatusUser'

const createUserAccountRepositoryStubFactory = (): CreateUserAccountRepository => {
  class CreateUserAccountRepositoryStub implements CreateUserAccountRepository {
    async execute (data: CreateUserData): Promise<Either<RepositoryInternalError, void>> {
      return await Promise.resolve(success())
    }
  }
  return new CreateUserAccountRepositoryStub()
}

const findUserAccountByEmailRepositoryStubFactory = (): FindUserAccountByEmailRepository => {
  class FindUserAccountByEmailRepositoryStub implements FindUserAccountByEmailRepository {
    async execute (email: string): Promise<Either<NotFoundError, any>> {
      return await Promise.resolve(failure(new Error('Any error')))
    }
  }
  return new FindUserAccountByEmailRepositoryStub()
}

const encryptsPasswordStubFactory = (): EncryptsPassword => {
  class EncryptsPasswordStub implements EncryptsPassword {
    async execute (data: string): Promise<Either<InvalidPasswordParameterError, string>> {
      return success('ValidDataEncrypt')
    }
  }
  return new EncryptsPasswordStub()
}

interface TypeSut {
  encryptsPasswordStub: EncryptsPassword
  repositoryStub: CreateUserAccountRepository
  findUserByEmailStub: FindUserAccountByEmailRepository
  sut: DbCreateUserAccount
}

const makeSutFactory = (): TypeSut => {
  const encryptsPasswordStub = encryptsPasswordStubFactory()
  const repositoryStub = createUserAccountRepositoryStubFactory()
  const findUserByEmailStub = findUserAccountByEmailRepositoryStubFactory()
  const sut = new DbCreateUserAccount(repositoryStub, findUserByEmailStub, encryptsPasswordStub)
  return { repositoryStub, encryptsPasswordStub, findUserByEmailStub, sut }
}

const dataUserParams: CreateUserData = {
  name: 'Valid Name',
  email: 'valid@email.com.br',
  password: 'V4l1d@Password'
}

describe('DbCreateUserAccount', () => {
  test('should create user account', async () => {
    const { sut } = makeSutFactory()
    const response = await sut.execute(dataUserParams)
    expect(response.isSuccess()).toBe(true)
  })

  test('should find user account with correct email', async () => {
    const { sut, findUserByEmailStub } = makeSutFactory()
    const findUserAccountByEmailSpy = jest.spyOn(findUserByEmailStub, 'execute')

    await sut.execute({ ...dataUserParams, password: 'V4l1d@Password' })
    expect(findUserAccountByEmailSpy).toBeCalledWith('valid@email.com.br')
  })

  test('should return error when found user by email', async () => {
    const { sut, findUserByEmailStub } = makeSutFactory()
    jest.spyOn(findUserByEmailStub, 'execute')
      .mockReturnValueOnce(Promise.resolve(success({
        name: 'Any Name',
        email: 'any@example.com',
        status: StatusUser.CREATED
    })))

    const response = await sut.execute(dataUserParams)

    expect(response.isFailure()).toBe(true)
    expect(response.value).toBeInstanceOf(DuplicatePropertyError)
    expect(response.value).toMatchObject({
      message: "Email 'valid@email.com.br' is already being used by another account!"
    })
  })

  test('should ensure that encrypt password receive correct params', async () => {
    const { sut, encryptsPasswordStub } = makeSutFactory()
    const encryptPasswordSpy = jest.spyOn(encryptsPasswordStub, 'execute')
    await sut.execute(dataUserParams)
    expect(encryptPasswordSpy).toBeCalledWith('V4l1d@Password')
  })

  test('should ensure that create user account repository received correct params', async () => {
    const { sut, repositoryStub } = makeSutFactory()
    const createUserAccountSpy = jest.spyOn(repositoryStub, 'execute')

    await sut.execute(dataUserParams)

    expect(createUserAccountSpy).toBeCalledWith({
      name: 'Valid Name',
      email: 'valid@email.com.br',
      password: 'ValidDataEncrypt'
    })
  })

  test('should return invalid params error when password is invalid', async () => {
    const { sut, encryptsPasswordStub } = makeSutFactory()
    jest.spyOn(encryptsPasswordStub, 'execute')
      .mockReturnValueOnce(Promise.resolve(failure(new Error('Any error'))))

    const response = await sut.execute(dataUserParams)
    expect(response.value).toBeInstanceOf(InvalidParamError)
    expect(response.value).toMatchObject({
      message: "Attribute 'password' equals 'V4l1d@Password' is invalid!"
    })
    expect(response.isFailure()).toBe(true)
  })

  test('should return failure when create user account return failure', async () => {
    const { sut, repositoryStub } = makeSutFactory()
    jest.spyOn(repositoryStub, 'execute')
      .mockReturnValueOnce(Promise.resolve(failure<any, any>(new Error('Any error'))))

    const response = await sut.execute(dataUserParams)
    expect(response.value).toBeInstanceOf(RepositoryInternalError)
    expect(response.value).toMatchObject({
      message: 'Any error'
    })
  })
})
