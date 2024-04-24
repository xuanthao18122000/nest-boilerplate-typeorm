import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ActivityLog, HistoryExport, ROU, Role, UserAction } from '.';
import { IntIdEntity } from './base.entity';

@Entity({ name: 'users' })
export class User extends IntIdEntity {
  @Column({ unique: true })
  email: string;

  @Column({ type: 'text', name: 'full_name' })
  fullName: string;

  @Column({ type: 'varchar', name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({ name: 'province_id', type: 'int', nullable: true })
  provinceId: number;

  @Column({ type: 'varchar', name: 'firebase_token', nullable: true })
  firebaseToken: string;

  @Column({ type: 'varchar', name: 'microsoft_id', nullable: true })
  microsoftId: string;

  @Column({ nullable: true })
  token: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', nullable: true })
  avatar: string;

  @Column({ type: 'int', default: User.STATUS.ACTIVE })
  status: number;

  @Column({ type: 'int', default: User.LANGUAGE.VI })
  lang: number;

  @Column({ name: 'role_id', nullable: true })
  roleId: number;

  @ManyToOne(() => Role, (role) => role.users, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ name: 'rou_id', type: 'int', nullable: true })
  rouId: number;

  @Column('int', { name: 'rou_ids', array: true, default: [] })
  rouIds: number[];

  @ManyToOne(() => ROU, (rou) => rou.users, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'rou_id' })
  rou: ROU;

  @Column('int', { name: 'province_ids', array: true, default: [] })
  provinceIds: number[];

  @Column({ name: 'is_all_rous', default: false })
  isAllRous: boolean;

  @Column({ name: 'is_all_provinces', default: false })
  isAllProvinces: boolean;

  @Column('int', { name: 'area_ids', array: true, default: [] })
  areaIds: number[];

  @Column({ name: 'is_all_areas', default: false })
  isAllAreas: boolean;

  @Column('int', { name: 'district_ids', array: true, default: [] })
  districtIds: number[];

  @Column({ name: 'creator_id', type: 'int', nullable: true })
  creatorId: number;

  @ManyToOne(() => User, (creator) => creator.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @OneToMany(() => ActivityLog, (ActivityLog) => ActivityLog.creator)
  activityLogs: ActivityLog[];

  @OneToMany(() => HistoryExport, (historyExport) => historyExport.creator)
  historyExports: HistoryExport[];

  @OneToMany(() => UserAction, (userAction) => userAction.user, {
    createForeignKeyConstraints: false,
  })
  actions: UserAction[];

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

  constructor(data: Partial<User>) {
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
      phoneNumber: this.phoneNumber,
      rou: this.rou,
      rouIds: this.rouIds,
      role: this.role,
      actions: this.actions,
      roleId: this.roleId,
      lang: this.lang,
      avatar: this.avatar,
      address: this.address,
      provinceIds: this.provinceIds,
      isAllRous: this.isAllRous,
      isAllProvinces: this.isAllProvinces,
      isAllAreas: this.isAllAreas,
      areaIds: this.areaIds,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
