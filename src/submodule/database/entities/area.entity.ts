import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { IntIdEntity } from './base.entity';
import { Location } from './location.entity';
import { ORP } from './orp.entity';
import { PromotionArea } from './promotion-area.entity';
import { ROU } from './rou.entity';
import { Staff } from './staff.entity';
import { User } from './user.entity';

@Entity({ name: 'areas' })
export class Area extends IntIdEntity {
  @Column()
  name: string;

  @Column({ default: Area.STATUS.ACTIVE })
  status: number;

  @Column({ default: Area.TYPE.AREA })
  type: number;

  @Column({ name: 'creator_id', type: 'int', nullable: true })
  creatorId: number;

  @ManyToOne(() => User, (creator) => creator.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @Column({ name: 'province_id', type: 'int', nullable: true })
  provinceId: number;

  @ManyToOne(() => Location, (location) => location.id, {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'province_id' })
  province: Location;

  @OneToMany(() => ORP, (orp) => orp.area, {
    createForeignKeyConstraints: false,
  })
  ORPs: ORP[];

  @OneToMany(() => Staff, (staff) => staff.area, {
    createForeignKeyConstraints: false,
  })
  staffs: Staff[];

  @OneToMany(() => PromotionArea, (promotionArea) => promotionArea.area)
  promotionAreas: PromotionArea[];

  @OneToMany(() => Location, (location) => location.area)
  districts: Location[];

  @Column({ name: 'rou_id', type: 'int', nullable: true })
  rouId: number;

  @ManyToOne(() => ROU, (rou) => rou.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'rou_id' })
  rou: ROU;

  static STATUS = {
    ACTIVE: 1,
    INACTIVE: -1,
  };

  static TYPE = {
    AREA: 1,
    AREA_DISTRICT: 2,
  };

  constructor(partial: Partial<Area>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
