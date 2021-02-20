import { NotFoundError } from '@/data/error'
import { FindUserAccountByEmailRepository } from '@/data/repository/user/FindUserAccountByEmailRepository'
import { AuthData } from '@/domain/model/user/AuthenticationData'
import { Authentication } from '@/domain/usecase/authentication/Authentication'
import { Either, failure, success } from '@/shared/Either'

export class DbAuthentication implements Authentication {
  private readonly findByEmailRepo: FindUserAccountByEmailRepository

  constructor (findByEmailRepo: FindUserAccountByEmailRepository) {
    this.findByEmailRepo = findByEmailRepo
  }

  async execute (auth: AuthData): Promise<Either<NotFoundError, string>> {
    const response = await this.findByEmailRepo.execute(auth.email)
    if (response.isSuccess()) {
      return success('ok')
    }
    return failure(response.value)
  }
}
