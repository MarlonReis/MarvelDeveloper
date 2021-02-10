import { InvalidParamError } from '@/domain/errors'
import { CreateUserData } from '@/domain/model/user/UserData'
import { CreateUserAccount } from '@/domain/usecase/CreateUserAccount'
import { Either, failure, success } from '@/shared/Either'
import { CreateUserAccountRepository } from '@/data/repository/CreateUserAccountRepository'
import { FindUserAccountByEmailRepository } from '@/data/repository/FindUserAccountByEmailRepository'
import { EncryptsPassword } from '@/data/protocol/EncryptsPassword'
import { DuplicatePropertyError } from '@/data/error'

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

  async execute (data: CreateUserData): Promise<Either<InvalidParamError | DuplicatePropertyError, void>> {
    const userFound = await this.findUserAccountByEmail.execute(data.email)

    if (userFound.isFailure()) {
      const password = await this.encryptsPassword.execute(data.password)
      const response = await this.createUserAccount.execute({ ...data, password })
      if (response.isSuccess()) {
        return await Promise.resolve(success())
      }
    }

    return await Promise.resolve(failure(new DuplicatePropertyError(
      `Email '${data.email}' is already being used by another account!`)))
  }
}
