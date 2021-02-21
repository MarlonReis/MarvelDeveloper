import { FindUserAccountByEmailRepository } from "@/data/repository/user/FindUserAccountByEmailRepository"
import { StatusUser } from "@/domain/model/user/StatusUser"
import { UserAccountResponse } from "@/domain/model/user/UserData"
import { Either, failure, success } from "@/shared/Either"
import { DifferentPasswordError, InvalidPasswordParameterError } from "@/data/error"
import { NotFoundError } from '@/domain/errors'
import { DbAuthentication } from "@/data/usecase/authentication/DbAuthentication"
import { ComparePassword } from "@/data/protocol/ComparePassword"
import { TokenGenerator } from "@/data/protocol/TokenGenerator"
import { TokenGeneratorError } from "@/data/error/TokenGeneratorError"
import { Role } from "@/domain/model/user/AuthenticationData"

const findByEmailRepoStubFactory = (): FindUserAccountByEmailRepository => {
  class FindUserAccountByEmailRepoStub implements FindUserAccountByEmailRepository {
    async execute(email: string): Promise<Either<NotFoundError, UserAccountResponse>> {
      return success({
        id: 'valid-id',
        name: 'Any Name',
        email: 'any@valid.com.br',
        status: StatusUser.CREATED,
        password: 'PasswordEncrypted',
        role: Role.USER
      })
    }
  }
  return new FindUserAccountByEmailRepoStub()
}

const comparePasswordStubFactory = (): ComparePassword => {
  class ComparePasswordStub implements ComparePassword {
    async execute(cleanPassword: string, encryptedPassword: string): Promise<Either<InvalidPasswordParameterError | DifferentPasswordError, void>> {
      return success()
    }
  }
  return new ComparePasswordStub()
}

const tokenGeneratorStubFactory = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async execute(data: string): Promise<Either<TokenGeneratorError, string>> {
      return success("token_valid")
    }
  }
  return new TokenGeneratorStub()
}


type TypeSut = {
  tokenGeneratorStub: TokenGenerator
  findByEmailRepoStub: FindUserAccountByEmailRepository
  comparePasswordStub: ComparePassword
  sut: DbAuthentication
}

const makeSutFactory = (): TypeSut => {
  const tokenGeneratorStub = tokenGeneratorStubFactory()
  const findByEmailRepoStub = findByEmailRepoStubFactory()
  const comparePasswordStub = comparePasswordStubFactory()
  const sut = new DbAuthentication(findByEmailRepoStub, comparePasswordStub, tokenGeneratorStub)
  return { sut, findByEmailRepoStub, comparePasswordStub, tokenGeneratorStub }
}

const fakeUserCredentialArgument = (): any => ({
  email: 'email@valid.com.br',
  password: 'ValidPassword'
})

describe('DbAuthentication', () => {

  test('should call FindUserAccountByEmailRepository with correct email', async () => {
    const { sut, findByEmailRepoStub } = makeSutFactory()
    const executeSpy = jest.spyOn(findByEmailRepoStub, 'execute')
    await sut.execute(fakeUserCredentialArgument())

    expect(executeSpy).toHaveBeenCalledWith('email@valid.com.br')
  })

  test('should return failure when repository return failure', async () => {
    const { sut, findByEmailRepoStub } = makeSutFactory()

    jest.spyOn(findByEmailRepoStub, 'execute').
      mockImplementationOnce(async () => failure(new Error('Any Message')))

    const response = await sut.execute(fakeUserCredentialArgument())

    expect(response.isFailure()).toBe(true)
    expect(response.value).toEqual(new Error('Any Message'))
  })

  test('should call ComparePassword with correct password', async () => {
    const { sut, comparePasswordStub } = makeSutFactory()
    const executeSpy = jest.spyOn(comparePasswordStub, 'execute')
    await sut.execute(fakeUserCredentialArgument())

    expect(executeSpy).toHaveBeenCalledWith('ValidPassword', 'PasswordEncrypted')
  })

  test('should return error when password are different', async () => {
    const { sut, comparePasswordStub } = makeSutFactory()
    jest.spyOn(comparePasswordStub, 'execute').
      mockImplementationOnce(async () => failure(new DifferentPasswordError()))

    const response = await sut.execute(fakeUserCredentialArgument())

    expect(response.isFailure()).toBe(true)
    expect(response.value).toEqual(new DifferentPasswordError())
  })

  test('should call TokenGenerate with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSutFactory()
    const executeSpy = jest.spyOn(tokenGeneratorStub, 'execute')
    await sut.execute(fakeUserCredentialArgument())

    expect(executeSpy).toHaveBeenCalledWith('valid-id')
  })

  test('should generate correct token', async () => {
    const { sut } = makeSutFactory()
    const response = await sut.execute(fakeUserCredentialArgument())

    expect(response.isSuccess()).toBe(true)
    expect(response.value).toEqual('token_valid')
  })

  test('should failure when not generate token', async () => {
    const { sut, tokenGeneratorStub } = makeSutFactory()

    jest.spyOn(tokenGeneratorStub, 'execute').
      mockImplementationOnce(async () => failure(new TokenGeneratorError()))

    const response = await sut.execute(fakeUserCredentialArgument())

    expect(response.isFailure()).toBe(true)
    expect(response.value).toEqual(new TokenGeneratorError())
  })

})