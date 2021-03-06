import { DbCreateUserAccount } from '@/data/usecase/user/DbCreateUserAccount'
import { CreateUserAccountFactory } from '@/main/factories/user/CreateUserAccountFactory'
import { LogControllerDecorator } from '@/main/factories/LogControllerDecorator'
const sut = new CreateUserAccountFactory()

describe('CreateUserAccountFactory', () => {
  test('should create DbCreateUserAccountFactory', () => {
    const response = sut.makeCreateUserAccountFactory()
    expect(response).toBeInstanceOf(DbCreateUserAccount)
  })

  test('should create Controller factory', () => {
    const response = sut.makeControllerFactory()
    expect(response).toBeInstanceOf(LogControllerDecorator)
  })
})
