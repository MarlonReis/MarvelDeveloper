import {
  Column, Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn
} from 'typeorm'

import { CharacterOrm } from './CharacterOrm'
import { Comic } from '@/domain/model/comic/Comic'

@Entity('comics')
export class ComicOrm implements Comic {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 150 })
  title: string

  @Column('date')
  published: Date

  @Column('varchar')
  writer: string

  @Column('varchar')
  penciler: string

  @Column('varchar')
  coverArtist: string

  @Column('text')
  description: string

  @Column('int')
  edition: number

  @Column('text')
  coverImage: string

  @JoinTable({ name: 'comic_has_many_characters' })
  @ManyToMany(type => CharacterOrm, characters => characters.comics, {
    eager: true
  })
  characters: CharacterOrm[]
}
