import {
  FindUserAccountByEmailRepository
} from "@/data/repository/user/FindUserAccountByEmailRepository";
import {
  DuplicatePropertyError,
  InvalidPasswordParameterError,
  NotFoundError,
  RepositoryInternalError
} from "@/data/error";
import { UpdateUserAccountRepository } from "@/data/repository/user/UpdateUserAccountRepository";
import { FindUserAccountByIdRepository } from "@/data/repository/user/FindUserAccountByIdRepository";
import { StatusUser } from "@/domain/model/user/StatusUser";
import { UpdateUserData, UserAccountResponse } from "@/domain/model/user/UserData";
import { Either, failure, success } from "@/shared/Either";
import { EncryptsPassword } from "@/data/protocol/EncryptsPassword";
import { DbUpdateUserAccount } from "@/data/usecase/user/DbUpdateUserAccount";


const findByEmailRepoStubFactory = (): FindUserAccountByEmailRepository => {
  class FindUserAccountByEmailRepositoryStub implements FindUserAccountByEmailRepository {
    async execute(email: string): Promise<Either<NotFoundError, UserAccountResponse>> {
      return success({
        name: 'Any Name',
        email: 'any@valid.com.br',
        status: StatusUser.CREATED
      })
    }
  }
  return new FindUserAccountByEmailRepositoryStub()
}

const encryptsStubFactory = (): EncryptsPassword => {
  class EncryptsPasswordStub implements EncryptsPassword {
    async execute(data: string): Promise<Either<InvalidPasswordParameterError, string>> {
      return success('AnyPasswordEncrypted')
    }
  }
  return new EncryptsPasswordStub()
}

const updateRepoStubFactory = (): UpdateUserAccountRepository => {
  class UpdateUserAccountRepositoryStub implements UpdateUserAccountRepository {
    async execute(data: UpdateUserData): Promise<Either<RepositoryInternalError, void>> {
      return success()
    }
  }
  return new UpdateUserAccountRepositoryStub()
}

const findByIdRepoStubFactory = (): FindUserAccountByIdRepository => {
  class FindUserAccountByIdRepositoryStub implements FindUserAccountByIdRepository {
    async execute(id: string): Promise<Either<NotFoundError, UserAccountResponse>> {
      return success({
        id: 'valid-id',
        name: 'Any Name',
        email: 'any@valid.com.br',
        password: 'OldPasswordEncrypted',
        profileImage: 'OldImagePath',
        status: StatusUser.CREATED
      })
    }
  }
  return new FindUserAccountByIdRepositoryStub()
}

type TypeSut = {
  sut: DbUpdateUserAccount
  updateRepoStub: UpdateUserAccountRepository
  findByIdRepoStub: FindUserAccountByIdRepository
  findByEmailRepoStub: FindUserAccountByEmailRepository
  encryptsPasswordStub: EncryptsPassword
}

const makeSutFactory = (): TypeSut => {
  const findByIdRepoStub = findByIdRepoStubFactory()
  const updateRepoStub = updateRepoStubFactory()
  const findByEmailRepoStub = findByEmailRepoStubFactory()
  const encryptsPasswordStub = encryptsStubFactory();

  const sut = new DbUpdateUserAccount(updateRepoStub, findByEmailRepoStub, findByIdRepoStub, encryptsPasswordStub);
  return { findByIdRepoStub, updateRepoStub, findByEmailRepoStub, encryptsPasswordStub, sut }
}

const defaultUpdateParam = {
  id: 'valid-id',
  name: 'Any Name',
  email: 'any@valid.com.br',
  password: 'ValidPassword',
  profileImage: 'imagePath'
}

