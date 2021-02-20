import { DecryptAuthToken } from "@/data/protocol/DecryptAuthToken"
import { Either, failure, success } from "@/shared/Either"
import { DecryptError, NotFoundError, RepositoryInternalError } from "@/data/error"
import {
  DbFindUserAccountByTokenData
} from "@/data/usecase/authentiction/DbFindUserAccountByTokenData"
import { AuthResponse, Role } from "@/domain/model/user/AuthenticationData"
import {
  FindUserAccountByTokenDataRepository
} from "@/data/repository/authentication/FindUserAccountByTokenDataRepository"

const decryptAuthTokenStubFactory = (): DecryptAuthToken => {
  class DecryptAuthTokenStub implements DecryptAuthToken {
    async execute(data: string): Promise<Either<DecryptError, string>> {
      return success("token_decrypted")
    }
  }
  return new DecryptAuthTokenStub()
}

const findByTokenDataRepoFactory = (): FindUserAccountByTokenDataRepository => {
  class FindUserAccountByTokenDataRepoStub implements FindUserAccountByTokenDataRepository {
    async execute(token: string, role: Role): Promise<Either<NotFoundError | RepositoryInternalError, AuthResponse>> {
      return success({ id: 'valid-id' })
    }
  }
  return new FindUserAccountByTokenDataRepoStub()
}

type TypeSut = {
  findByTokenDataRepo: FindUserAccountByTokenDataRepository
  decryptAuthTokenStub: DecryptAuthToken
  sut: DbFindUserAccountByTokenData
}

const makeSutFactory = (): TypeSut => {
  const findByTokenDataRepo = findByTokenDataRepoFactory()
  const decryptAuthTokenStub = decryptAuthTokenStubFactory()
  const sut = new DbFindUserAccountByTokenData(decryptAuthTokenStub, findByTokenDataRepo)
  return { decryptAuthTokenStub, sut, findByTokenDataRepo }
}

describe('DbFindUserAccountByTokenData', () => {
  test('should call decrypt token with correct values', async () => {
    const { sut, decryptAuthTokenStub } = makeSutFactory()
    const executeSpy = jest.spyOn(decryptAuthTokenStub, 'execute')

    await sut.execute('valid-token', Role.USER)

    expect(executeSpy).toHaveBeenCalledWith('valid-token')
  })

  test('should return failure when decrypt return error', async () => {
    const { sut, decryptAuthTokenStub } = makeSutFactory()

    jest.spyOn(decryptAuthTokenStub, 'execute')
      .mockImplementationOnce(async () => failure(new Error('Any error')))

    const response = await sut.execute('valid-token', Role.USER)

    expect(response.value).toEqual(new Error('Any error'))
  })

  test('should call repository with correct params', async () => {
    const { sut, findByTokenDataRepo } = makeSutFactory()

    const executeSpy = jest.spyOn(findByTokenDataRepo, 'execute')

    await sut.execute('valid-token', Role.ADMIN)

    expect(executeSpy).toHaveBeenCalledWith('token_decrypted', Role.ADMIN)

  })


  test('should return failure when decrypt return error ', async () => {
    const { sut, decryptAuthTokenStub } = makeSutFactory()

    jest.spyOn(decryptAuthTokenStub, 'execute').
      mockImplementationOnce(async () => failure(new DecryptError("Any error")))

    const response = await sut.execute('valid-token', Role.ADMIN)

    expect(response.isFailure()).toBe(true)
    expect(response.value).toEqual(new DecryptError("Any error"))

  })

  test('should return failure when repository return', async () => {
    const { sut, findByTokenDataRepo } = makeSutFactory()

    jest.spyOn(findByTokenDataRepo, 'execute')
      .mockImplementationOnce(async () => failure(new RepositoryInternalError(new Error('Any error'))))

    const response = await sut.execute('valid-token', Role.ADMIN)

    expect(response.value).toEqual(new RepositoryInternalError(new Error('Any error')))
  })

})