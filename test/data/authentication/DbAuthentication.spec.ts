import { FindUserAccountByEmailRepository } from "@/data/repository/user/FindUserAccountByEmailRepository"
import { StatusUser } from "@/domain/model/user/StatusUser"
import { UserAccountResponse } from "@/domain/model/user/UserData"
import { Either, failure, success } from "@/shared/Either"
import { DifferentPasswordError, InvalidPasswordParameterError, NotFoundError } from "@/data/error"
import { DbAuthentication } from "@/data/usecase/authentication/DbAuthentication"
import { ComparePassword } from "@/data/protocol/ComparePassword"

const findByEmailRepoStubFactory = (): FindUserAccountByEmailRepository => {
  class FindUserAccountByEmailRepoStub implements FindUserAccountByEmailRepository {
    async execute(email: string): Promise<Either<NotFoundError, UserAccountResponse>> {
      return success({
        id: 'valid-id',
        name: 'Any Name',
        email: 'any@valid.com.br',
        status: StatusUser.CREATED,
        password: 'PasswordEncrypted'
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


type TypeSut = {
  findByEmailRepoStub: FindUserAccountByEmailRepository
  comparePasswordStub: ComparePassword
  sut: DbAuthentication
}

const makeSutFactory = (): TypeSut => {
  const findByEmailRepoStub = findByEmailRepoStubFactory()
  const comparePasswordStub = comparePasswordStubFactory()
  const sut = new DbAuthentication(findByEmailRepoStub, comparePasswordStub)
  return { sut, findByEmailRepoStub, comparePasswordStub }
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

})