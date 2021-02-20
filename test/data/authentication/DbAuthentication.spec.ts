import { FindUserAccountByEmailRepository } from "@/data/repository/user/FindUserAccountByEmailRepository"
import { StatusUser } from "@/domain/model/user/StatusUser"
import { UserAccountResponse } from "@/domain/model/user/UserData"
import { Either, success } from "@/shared/Either"
import { NotFoundError } from "@/data/error"
import { DbAuthentication } from "@/data/usecase/authentication/DbAuthentication"

const findByEmailRepoStubFactory = (): FindUserAccountByEmailRepository => {
  class FindUserAccountByEmailRepoStub implements FindUserAccountByEmailRepository {
    async execute(email: string): Promise<Either<NotFoundError, UserAccountResponse>> {
      return success({
        id: 'valid-id',
        name: 'Any Name',
        email: 'any@valid.com.br',
        status: StatusUser.CREATED
      })
    }
  }
  return new FindUserAccountByEmailRepoStub()
}

type TypeSut = {
  findByEmailRepoStub: FindUserAccountByEmailRepository
  sut: DbAuthentication
}

const makeSutFactory = (): TypeSut => {
  const findByEmailRepoStub = findByEmailRepoStubFactory()
  const sut = new DbAuthentication(findByEmailRepoStub)
  return { sut, findByEmailRepoStub }
}

describe('DbAuthentication', () => {

  test('should call FindUserAccountByEmailRepository with correct email', async () => {
    const { sut, findByEmailRepoStub } = makeSutFactory()

    const executeSpy = jest.spyOn(findByEmailRepoStub, 'execute')

    await sut.execute({
      email: 'email@valid.com.br',
      password: 'ValidPassword',
    })

    expect(executeSpy).toHaveBeenCalledWith('email@valid.com.br')
  })

})