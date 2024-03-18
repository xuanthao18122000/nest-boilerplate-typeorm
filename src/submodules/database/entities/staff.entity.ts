import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import {
  Area,
  ORP,
  ORPManagement,
  Position,
  PromotionStaff,
  ROU,
  User,
  VisitingHistory,
} from '.';
import { IMetaStaff } from '../../common/interfaces';
import { IntIdEntity } from './base.entity';

@Entity({ name: 'staffs' })
export class Staff extends IntIdEntity {
  @Column({ name: 'ase_id', nullable: true })
  aseId: number;

  @Column({ nullable: true })
  email: string;

  @Column('character varying', { name: 'code', nullable: true })
  code: string;

  @Column({ type: 'text', name: 'full_name' })
  fullName: string;

  @Column({ type: 'varchar', name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  token: string;

  @Column({ name: 'firebase_token', nullable: true })
  firebaseToken: string;

  @Column({ type: 'varchar', nullable: true })
  avatar: string;

  @Column('numeric', { name: 'lat', nullable: true, precision: 65, scale: 30 })
  lat: string;

  @Column('numeric', { name: 'lng', nullable: true, precision: 65, scale: 30 })
  lng: string;

  @Column({ type: 'jsonb', default: {} })
  meta: IMetaStaff;

  @Column({ type: 'int', default: Staff.STATUS.ACTIVE })
  status: number;

  @Column({ type: 'int', default: Staff.LANGUAGE.VI })
  lang: number;

  @Column('timestamp with time zone', {
    name: 'change_status_at',
    nullable: true,
  })
  changeStatusAt: Date;

  @Column({ type: 'varchar', nullable: true })
  address: string;

  @Column({ name: 'area_id', type: 'int', nullable: true })
  areaId: number;

  @Column({ name: 'volume_archived', type: 'int', nullable: true })
  volumeArchived: number;

  @ManyToOne(() => Area, (are) => are.ORPs, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'area_id' })
  area: Area;

  @Column({ name: 'rou_id', type: 'int', nullable: true })
  rouId: number;

  @ManyToOne(() => ROU, (rou) => rou.id, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'rou_id' })
  rou: ROU;

  @Column({ name: 'sale_head_id', nullable: true })
  salesHeadId?: number;

  @ManyToOne(() => Staff, (staff) => staff.sales, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'sale_head_id' })
  salesHead: Staff;

  @OneToMany(() => Staff, (staff) => staff.salesHead, {
    createForeignKeyConstraints: false,
  })
  sales: Staff[];

  @Column({ name: 'position_id', type: 'int', nullable: true })
  positionId: number;

  @Column('int', { array: true, default: [] })
  provinceIds: number[];

  @Column('int', { array: true, default: [] })
  areaIds: number[];

  @Column('int', { array: true, default: [] })
  districtIds: number[];

  @ManyToOne(() => Position, (position) => position.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'position_id' })
  position: Position;

  @Column({ name: 'creator_id', type: 'int', nullable: true })
  creatorId: number;

  @ManyToOne(() => User, (creator) => creator.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @OneToMany(() => ORP, (orp) => orp.manager, {
    createForeignKeyConstraints: false,
  })
  ORPs: ORP[];

  @OneToMany(() => VisitingHistory, (orp) => orp.staff, {
    createForeignKeyConstraints: false,
  })
  visitingHistories: VisitingHistory[];

  @OneToMany(() => ORPManagement, (orpManagements) => orpManagements.orp)
  orpManagements: ORPManagement[];

  @OneToMany(() => PromotionStaff, (promotionStaff) => promotionStaff.staff)
  promotionStaffs: PromotionStaff[];

  static STATUS = {
    /** Đang hoạt động */
    ACTIVE: 1,
    /** Ngừng hoạt động */
    INACTIVE: -1,
    /** Khóa */
    LOCKED: -2,
  };

  static LANGUAGE = {
    /** Tiếng Việt */
    VI: 1,
    /** Tiếng Anh */
    EN: 2,
  };

  constructor(data: Partial<Staff>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }

  serialize() {
    return {
      id: this.id,
      email: this.email,
      fullName: this.fullName,
      positionId: this.positionId,
      areaId: this.areaId,
      rouId: this.rouId,
      provinceIds: this.provinceIds,
      creatorId: this.creatorId,
      salesHeadId: this.salesHeadId,
      phoneNumber: this.phoneNumber,
      volumeArchived: this.volumeArchived,
      aseId: this.aseId,
      address: this.address,
      status: this.status,
      avatar: this.avatar,
      meta: this.meta,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
