import { InvalidParamError } from '@/domain/errors'
import { Description, Name, PathFile } from '@/domain/value-object'
import { Either } from '@/shared/Either'

export interface CreateCharacterData {
  name: string
  description: string
  topImage: string
  profileImage: string
}

export interface CharacterResponse {
  id: string
  name: string
  description: string
  topImage: string
  profileImage: string
  comics: any[]
}

export const CharacterValidationData = {
  name (value: string): Either<InvalidParamError, Name> {
    return Name.create(value)
  },
  description (value: string): Either<InvalidParamError, Description> {
    return Description.create(value)
  },
  profileImage (value: string): Either<InvalidParamError, PathFile> {
    return PathFile.create('profileImage', value)
  },
  topImage (value: string): Either<InvalidParamError, PathFile> {
    return PathFile.create('topImage', value)
  }
}
