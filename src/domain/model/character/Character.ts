import { Comic } from '@/domain/model/comic/Comic'

export interface Character {
  id: string
  name: string
  description: string
  topImage: string
  profileImage: string
  comics?: Comic[]
}

export class CharacterBuilder {
  private character: Character

  private constructor () { }

  public static build (character: Character): CharacterBuilder {
    const build: CharacterBuilder = new CharacterBuilder()
    build.character = character
    return build
  }

  name (value: string): this {
    this.character.name = value
    return this
  }

  description (value: string): this {
    this.character.description = value
    return this
  }

  profileImage (value: string): this {
    this.character.profileImage = value
    return this
  }

  topImage (value: string): this {
    this.character.topImage = value
    return this
  }

  now (): Character {
    return this.character
  }
}
