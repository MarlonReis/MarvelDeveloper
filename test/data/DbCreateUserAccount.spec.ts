import { DbCreateUserAccount } from '@/data/usecase/DbCreateUserAccount'
import { CreateUserData } from '@/domain/model/user/UserData'
import { Either, failure, success } from '@/shared/Either'
import { NotFoundError, RepositoryInternalError } from './error'
import { EncryptsPassword } from './protocol/EncryptsPassword'
import { CreateUserAccountRepository } from './repository/CreateUserAccountRepository'
import { FindUserAccountByEmailRepository } from './repository/FindUserAccountByEmailRepository'

describe('DbCreateUserAccount', () => {
  test('should create user account', async () => {
    class CreateUserAccountRepositoryStub implements CreateUserAccountRepository {
      async execute (data: CreateUserData): Promise<Either<RepositoryInternalError, void>> {
        return await Promise.resolve(success())
      }
    }

    class FindUserAccountByEmailRepositoryStub implements FindUserAccountByEmailRepository {
      async execute (email: string): Promise<Either<NotFoundError, any>> {
        return await Promise.resolve(failure(new Error('Any error')))
      }
    }

    class EncryptsPasswordStub implements EncryptsPassword {
      async execute (data: string): Promise<string> {
        return await Promise.resolve('ValidDataEncrypt')
      }
    }

    const encryptsPasswordStub = new EncryptsPasswordStub()
    const repositoryStub = new CreateUserAccountRepositoryStub()
    const findUserByEmailStub = new FindUserAccountByEmailRepositoryStub()
    const sut = new DbCreateUserAccount(repositoryStub, findUserByEmailStub, encryptsPasswordStub)

    const response = await sut.execute({
      name: 'Valid Name',
      email: 'valid@email.com.br',
      password: 'V4l1d@Password'
    })

    expect(response.isSuccess()).toBe(true)
  })
})
