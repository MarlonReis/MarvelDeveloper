import { InvalidParamError } from '@/domain/errors'
import { CreateUserData } from '@/domain/model/user/UserData'
import { CreateUserAccount } from '@/domain/usecase/CreateUserAccount'
import {
  CreateUserAccountController
} from '@/presentation/controller/create-user-account/CreateUserAccountController'
import { Either, success } from '@/shared/Either'

describe('CreateUserAccountController', () => {
  test('should return statusCode 201 when create with success', async () => {
    class CreateUserAccountStub implements CreateUserAccount {
      async execute (data: CreateUserData): Promise<Either<InvalidParamError, void>> {
        return success()
      }
    }
    const createUserAccountStub = new CreateUserAccountStub()
    const sut = new CreateUserAccountController(createUserAccountStub)
    const response = await sut.handle({
      body: {
        name: 'Any Name',
        email: 'valid@email.com',
        password: 'ValidPassword'
      }
    })

    expect(response).toMatchObject({
      statusCode: 201
    })
  })
})
