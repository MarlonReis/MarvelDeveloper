import { InvalidParamError } from "@/domain/errors"
import { UpdateUserData } from "@/domain/model/user/UserData"
import { UpdateUserAccount } from "@/domain/usecase/UpdateUserAccount"
import {
  UpdateUserAccountController
} from "@/presentation/controller/UpdateUserAccountController"
import { Either, success } from "@/shared/Either"

describe('UpdateUserAccountController', () => {
  test('should return statusCode 200 when update with success', async () => {
    class UpdateUserAccountStub implements UpdateUserAccount {
      async execute(data: UpdateUserData): Promise<Either<InvalidParamError, void>> {
        return success()
      }
    }
    const updateUserAccountStub = new UpdateUserAccountStub()
    const sut = new UpdateUserAccountController(updateUserAccountStub)
    const response = await sut.handle({
      body: {
        id: 'valid-id',
        name: 'Any Name',
        email: 'valid@email.com',
        password: 'EncryptedPassword',
        profileImage: 'path-image'
      }
    })

    expect(response).toEqual({ statusCode: 200 })
  })

  
})