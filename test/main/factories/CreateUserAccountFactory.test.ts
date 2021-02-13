import { DbCreateUserAccount } from '@/data/usecase/DbCreateUserAccount'
import { CreateUserAccountFactory } from '@/main/factories/CreateUserAccountFactory'

describe('CreateUserAccountFactory', () => {
  test('should create a factory', () => {
    const sut = new CreateUserAccountFactory()
    const response = sut.makeCreateUserAccountFactory()
    expect(response).toBeInstanceOf(DbCreateUserAccount)
  })
})
