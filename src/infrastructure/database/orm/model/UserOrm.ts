import { InvalidParamError } from '@/domain/errors'
import { StatusUser } from '@/domain/model/user/StatusUser'
import { User } from '@/domain/model/user/User'
import { CreateUserData, UpdateUserData, ValidateUpdateData } from '@/domain/model/user/UserData'
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

  @Column({ type: 'timestamp', update: false })
  public createAt: Date = new Date()

  protected constructor () { }

  public static instance () {
    return new UserOrm()
  }

  public static create (data: CreateUserData): Either<InvalidParamError, UserOrm> {
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

    return success(UserBuilder.build()
      .email(emailOrError.value.getValue())
      .name(nameOrError.value.getValue())
      .password(passwordOrError.value.getValue())
      .status(StatusUser.CREATED)
      .now())
  }

  public static update (data: UpdateUserData): Either<InvalidParamError, UserOrm> {
    for (const field of Object.keys(data)) {
      const response = ValidateUpdateData[field](data[field])
      if (response.isFailure()) {
        return failure(response.value)
      }
    }

    return success(UserBuilder.build()
      .id(data.id)
      .email(data.email)
      .name(data.name)
      .password(data.password)
      .status(data.status)
      .profileImage(data.profileImage)
      .now())
  }
}

class UserBuilder {
  private user: UserOrm

  private constructor () { }

  static build (): UserBuilder {
    const build = new UserBuilder()
    build.user = UserOrm.instance()
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

  profileImage (profileImage: string): UserBuilder {
    this.user.profileImage = profileImage
    return this
  }

  now (): UserOrm {
    return this.user
  }
}
