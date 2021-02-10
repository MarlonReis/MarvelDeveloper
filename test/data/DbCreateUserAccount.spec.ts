import { DbCreateUserAccount } from '@/data/usecase/DbCreateUserAccount'
import { CreateUserData } from '@/domain/model/user/UserData'
import { Either, failure, success } from '@/shared/Either'
import { NotFoundError, RepositoryInternalError } from './error'
import { EncryptsPassword } from './protocol/EncryptsPassword'
import { CreateUserAccountRepository } from './repository/CreateUserAccountRepository'
import { FindUserAccountByEmailRepository } from './repository/FindUserAccountByEmailRepository'

const createUserAccountRepositoryStubFactory = (): CreateUserAccountRepository => {
  class CreateUserAccountRepositoryStub implements CreateUserAccountRepository {
    async execute (data: CreateUserData): Promise<Either<RepositoryInternalError, void>> {
      return await Promise.resolve(success())
    }
  }
  return new CreateUserAccountRepositoryStub()
}

const findUserAccountByEmailRepositoryStubFactory = (): FindUserAccountByEmailRepository => {
  class FindUserAccountByEmailRepositoryStub implements FindUserAccountByEmailRepository {
    async execute (email: string): Promise<Either<NotFoundError, any>> {
      return await Promise.resolve(failure(new Error('Any error')))
    }
  }
  return new FindUserAccountByEmailRepositoryStub()
}

const encryptsPasswordStubFactory = (): EncryptsPassword => {
  class EncryptsPasswordStub implements EncryptsPassword {
    async execute (data: string): Promise<string> {
      return await Promise.resolve('ValidDataEncrypt')
    }
  }
  return new EncryptsPasswordStub()
}

interface TypeSut {
  encryptsPasswordStub: EncryptsPassword
  repositoryStub: CreateUserAccountRepository
  findUserByEmailStub: FindUserAccountByEmailRepository
  sut: DbCreateUserAccount
}

const makeSutFactory = (): TypeSut => {
  const encryptsPasswordStub = encryptsPasswordStubFactory()
  const repositoryStub = createUserAccountRepositoryStubFactory()
  const findUserByEmailStub = findUserAccountByEmailRepositoryStubFactory()
  const sut = new DbCreateUserAccount(repositoryStub, findUserByEmailStub, encryptsPasswordStub)
  return { repositoryStub, encryptsPasswordStub, findUserByEmailStub, sut }
}

describe('DbCreateUserAccount', () => {
  test('should create user account', async () => {
    const { sut } = makeSutFactory()

    const response = await sut.execute({
      name: 'Valid Name',
      email: 'valid@email.com.br',
      password: 'V4l1d@Password'
    })

    expect(response.isSuccess()).toBe(true)
  })
})
