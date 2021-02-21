import { InvalidParamError } from "@/domain/errors"
import { Role } from "@/domain/model/user/AuthenticationData"
import { FavoriteComicData } from "@/domain/model/user/UserData"
import { UserFavoriteComic } from "@/domain/usecase/user/UserFavoriteComic"
import { Either, success } from "@/shared/Either"
import {
  UserFavoriteComicController
} from "@/presentation/controller/user/UserFavoriteComicController"

describe('UserFavoriteComicController', () => {
  test('should call user favorite comic with correct param', async () => {

    class UserFavoriteComicStub implements UserFavoriteComic {
      async execute(data: FavoriteComicData): Promise<Either<InvalidParamError, void>> {
        return success()
      }
    }

    const userFavoriteComicStub = new UserFavoriteComicStub()

    const executeSpy = jest.spyOn(userFavoriteComicStub, 'execute')

    const sut = new UserFavoriteComicController(userFavoriteComicStub)
    await sut.handle({
      authenticatedUserData: {
        id: 'user-valid-id',
        role: Role.USER
      },
      body: {
        comicId: 'comic-id-valid'
      }
    })

    expect(executeSpy).toHaveBeenCalledWith({
      comicId: 'comic-id-valid',
      userId: 'user-valid-id'
    })

  })

  
})