describe('UpdateUserAccount', () => {
  test('should update all data and return success', async () => {
    const { sut } = makeSutFactory()
    const response = await sut.execute(defaultUpdateParam)
    expect(response.isSuccess()).toBe(true)
  })

  test('should call update with correct params', async () => {
    const { sut, updateRepoStub } = makeSutFactory()
    const executeSpy = jest.spyOn(updateRepoStub, 'execute')

    const response = await sut.execute(defaultUpdateParam)
    expect(response.isSuccess()).toBe(true)
    expect(executeSpy).toBeCalledWith({
      id: 'valid-id',
      name: 'Any Name',
      email: 'any@valid.com.br',
      password: 'AnyPasswordEncrypted',
      profileImage: 'imagePath',
      status: StatusUser.CREATED
    })
  })

  test('should be not change property when is undefined', async () => {
    const { sut, updateRepoStub } = makeSutFactory()
    const executeSpy = jest.spyOn(updateRepoStub, 'execute')

    const response = await sut.execute({
      ...defaultUpdateParam,
      password: undefined,
      profileImage: undefined,
      name: undefined,
      status: StatusUser.DELETED
    })


    expect(response.isSuccess()).toBe(true)
    expect(executeSpy).toBeCalledWith({
      id: 'valid-id',
      name: 'Any Name',
      email: 'any@valid.com.br',
      password: 'OldPasswordEncrypted',
      profileImage: 'OldImagePath',
      status: StatusUser.DELETED
    })
  })

  test('should pass correct id to repository ', async () => {
    const { sut, findByIdRepoStub } = makeSutFactory()
    const executeSpy = jest.spyOn(findByIdRepoStub, 'execute')
    const response = await sut.execute(defaultUpdateParam)

    expect(response.isSuccess()).toBe(true)
    expect(executeSpy).toBeCalledWith('valid-id')
  })

  test('should passes new email unavailable as parameter', async () => {
    const { sut, findByEmailRepoStub } = makeSutFactory()
    const executeSpy = jest.spyOn(findByEmailRepoStub, 'execute')
    const response = await sut.execute({
      ...defaultUpdateParam,
      email: 'new-email@valid.com.br'
    })

    expect(executeSpy).toBeCalledWith('new-email@valid.com.br')
    expect(response.isFailure()).toBe(true)
    expect(response.value).toBeInstanceOf(DuplicatePropertyError)
    expect(response.value).toMatchObject({
      message: "Email 'new-email@valid.com.br' is already being used by another account!"
    })
  })

  test('should return error when find by id return failure', async () => {
    const { sut, findByIdRepoStub } = makeSutFactory()
    jest.spyOn(findByIdRepoStub, 'execute').
      mockImplementationOnce(() => Promise.resolve(failure(new NotFoundError('any message'))))

    const response = await sut.execute(defaultUpdateParam)
    expect(response.isFailure()).toBe(true)
    expect(response.value).toBeInstanceOf(NotFoundError)
    expect(response.value).toMatchObject({
      message: 'any message'
    })
  })

  test('should change email when new email not found', async () => {
    const { sut, findByEmailRepoStub, updateRepoStub } = makeSutFactory()
    const executeSpy = jest.spyOn(updateRepoStub, 'execute')

    jest.spyOn(findByEmailRepoStub, 'execute').
      mockImplementationOnce(() => Promise.
        resolve(failure(new NotFoundError('any message'))))

    const response = await sut.execute({
      ...defaultUpdateParam,
      email: 'new-email@valid.com.br'
    })

    expect(response.isSuccess()).toBe(true)
    expect(executeSpy).toBeCalledWith(expect.objectContaining({
      email: 'new-email@valid.com.br'
    }))
  })


  test('should pass new password as parameter when it was defined', async () => {
    const { sut, updateRepoStub, encryptsPasswordStub } = makeSutFactory()

    const executeSpy = jest.spyOn(encryptsPasswordStub, 'execute')

    const updateRepoStubExecuteSpy = jest.spyOn(updateRepoStub, 'execute')

    await sut.execute({ ...defaultUpdateParam, password: 'NewPassword' })
    expect(executeSpy).toBeCalledWith('NewPassword')
    expect(updateRepoStubExecuteSpy).toBeCalledTimes(1)
    expect(updateRepoStubExecuteSpy).toBeCalledWith(expect.objectContaining({
      password: 'AnyPasswordEncrypted'
    }))
  })

  test('should return failure when cannot encrypt password', async () => {
    const { sut, encryptsPasswordStub } = makeSutFactory()

    jest.spyOn(encryptsPasswordStub, 'execute').
      mockImplementationOnce(() => Promise.resolve(failure(new InvalidPasswordParameterError('any message'))))

    const response = await sut.execute(defaultUpdateParam)

    expect(response.isFailure()).toBe(true)
    expect(response.value).toBeInstanceOf(InvalidPasswordParameterError)
    expect(response.value).toMatchObject({
      message: 'any message'
    })
  })


  test('should call update repository with new image', async () => {
    const { sut, updateRepoStub } = makeSutFactory()

    const updateRepoStubExecuteSpy = jest.spyOn(updateRepoStub, 'execute')
    const response = await sut.execute({
      ...defaultUpdateParam, profileImage: 'other image paths'
    })

    expect(response.isSuccess()).toBe(true)
    expect(updateRepoStubExecuteSpy).toBeCalledTimes(1)
    expect(updateRepoStubExecuteSpy).toBeCalledWith(expect.objectContaining({
      profileImage: 'other image paths'
    }))
  })


  test('should return failure when update repository return failure ', async () => {
    const { sut, updateRepoStub } = makeSutFactory()
    jest.spyOn(updateRepoStub, 'execute').mockImplementationOnce(
      () => Promise.resolve(failure(new RepositoryInternalError(new Error('Any error'))))
    )

    const response = await sut.execute(defaultUpdateParam)

    expect(response.isSuccess()).toBe(false)
    expect(response.value).toBeInstanceOf(RepositoryInternalError)
    expect(response.value).toMatchObject({
      message: 'Any error',
      cause: new Error('Any error')
    })
  })

})