import { FindUserAccountByEmailRepository } from '@/data/repository/FindUserAccountByEmailRepository'
import { FindUserAccountByIdRepository } from '@/data/repository/FindUserAccountByIdRepository'
import { UpdateUserAccountRepository } from '@/data/repository/UpdateUserAccountRepository'
import { UpdateUserAccount } from '@/domain/usecase/UpdateUserAccount'
import { EncryptsPassword } from '@/data/protocol/EncryptsPassword'
import { UpdateUserData } from '@/domain/model/user/UserData'
import { InvalidParamError } from '@/domain/errors'
import { Either, failure, success } from '@/shared/Either'
import { User } from '@/domain/model/user/User'
import { Email } from '@/domain/value-object'
import {
  DuplicatePropertyError,
  InvalidPasswordParameterError,
  RepositoryInternalError
} from '@/data/error'

export class DbUpdateUserAccount implements UpdateUserAccount {
  private readonly encryptsPassword: EncryptsPassword
  private readonly updateUserAccountRepo: UpdateUserAccountRepository
  private readonly findUserAccountByEmailRepo: FindUserAccountByEmailRepository
  private readonly findUserAccountByIdRepo: FindUserAccountByIdRepository

  constructor (
    updateRepo: UpdateUserAccountRepository,
    findByEmailRepo: FindUserAccountByEmailRepository,
    findByIdRepo: FindUserAccountByIdRepository,
    encrypt: EncryptsPassword) {
    this.updateUserAccountRepo = updateRepo
    this.findUserAccountByEmailRepo = findByEmailRepo
    this.findUserAccountByIdRepo = findByIdRepo
    this.encryptsPassword = encrypt
  }

  async execute (data: UpdateUserData): Promise<
    Either<InvalidParamError | DuplicatePropertyError | InvalidPasswordParameterError
      | RepositoryInternalError, void>> {
    const userAccountOrError = await this.findUserAccountByIdRepo.execute(data.id)

    if (userAccountOrError.isFailure()) {
      return failure(userAccountOrError.value)
    }

    const userAccount = userAccountOrError.value as User

    const emailData = Email.create(data.email)

    if (emailData.isSuccess() && !emailData.value.isEqual(userAccount.email)) {
      const emailOrError = await this.findUserAccountByEmailRepo.execute(data.email)
      if (emailOrError.isSuccess()) {
        return failure(new DuplicatePropertyError(`Email '${data.email}' is already being used by another account!`))
      }
      userAccount.email = data.email
    }

    if (data.password) {
      const encryptOrError = await this.encryptsPassword.execute(data.password)
      if (encryptOrError.isSuccess()) {
        userAccount.password = encryptOrError.value
      } else {
        return failure(encryptOrError.value)
      }
    }

    if (data.profileImage) {
      userAccount.profileImage = data.profileImage
    }

    await this.updateUserAccountRepo.execute({
      id: userAccount.id,
      name: userAccount.name,
      email: userAccount.email,
      status: userAccount.status,
      password: userAccount.password,
      profileImage: userAccount.profileImage
    })

    return success()
  }
}
