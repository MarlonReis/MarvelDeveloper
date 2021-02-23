import { NotFoundError } from "@/domain/errors"
import { Pagination } from "@/domain/helper/Pagination"
import { ComicResponse } from "@/domain/model/comic/ComicData"
import { Role } from "@/domain/model/user/AuthenticationData"
import { FindAllUserFavoriteComicsPageable } from "@/domain/usecase/user/FindAllUserFavoriteComicsPageable"
import { Either, failure, success } from "@/shared/Either"
import {
  FindAllUserFavoriteComicsPageableController
} from "@/presentation/controller/user/FindAllUserFavoriteComicsPageableController"
import { internalServerError, ok, unProcessableEntity } from "@/presentation/helper"
import { MissingParamError } from "@/presentation/error"


const defaultComicData: ComicResponse = {
  id: 'valid-id',
  title: "Any Title",
  published: "2020-10-10",
  writer: "Any Writer",
  penciler: "Any Penciler",
  coverArtist: "Any Cover Artist",
  description: "Any Description",
  edition: "5",
  coverImage: "http://server.com/images.png",
  characters: []
}

const defaultPageableResponse = {
  from: 1,
  to: 1,
  perPage: 1,
  total: 1,
  currentPage: 1,
  prevPage: false,
  nextPage: false,
  data: [defaultComicData]
}

const authenticatedUserData = {
  authenticatedUserData: {
    id: 'user-valid-id',
    role: Role.USER
  }
}

const findAllPageableStubFactory = (): FindAllUserFavoriteComicsPageable => {
  class FindAllPageableStub implements FindAllUserFavoriteComicsPageable {
    async execute(userId: string, page: number, limit: number): Promise<Either<NotFoundError, Pagination<ComicResponse>>> {
      return success(defaultPageableResponse)
    }
  }
  return new FindAllPageableStub()
}

type TypeSut = {
  findAllPageableStub: FindAllUserFavoriteComicsPageable
  sut:FindAllUserFavoriteComicsPageableController
}

const makeSutFactory = (): TypeSut => {
  const findAllPageableStub = findAllPageableStubFactory()
  const sut = new FindAllUserFavoriteComicsPageableController(findAllPageableStub)
  return {findAllPageableStub, sut}
}

describe('FindAllUserFavoriteComicsPageableController', () => {
  test('should call use case with correct params', async () => {
   const { sut, findAllPageableStub} = makeSutFactory()
    const executeSpy = jest.spyOn(findAllPageableStub, 'execute')
  
    await sut.handle({
      ...authenticatedUserData,
      query: { page: 1, perPage: 10 }
    })

    expect(executeSpy).toHaveBeenCalledWith('user-valid-id', 1, 10)
  })

  test('should return statusCode 200 when found data', async () => {
    const { sut} = makeSutFactory()
    
    const response =   await sut.handle({ ...authenticatedUserData, query: { page: 1, perPage: 10 }})
 
     expect(response).toEqual(ok(defaultPageableResponse))
  })

  test('should return statusCode 400 when when not add id', async () => {
    const { sut} = makeSutFactory()
    
    const response =   await sut.handle({})
 
     expect(response).toEqual(unProcessableEntity(new MissingParamError('id')))
  })

  
  test('should return statusCode 500 when use case return error', async () => {
    const { sut, findAllPageableStub } = makeSutFactory()
    jest.spyOn(findAllPageableStub, 'execute').
      mockImplementationOnce(async () => failure(new Error('Error message')))
    
    const response =   await sut.handle({ ...authenticatedUserData, query: { page: 1, perPage: 10 }})
 
     expect(response).toEqual(internalServerError(new Error('Error message')))
   })

})