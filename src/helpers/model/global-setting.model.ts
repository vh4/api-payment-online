import {
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm'

@Entity('global_tony_coba')
export class GlobalSetting {
  @PrimaryColumn({ length: 80, nullable: false })
  kunci: string

  @Column({ length: 600, nullable: true })
  nilai: string

  @Column({ length: 100, nullable: true })
  keterangan: string
}
