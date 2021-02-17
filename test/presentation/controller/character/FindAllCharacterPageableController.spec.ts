import { NotFoundError } from "@/data/error"
import { Pagination } from "@/domain/helper/Pagination"
import { CharacterResponse } from "@/domain/model/character/CharacterData"
import { FindAllCharacterPageable } from "@/domain/usecase/character/FindAllCharacterPageable"
import { Either, failure, success } from "@/shared/Either"
import {
  FindAllCharacterPageableController
} from "@/presentation/controller/character/FindAllCharacterPageableController"
import { InternalServerError } from "@/presentation/error"

const defaultCharacterData = {
  id: 'valid-id',
  name: "Any Name",
  description: "Any description",
  topImage: "https://example.com/image-top-image.png",
  profileImage: "https://example.com/image-profile-image.png",
  comics: []
}

const findPageableStubFactory = (): FindAllCharacterPageable => {
  class FindAllCharacterPageableStub implements FindAllCharacterPageable {
    async execute(page: number, limit: number): Promise<Either<NotFoundError, Pagination<CharacterResponse>>> {
      return success({
        from: 1,
        to: 1,
        perPage: 1,
        total: 1,
        currentPage: 1,
        prevPage: false,
        nextPage: false,
        data: [defaultCharacterData]
      })
    }
  }
  return new FindAllCharacterPageableStub()
}
type TypeSut = {
  findAllCharacterPageableStub: FindAllCharacterPageable
  sut: FindAllCharacterPageableController
}

const makeFactory = (): TypeSut => {
  const findAllCharacterPageableStub = findPageableStubFactory()
  const sut = new FindAllCharacterPageableController(findAllCharacterPageableStub)
  return { findAllCharacterPageableStub, sut }
}


describe('FindAllCharacterPageableController', () => {
  test('should return statusCode 200 and data pageable when found register', async () => {
    const { sut } = makeFactory()

    const response = await sut.handle({ query: { page: 1, perPage: 10 } })
    expect(response).toEqual({
      statusCode: 200,
      body: {
        from: 1,
        to: 1,
        perPage: 1,
        total: 1,
        currentPage: 1,
        prevPage: false,
        nextPage: false,
        data: expect.arrayContaining([defaultCharacterData])
      }
    })
  })

  test('should return statusCode 500 and error when use case return error', async () => {
    const { sut, findAllCharacterPageableStub } = makeFactory()
    jest.spyOn(findAllCharacterPageableStub, 'execute')
      .mockImplementationOnce(async () => failure(new Error('Any error')))

    const response = await sut.handle({ query: { page: 1, perPage: 10 } })
    expect(response).toEqual({
      statusCode: 500,
      body: new InternalServerError(new Error('Any error'))
    })
  })


  test('should return call use case with correct params', async () => {
    const { sut, findAllCharacterPageableStub } = makeFactory()
    const executeSpy = jest.spyOn(findAllCharacterPageableStub, 'execute')
    await sut.handle({ query: { page: 10, perPage: 100 } })
    expect(executeSpy).toBeCalledWith(10, 100)
  })

})