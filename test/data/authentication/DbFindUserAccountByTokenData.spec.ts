import { DecryptAuthToken } from "@/data/protocol/DecryptAuthToken"
import { Either, failure, success } from "@/shared/Either"
import { DecryptError, NotFoundError, RepositoryInternalError } from "@/data/error"
import {
  DbFindUserAccountByTokenData
} from "@/data/usecase/authentication/DbFindUserAccountByTokenData"
import { Role } from "@/domain/model/user/AuthenticationData"
import { FindUserAccountByIdRepository } from "@/data/repository/user/FindUserAccountByIdRepository"
import { UserAccountResponse } from "@/domain/model/user/UserData"
import { StatusUser } from "@/domain/model/user/StatusUser"

const decryptAuthTokenStubFactory = (): DecryptAuthToken => {
  class DecryptAuthTokenStub implements DecryptAuthToken {
    async execute(data: string): Promise<Either<DecryptError, string>> {
      return success("token_decrypted")
    }
  }
  return new DecryptAuthTokenStub()
}

const findByTokenDataRepoFactory = (): FindUserAccountByIdRepository => {
  class FindUserAccountByTokenDataRepoStub implements FindUserAccountByIdRepository {
    async execute(id: string): Promise<Either<NotFoundError, UserAccountResponse>> {
      return success({
        name: "Any Name",
        email: "email@valid.com",
        status: StatusUser.CREATED
      })
    }

  }
  return new FindUserAccountByTokenDataRepoStub()
}

type TypeSut = {
  findByTokenDataRepo: FindUserAccountByIdRepository
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

    expect(executeSpy).toHaveBeenCalledWith('token_decrypted')

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