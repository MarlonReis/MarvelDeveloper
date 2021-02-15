import { CharacterResponse } from '@/domain/model/character/CharacterData'
import { NotFoundError } from '@/data/error'
import { Either } from '@/shared/Either'

export interface FindCharacterById {
  execute: (id: string) => Promise<Either<NotFoundError, CharacterResponse>>
}
