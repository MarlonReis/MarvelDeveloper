import { DecryptAuthToken } from "@/data/protocol/DecryptAuthToken"
import { Either, success } from "@/shared/Either"
import { DecryptError } from "../error"
import {
  DbFindUserAccountByTokenData
} from "@/data/usecase/authentiction/DbFindUserAccountByTokenData"
import { Role } from "@/domain/model/user/AuthenticationData"

describe('DbFindUserAccountByTokenData', () => {
  test('should call decrypt token with correct values', async () => {

    class DecryptAuthTokenStub implements DecryptAuthToken {
      async execute(data: string): Promise<Either<DecryptError, string>> {
        return success("token_decrypted")
      }
    }

    const decryptAuthTokenStub = new DecryptAuthTokenStub()

    const executeSpy = jest.spyOn(decryptAuthTokenStub, 'execute')

    const sut = new DbFindUserAccountByTokenData(decryptAuthTokenStub)
    await sut.execute('valid-token', Role.USER)

    expect(executeSpy).toHaveBeenCalledWith('valid-token')
  })
})