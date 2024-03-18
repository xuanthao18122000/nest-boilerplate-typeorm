import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { IRejectInfo } from '../../common/interfaces';
import { IContactOD } from '../../common/interfaces/official-distributor.interface';
import { Area } from './area.entity';
import { IntIdEntity } from './base.entity';
import { Location } from './location.entity';
import { ORPManagement } from './orp-management.entity';
import { ROU } from './rou.entity';
import { Staff } from './staff.entity';
import { User } from './user.entity';
import { VisitingHistory } from './visiting-history.entity';

@Entity('ORPs')
export class ORP extends IntIdEntity {
  @Column({ name: 'id_fico', nullable: true })
  idFico: number;

  @Index({ fulltext: true })
  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Index({ fulltext: true })
  @Column({ name: 'long_name', nullable: true })
  longName: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @Column({ type: 'jsonb', default: [] })
  images: Array<string>;

  @Column({ type: 'decimal', nullable: true })
  lat: number;

  @Column({ type: 'decimal', nullable: true })
  lng: number;

  @Column({ type: 'int', nullable: true })
  volume: number;

  @Column({ name: 'street_number', nullable: true })
  streetNumber: string;

  @Column({ name: 'contact_key', type: 'varchar', nullable: true })
  contactKey: string;

  @Column({ name: 'contact_information', type: 'jsonb', default: [] })
  contactInformation: IContactOD[];

  @Column({ name: 'phone_number', type: 'varchar', nullable: true })
  phoneNumber: string;

  @Column({ type: 'int', default: ORP.SIZE.SMALL })
  size: number;

  @Column({ type: 'varchar', nullable: true })
  presenter: string;

  @Column({ type: 'int', default: ORP.STATUS.ACTIVE })
  status: number;

  @Column({
    type: 'int',
    default: ORP.TYPE.POTENTIAL_CUSTOMER,
  })
  type: number;

  @Column({
    type: 'int',
    default: ORP.PRIORITY.NORMAL,
  })
  priority: number;

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

  @Index({ fulltext: true })
  @Column({ type: 'varchar', nullable: true })
  address: string;

  @Column({ type: 'jsonb', name: 'reject_info', default: {} })
  rejectInfo: IRejectInfo;

  @Column({ name: 'working_unit', type: 'varchar', nullable: true })
  workingUnit: string;

  @Column({ name: 'creator_id', type: 'int', nullable: true })
  creatorId: number;

  @ManyToOne(() => User, (creator) => creator.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @Column({ name: 'manager_id', type: 'int', nullable: true })
  managerId: number;

  @Column({ name: 'od_id', type: 'int', nullable: true })
  odId: number;

  @Column({ name: 'area_id', type: 'int', nullable: true })
  areaId: number;

  @ManyToOne(() => Area, (are) => are.ORPs, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'area_id' })
  area: Area;

  @Column({ name: 'rou_id', type: 'int', nullable: true })
  rouId: number;

  @ManyToOne(() => ROU, (rou) => rou.ORPs, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'rou_id' })
  rou: ROU;

  @Column({ name: 'category', type: 'int', nullable: true })
  category: number;

  @Column({ name: 'od_type', type: 'int', nullable: true })
  odType: number;

  @ManyToOne(() => Staff, (staff) => staff.ORPs, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'manager_id' })
  manager: Staff;

  @OneToMany(() => VisitingHistory, (VisitingHistory) => VisitingHistory.orp)
  visitingHistories: VisitingHistory[];

  @OneToMany(() => ORPManagement, (orpManagements) => orpManagements.orp)
  orpManagements: ORPManagement[];

  // ALL
  static TYPE = {
    /** Nhà phân phối */
    OFFICIAL_DISTRIBUTOR: 1,
    /** Cửa hàng bán lẻ */
    RETAILER: 2,
    /** Khách hàng tiềm năng */
    POTENTIAL_CUSTOMER: 3,
    /** Khách hàng khác */
    OTHER_CUSTOMER: 4,
  };

  // OD, RTL, OTHER CUSTOMER
  static STATUS = {
    /** Đang hoạt động */
    ACTIVE: 1,
    /** Ngừng hoạt động */
    INACTIVE: -1,
    /** Chờ xác nhận */
    WAITING: -2,
  };

  // OTHER CUSTOMER
  static PRIORITY = {
    /** Cao */
    HIGH: 1,
    /** Bình thường */
    NORMAL: 2,
    /** Thấp */
    LOW: 3,
  };

  // OD
  static OD_TYPE = {
    /** Nhà phân phối của Fico */
    FICO_YTL: 1,
    /** Nhà phân phối của của đối thủ */
    COMPETITORS: 2,
  };

  // POTENTIAL
  static STATUS_PC = {
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

  constructor(data: Partial<ORP>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }
}
