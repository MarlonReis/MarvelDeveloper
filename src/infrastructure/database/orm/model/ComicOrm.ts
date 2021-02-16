import { Character } from '@/domain/model/character/Character'
import { Comic } from '@/domain/model/comic/Comic'
import {
  Column, Entity, JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { CharacterOrm } from './CharacterOrm'

@Entity('comics')
export class ComicOrm implements Comic {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 150 })
  title: string

  @Column({ type: 'date', default: new Date() })
  published: Date

  @Column('varchar2')
  writer: string

  @Column('varchar2')
  penciler: string

  @Column('varchar2')
  coverArtist: string

  @Column('text')
  description: string

  @Column('int')
  edition: number

  @Column('text')
  coverImage: string

  @JoinTable()
  @ManyToMany(() => CharacterOrm)
  characters: Character[]
}
