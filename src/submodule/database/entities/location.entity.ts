import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Area } from './area.entity';
import { IntIdEntity } from './base.entity';
import { ORP } from './orp.entity';
import { ROU } from './rou.entity';

@Entity({ name: 'locations' })
export class Location extends IntIdEntity {
  @Column()
  name: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @Column({ nullable: true })
  type: number;

  @Column({ name: 'area_id', type: 'int', nullable: true })
  areaId: number;

  @ManyToOne(() => Area, (area) => area.districts)
  @JoinColumn({ name: 'area_id' })
  area: Area;

  @Column({ name: 'rou_id', type: 'int', nullable: true })
  rouId: number;

  @ManyToOne(() => ROU, (rou) => rou.provinces, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'rou_id' })
  rou: ROU;

  @OneToMany(() => ORP, (orp) => orp.province, {
    createForeignKeyConstraints: false,
  })
  ORPs: ORP[];

  @OneToMany(() => ORP, (orp) => orp.province, {
    createForeignKeyConstraints: false,
  })
  provinceORPs: ORP[];

  @OneToMany(() => ORP, (orp) => orp.district, {
    createForeignKeyConstraints: false,
  })
  districtORPs: ORP[];

  static TYPE = {
    WARD: 1,
    DISTRICT: 2,
    PROVINCE: 3,
    COUNTRY: 4,
  };

  static TYPE_AREA_LOCATION = {
    AREA: 1,
    LOCATION: 2,
  };

  constructor(partial: Partial<Location>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
