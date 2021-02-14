import {
  FindUserAccountByEmailRepository
} from "@/data/repository/FindUserAccountByEmailRepository";
import {
  InvalidPasswordParameterError,
  NotFoundError,
  RepositoryInternalError
} from "@/data/error";
import { UpdateUserAccountRepository } from "@/data/repository/UpdateUserAccountRepository";
import { FindUserAccountByIdRepository } from "@/data/repository/FindUserAccountByIdRepository";
import { StatusUser } from "@/domain/model/user/StatusUser";
import { UpdateUserData, UserAccountResponse } from "@/domain/model/user/UserData";
import { Either, success } from "@/shared/Either";
import { EncryptsPassword } from "@/data/protocol/EncryptsPassword";
import { DbUpdateUserAccount } from "@/data/usecase/DbUpdateUserAccount";




describe('UpdateUserAccount', () => {
  test('should update all data and return success', async () => {
    class FindUserAccountByEmailRepositoryStub implements FindUserAccountByEmailRepository {
      async execute(email: string): Promise<Either<NotFoundError, UserAccountResponse>> {
        return success({
          name: 'Any Name',
          email: 'any@valid.com.br',
          status: StatusUser.CREATED
        })
      }
    }

    class EncryptsPasswordStub implements EncryptsPassword {
      async execute(data: string): Promise<Either<InvalidPasswordParameterError, string>> {
        return success('AnyPasswordEncrypted')
      }
    }

    class UpdateUserAccountRepositoryStub implements UpdateUserAccountRepository {
      async execute(data: UpdateUserData): Promise<Either<RepositoryInternalError, void>> {
        return success()
      }
    }

    class FindUserAccountByIdRepositoryStub implements FindUserAccountByIdRepository {
      async execute(id: string): Promise<Either<NotFoundError, UserAccountResponse>> {
        return success({
          name: 'Any Name',
          email: 'any@valid.com.br',
          status: StatusUser.CREATED
        })
      }
    }

    const findByIdRepoStub = new FindUserAccountByIdRepositoryStub()
    const updateRepoStub = new UpdateUserAccountRepositoryStub()
    const findByEmailRepoStub = new FindUserAccountByEmailRepositoryStub()
    const encryptsPasswordStub = new EncryptsPasswordStub();

    const sut = new DbUpdateUserAccount(
      updateRepoStub,
      findByEmailRepoStub,
      findByIdRepoStub,
      encryptsPasswordStub);

    const response = await sut.execute({
      id: 'valid-id',
      name: 'Any Name',
      email: 'any@valid.com.br',
      password: 'ValidPassword',
      profileImage: 'imagePath'
    })

    expect(response.isSuccess()).toBe(true)
  })
})