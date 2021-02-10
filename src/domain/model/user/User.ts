import { InvalidParamError } from '@/domain/errors'
import { Either, failure, success } from '@/shared/Either'
import { Email, Name, Password } from '@/domain/value-object'
import { IdEntity } from '@/domain/value-object/IdEntity'
import { CreateUserData } from './UserData'

export enum StatusUser {
  CREATED
}

export class User {
  public readonly id: IdEntity
  public readonly name: Name
  public readonly email: Email
  public readonly password: Password
  public readonly comicsReactions: any[]
  public readonly charactersReactions: any[]
  public readonly profileImage: string
  public readonly status: StatusUser.CREATED
  public readonly createAt: Date

  private constructor (id: IdEntity, name: Name, email: Email,
    password: Password, status: StatusUser, comicsReactions: any[],
    charactersReactions: any[], profileImage: string, createAt: Date
  ) {
    this.id = id
    this.name = name
    this.email = email
    this.password = password
    this.status = status
    this.comicsReactions = comicsReactions
    this.charactersReactions = charactersReactions
    this.profileImage = profileImage
    this.createAt = createAt
  }

  public static create (data: CreateUserData): Either<InvalidParamError, any> {
    const nameOrError: Either<InvalidParamError, Name> = Name.create(data.name)
    const emailOrError: Either<InvalidParamError, Email> = Email.create(data.email)
    const passwordOrError: Either<InvalidParamError, Password> = Password.create(data.password)

    if (nameOrError.isFailure()) {
      return failure(nameOrError.value)
    }

    if (emailOrError.isFailure()) {
      return failure(emailOrError.value)
    }

    if (passwordOrError.isFailure()) {
      return failure(passwordOrError.value)
    }

    return success(new User(undefined,
      nameOrError.value, emailOrError.value,
      passwordOrError.value, StatusUser.CREATED,
      [], [], undefined, new Date()
    ))
  }
}
