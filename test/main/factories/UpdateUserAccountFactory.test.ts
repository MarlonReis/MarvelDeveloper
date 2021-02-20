import { DbUpdateUserAccount } from "@/data/usecase/user/DbUpdateUserAccount"
import { UpdateUserAccountFactory } from "@/main/factories/user/UpdateUserAccountFactory"
import { LogControllerDecorator } from "@/main/factories/LogControllerDecorator"

const sut = new UpdateUserAccountFactory()

describe('UpdateUserAccountFactory', () => {
  test('should create a use case factory', () => {   
    const factory = sut.makeUpdateUserAccountFactory()
    expect(factory).toBeInstanceOf(DbUpdateUserAccount)
  })

  test('should create Controller factory', () => {
    const response = sut.makeControllerFactory()
    expect(response).toBeInstanceOf(LogControllerDecorator)
  })
})