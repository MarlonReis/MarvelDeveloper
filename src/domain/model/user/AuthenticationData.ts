import { InvalidParamError } from '@/domain/errors'
import { Email, Password } from '@/domain/value-object'
import { Either } from '@/shared/Either'

export interface AuthData {
  email: string
  password: string
}

export interface AuthResponse {
  id: string
  role?: Role
}

export enum Role {
  ADMIN = 'ROLE_ADMIN',
  USER = 'ROLE_USER'
}

export const AuthDataValidation = {
  email (value: string): Either<InvalidParamError, Email> {
    return Email.create(value)
  },
  password (value: string): Either<InvalidParamError, Password> {
    return Password.create(value)
  }
}
