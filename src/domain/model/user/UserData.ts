import { InvalidParamError } from '@/domain/errors'
import { Email, IdEntity, Name, Password } from '@/domain/value-object'
import { Either, success } from '@/shared/Either'
import { StatusUser } from './StatusUser'

export interface CreateUserData {
  name: string
  email: string
  password: string
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
  profileImage?: string
}

export interface AuthResponse {
  id: string
  email: string
  status: StatusUser
}

export enum Role {
  ADMIN,
  USER
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
  }
}
