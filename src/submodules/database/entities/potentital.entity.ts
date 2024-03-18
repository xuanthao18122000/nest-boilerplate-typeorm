import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { IRejectInfo } from '../../common/interfaces';
import { Area } from './area.entity';
import { IntIdEntity } from './base.entity';
import { Location } from './location.entity';
import { ORPManagement } from './orp-management.entity';
import { ROU } from './rou.entity';
import { Staff } from './staff.entity';

@Entity('potentials')
export class Potential extends IntIdEntity {
  @Column({ name: 'short_name', type: 'varchar', nullable: true })
  shortName: string;

  @Column({ name: 'long_name', type: 'varchar', nullable: true })
  longName: string;

  @Column({ type: 'jsonb', default: [] })
  images: Array<string>;

  @Column({ type: 'decimal', nullable: true })
  lat: number;

  @Column({ type: 'decimal', nullable: true })
  lng: number;

  @Column({ type: 'int', nullable: true })
  volume: number;

  @Column({ name: 'contact_key', type: 'varchar', nullable: true })
  contactKey: string;

  @Column({ name: 'phone_number', type: 'varchar', nullable: true })
  phoneNumber: string;

  @Column({ type: 'int', default: Potential.SIZE.SMALL })
  size: number;

  @Column({ type: 'int', default: Potential.STATUS.WAITING })
  status: number;

  @Column({ name: 'province_id', type: 'int', nullable: true })
  provinceId: number;

  @ManyToOne(() => Location, (location) => location.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'province_id' })
  province: Location;

  @Column({ name: 'district_id', type: 'int', nullable: true })
  districtId: number;

  @ManyToOne(() => Location, (location) => location.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'district_id' })
  district: Location;

  @Column({ name: 'ward_id', type: 'int', nullable: true })
  wardId: number;

  @ManyToOne(() => Location, (location) => location.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'ward_id' })
  ward: Location;

  @Column({ type: 'varchar', nullable: true })
  address: string;

  @Column({ type: 'jsonb', name: 'reject_info', default: {} })
  rejectInfo: IRejectInfo;

  @Column({ name: 'creator_id', type: 'int', nullable: true })
  creatorId: number;

  @ManyToOne(() => Staff, (creator) => creator.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'creator_id' })
  creator: Staff;

  @Column({ name: 'od_id', type: 'int', nullable: true })
  odId: number;

  @Column({ name: 'area_id', type: 'int', nullable: true })
  areaId: number;

  @ManyToOne(() => Area, (are) => are.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'area_id' })
  area: Area;

  @Column({ name: 'rou_id', type: 'int', nullable: true })
  rouId: number;

  @ManyToOne(() => ROU, (rou) => rou.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'rou_id' })
  rou: ROU;

  @Column({ name: 'category', type: 'int', nullable: true })
  category: number;

  @OneToMany(() => ORPManagement, (orpManagements) => orpManagements.orp)
  orpManagements: ORPManagement[];

  static STATUS = {
    /** Xác nhận */
    CONFIRM: 1,
    /** Từ chối */
    REJECT: -1,
    /** Chờ xác nhận */
    WAITING: -2,
  };

  static SIZE = {
    /** Lớn */
    LARGE: 1,
    /** Trung bình */
    MEDIUM: 2,
    /** Nhỏ */
    SMALL: 3,
  };

  static CATEGORY_POTENTIAL = {
    /** Nhà phân phối */
    OFFICIAL_DISTRIBUTOR: 1,
    /** Cửa hàng bán lẻ */
    RETAILER: 2,
  };

  constructor(data: Partial<Potential>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }
}
