import { NotFoundError } from '@/data/error'
import { ComparePassword } from '@/data/protocol/ComparePassword'
import { TokenGenerator } from '@/data/protocol/TokenGenerator'
import { FindUserAccountByEmailRepository } from '@/data/repository/user/FindUserAccountByEmailRepository'
import { AuthData } from '@/domain/model/user/AuthenticationData'
import { Authentication } from '@/domain/usecase/authentication/Authentication'
import { Either, failure } from '@/shared/Either'

export class DbAuthentication implements Authentication {
  private readonly findByEmailRepo: FindUserAccountByEmailRepository
  private readonly comparePassword: ComparePassword
  private readonly tokenGenerator: TokenGenerator

  constructor (
    findByEmailRepo: FindUserAccountByEmailRepository,
    comparePassword: ComparePassword,
    tokenGenerator: TokenGenerator
  ) {
    this.findByEmailRepo = findByEmailRepo
    this.comparePassword = comparePassword
    this.tokenGenerator = tokenGenerator
  }

  async execute (auth: AuthData): Promise<Either<NotFoundError, string>> {
    const response = await this.findByEmailRepo.execute(auth.email)
    if (response.isSuccess()) {
      const comparePwd = await this.comparePassword.execute(auth.password, response.value.password)
      if (comparePwd.isSuccess()) {
        return await this.tokenGenerator.execute(response.value.id)
      }
      return failure(comparePwd.value)
    }
    return failure(response.value)
  }
}
