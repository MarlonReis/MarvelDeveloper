import { DecryptAuthToken } from "@/data/protocol/DecryptAuthToken"
import { Either, success } from "@/shared/Either"
import { DecryptError } from "../error"
import {
  DbFindUserAccountByTokenData
} from "@/data/usecase/authentiction/DbFindUserAccountByTokenData"
import { Role } from "@/domain/model/user/AuthenticationData"

const decryptAuthTokenStubFactory = (): DecryptAuthToken => {
  class DecryptAuthTokenStub implements DecryptAuthToken {
    async execute(data: string): Promise<Either<DecryptError, string>> {
      return success("token_decrypted")
    }
  }
  return new DecryptAuthTokenStub()
}

type TypeSut = {
  decryptAuthTokenStub: DecryptAuthToken
  sut: DbFindUserAccountByTokenData
}

const makeSutFactory = (): TypeSut => {
  const decryptAuthTokenStub = decryptAuthTokenStubFactory()
  const sut = new DbFindUserAccountByTokenData(decryptAuthTokenStub)
  return { decryptAuthTokenStub, sut }
}

describe('DbFindUserAccountByTokenData', () => {
  test('should call decrypt token with correct values', async () => {
    const { sut, decryptAuthTokenStub } = makeSutFactory()
    const executeSpy = jest.spyOn(decryptAuthTokenStub, 'execute')

    await sut.execute('valid-token', Role.USER)

    expect(executeSpy).toHaveBeenCalledWith('valid-token')
  })
})