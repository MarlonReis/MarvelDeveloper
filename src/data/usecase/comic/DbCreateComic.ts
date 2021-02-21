import { FindCharacterByIdRepository } from '@/data/repository/character/FindCharacterByIdRepository'
import { CreateComicRepository } from '@/data/repository/comic/CreateComicRepository'
import { CreateComicData } from '@/domain/model/comic/ComicData'
import { CreateComic } from '@/domain/usecase/comic/CreateComic'
import { InvalidParamError, NotFoundError } from '@/domain/errors'
import { Either, failure } from '@/shared/Either'
import { RepositoryInternalError } from '@/data/error'

export class DbCreateComic implements CreateComic {
  private readonly createComicRepository: CreateComicRepository
  private readonly findCharacterByIdRepo: FindCharacterByIdRepository

  constructor (repo: CreateComicRepository, findCharacterByIdRepo: FindCharacterByIdRepository) {
    this.createComicRepository = repo
    this.findCharacterByIdRepo = findCharacterByIdRepo
  }

  async execute (data: CreateComicData): Promise<Either<InvalidParamError | NotFoundError | RepositoryInternalError, void>> {
    if (data.characters) {
      const charactersResponse = await Promise.all(data.characters
        .map(async characterData => await this.findCharacterByIdRepo
          .execute(characterData.id)))

      const onlyCharacterWithNotFound: Either<Error, any> = charactersResponse
        .filter(character => character.isFailure()).pop()

      if (onlyCharacterWithNotFound) {
        return failure(onlyCharacterWithNotFound.value)
      }
    }

    return await this.createComicRepository.execute(data)
  }
}
