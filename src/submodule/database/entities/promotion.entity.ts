import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { IApprovalInfo, IRejectInfo } from '../../common/interfaces';
import { IntIdEntity } from './base.entity';
import { PromotionArea } from './promotion-area.entity';
import { PromotionProduct } from './promotion-product.entity';
import { PromotionStaff } from './promotion-staff.entity';
import { ROU } from './rou.entity';
import { User } from './user.entity';

@Entity({ name: 'promotions' })
export class Promotion extends IntIdEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ nullable: true })
  pdf: string;

  @Column({ type: 'decimal', nullable: true })
  cost: number;

  @Column({
    name: 'content_type',
    default: Promotion.CONTENT_TYPE.DOCS,
    nullable: true,
  })
  contentType: number;

  @Column({ default: Promotion.STATUS.WAITING, nullable: true })
  status: number;

  @Column({ default: Promotion.TYPE.GENERAL, nullable: true })
  type: number;

  @Column({ type: 'timestamptz', name: 'start_date', nullable: true })
  startDate: Date;

  @Column({ type: 'timestamptz', name: 'end_date', nullable: true })
  endDate: Date;

  @Column({ name: 'send_type', default: Promotion.SEND_TYPE.ALL })
  sendType: number;

  @Column({ name: 'attached_list', type: 'jsonb', default: [] })
  attachedList: object;

  @Column({ name: 'rou_id', type: 'int', nullable: true })
  rouId: number;

  @ManyToOne(() => ROU, (rou) => rou.promotions, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'rou_id' })
  rou: ROU;

  @Column({ name: 'is_all_rous', default: false })
  isAllRous: boolean;

  @Column('int', { name: 'rou_ids', array: true, default: [] })
  rouIds: number[];

  @Column({ name: 'is_all_provinces', default: false })
  isAllProvinces: boolean;

  @Column({ name: 'is_all_areas', default: false })
  isAllAreas: boolean;

  @Column('int', { name: 'province_ids', array: true, default: [] })
  provinceIds: number[];

  @Column('int', { name: 'area_ids', array: true, default: [] })
  areaIds: number[];

  @Column({ name: 'reject_info', type: 'jsonb', default: {} })
  rejectInfo: IRejectInfo;

  @Column({ name: 'approval_info', type: 'jsonb', default: {} })
  approvalInfo: IApprovalInfo;

  @Column({ name: 'creator_id', type: 'int', nullable: true })
  creatorId: number;

  @ManyToOne(() => User, (creator) => creator.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @OneToMany(() => PromotionArea, (promotionArea) => promotionArea.promotion)
  promotionAreas: PromotionArea[];

  @OneToMany(
    () => PromotionProduct,
    (promotionProduct) => promotionProduct.promotion,
  )
  promotionProducts: PromotionProduct[];

  @OneToMany(() => PromotionStaff, (promotionStaff) => promotionStaff.promotion)
  promotionStaffs: PromotionStaff[];

  static STATUS = {
    ACTIVE: 1,
    APPROVAL: 2,
    INACTIVE: -1,
    WAITING: -2,
    ENDED: -3,
    REJECT: -4,
  };

  static CONTENT_TYPE = {
    PDF: 1,
    DOCS: 2,
  };

  static TYPE = {
    GENERAL: 1,
  };

  static SEND_TYPE = {
    ALL: 1,
    PRIVATE: 2,
  };

  constructor(partial: Partial<Promotion>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
