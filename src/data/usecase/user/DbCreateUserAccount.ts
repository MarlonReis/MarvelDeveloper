import { InvalidParamError } from '@/domain/errors'
import { CreateUserData } from '@/domain/model/user/UserData'
import { CreateUserAccount } from '@/domain/usecase/user/CreateUserAccount'
import { Either, failure, success } from '@/shared/Either'
import { CreateUserAccountRepository } from '@/data/repository/CreateUserAccountRepository'
import { FindUserAccountByEmailRepository } from '@/data/repository/FindUserAccountByEmailRepository'
import { EncryptsPassword } from '@/data/protocol/EncryptsPassword'
import {
  DuplicatePropertyError,
  RepositoryInternalError
} from '@/data/error'

export class DbCreateUserAccount implements CreateUserAccount {
  private readonly createUserAccount: CreateUserAccountRepository
  private readonly findUserAccountByEmail: FindUserAccountByEmailRepository
  private readonly encryptsPassword: EncryptsPassword

  constructor (
    createUserAccountRepository: CreateUserAccountRepository,
    findUserAccountByEmail: FindUserAccountByEmailRepository,
    encryptsPassword: EncryptsPassword
  ) {
    this.createUserAccount = createUserAccountRepository
    this.findUserAccountByEmail = findUserAccountByEmail
    this.encryptsPassword = encryptsPassword
  }

  async execute (data: CreateUserData):
    Promise<Either<InvalidParamError | DuplicatePropertyError | RepositoryInternalError, void>> {
    const userFound = await this.findUserAccountByEmail.execute(data.email)

    if (userFound.isFailure()) {
      const passwordEncrypted = await this.encryptsPassword.execute(data.password)

      if (passwordEncrypted.isFailure()) {
        return failure(new InvalidParamError('password', data.password))
      }

      const response = await this.createUserAccount.execute({
        ...data,
        password: passwordEncrypted.value
      })

      if (response.isSuccess()) {
        return success()
      }
      return failure(new RepositoryInternalError(response.value))
    }

    return failure(new DuplicatePropertyError(
      `Email '${data.email}' is already being used by another account!`))
  }
}
