import { InvalidParamError } from '@/domain/errors'
import { Role } from '@/domain/model/user/AuthenticationData'
import { StatusUser } from '@/domain/model/user/StatusUser'
import { User } from '@/domain/model/user/User'
import { CreateUserData, UpdateUserData, UserBuilder, ValidateUpdateData } from '@/domain/model/user/UserData'
import { Email, Name, Password } from '@/domain/value-object'
import { Either, failure, success } from '@/shared/Either'

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export class UserOrm implements User {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column('text')
  public name: string

  @Column({ type: 'varchar', length: 64 })
  public email: string

  @Column('text')
  public password: string

  // @Column()
  public comicsReactions: any[]

  // @Column()
  public charactersReactions: any[]
  @Column({ type: 'text', nullable: true })
  public profileImage: string

  @Column({
    type: 'enum',
    enum: StatusUser,
    default: StatusUser.CREATED
  })
  public status: StatusUser

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER
  })
  public role: Role

  @Column({ type: 'timestamp', update: false })
  public createAt: Date = new Date()

  protected constructor () { }

  public static create (data: CreateUserData): Either<InvalidParamError, UserOrm> {
    const nameOrError: Either<InvalidParamError, Name> = Name.create('name', data.name)
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

    return success(UserBuilder.build(new UserOrm())
      .email(emailOrError.value.getValue())
      .name(nameOrError.value.getValue())
      .password(passwordOrError.value.getValue())
      .status(StatusUser.CREATED)
      .role(data.role ?? Role.USER)
      .now() as UserOrm)
  }

  public static update (data: UpdateUserData): Either<InvalidParamError, UserOrm> {
    for (const field of Object.keys(data)) {
      const response = ValidateUpdateData[field](data[field])
      if (response.isFailure()) {
        return failure(response.value)
      }
    }

    return success(UserBuilder.build(new UserOrm())
      .id(data.id)
      .email(data.email)
      .name(data.name)
      .password(data.password)
      .status(data.status)
      .role(Role.USER)
      .profileImage(data.profileImage)
      .now() as UserOrm)
  }
}
