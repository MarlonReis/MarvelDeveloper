import { InvalidParamError } from '@/domain/errors'
import { Email, IdEntity, Name, Password } from '@/domain/value-object'
import { Either, success } from '@/shared/Either'
import { Role } from './AuthenticationData'
import { StatusUser } from './StatusUser'
import { User } from './User'

export interface CreateUserData {
  name: string
  email: string
  password: string
  role?: Role
}

export interface UpdateUserData {
  id: string
  name?: string
  email?: string
  status?: StatusUser
  password?: string
  profileImage?: string
}

export interface UserAccountResponse {
  id?: string
  name: string
  email: string
  status: StatusUser
  role: Role
  password?: string
  profileImage?: string
}

export const ValidateUpdateData = {
  id (value: string): Either<InvalidParamError, IdEntity> {
    return IdEntity.create(value)
  },
  name (value: string): Either<InvalidParamError, Name> {
    return Name.create('name', value)
  },
  email (value: string): Either<InvalidParamError, Email> {
    return Email.create(value)
  },
  status (value: number): Either<InvalidParamError, StatusUser> {
    return success(value)
  },
  password (value: string): Either<InvalidParamError, Password> {
    return Password.create(value)
  },
  profileImage (value: string): Either<InvalidParamError, string> {
    return success(value)
  },
  role (value: Role): Either<InvalidParamError, Role> {
    return success(value)
  }
}

export class UserBuilder {
  private user: User

  private constructor () { }

  static build (user: User): UserBuilder {
    const build = new UserBuilder()
    build.user = user
    return build
  }

  id (id: string): UserBuilder {
    this.user.id = id
    return this
  }

  name (name: string): UserBuilder {
    this.user.name = name
    return this
  }

  email (email: string): UserBuilder {
    this.user.email = email
    return this
  }

  password (password: string): UserBuilder {
    this.user.password = password
    return this
  }

  status (status: StatusUser): UserBuilder {
    this.user.status = status
    return this
  }

  role (role: Role): UserBuilder {
    this.user.role = role
    return this
  }

  profileImage (profileImage: string): UserBuilder {
    this.user.profileImage = profileImage
    return this
  }

  now (): User {
    return this.user
  }
}
