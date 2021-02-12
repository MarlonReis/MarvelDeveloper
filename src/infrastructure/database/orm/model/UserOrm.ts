import { InvalidParamError } from '@/domain/errors'
import { StatusUser } from '@/domain/model/user/StatusUser'
import { User } from '@/domain/model/user/User'
import { CreateUserData } from '@/domain/model/user/UserData'
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
      .email(data.email)
      .name(data.name)
      .email(data.email)
      .password(data.password)
      .status(StatusUser.CREATED)
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

  now (): UserOrm {
    return this.user
  }
}