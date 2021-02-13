import { CreateUserAccount } from '@/domain/usecase/CreateUserAccount'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class CreateUserAccountController implements Controller {
  private readonly createUserAccount: CreateUserAccount

  constructor (createUserAccountUseCase: CreateUserAccount) {
    this.createUserAccount = createUserAccountUseCase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const response = await this.createUserAccount.execute(request.body)
    if (response.isSuccess()) {
      return await Promise.resolve({
        statusCode: 201
      })
    }
  }
}
