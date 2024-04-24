import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { IntIdEntity } from './base.entity';
import { Survey } from './survey.entity';
import { Ticket } from './ticket.entity';
import { User } from './user.entity';

@Entity({ name: 'tasks' })
export class Task extends IntIdEntity {
  @Column('text', { nullable: true })
  name: string;

  @Column({ default: Task.CATEGORY.TEXT, nullable: true })
  category: number;

  @Column({ type: 'timestamptz', name: 'start_date', nullable: true })
  startDate: Date;

  @Column({ type: 'timestamptz', name: 'end_date', nullable: true })
  endDate: Date;

  @Column({ default: Task.STATUS.WAITING })
  status: number;

  @Column({
    name: 'customer_type',
    default: Task.CUSTOMER_TYPE.BOTH,
  })
  customerType: number;

  @Column({ name: 'is_required', default: false })
  isRequired: boolean;

  @Column({ name: 'is_all_provinces', default: false })
  isAllProvinces: boolean;

  @Column('int', { name: 'province_ids', array: true, default: [] })
  provinceIds: number[];

  @Column({ name: 'is_all_rous', default: false })
  isAllRous: boolean;

  @Column('int', { name: 'rou_ids', array: true, default: [] })
  rouIds: number[];

  @Column({ name: 'is_all_areas', default: false })
  isAllAreas: boolean;

  @Column('int', { name: 'area_ids', array: true, default: [] })
  areaIds: number[];

  @Column({ name: 'creator_id', type: 'int', nullable: true })
  creatorId: number;

  @ManyToOne(() => User, (creator) => creator.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @OneToMany(() => Ticket, (ticket) => ticket.task)
  tickets: Ticket[];

  @Column({ name: 'survey_id', type: 'int', nullable: true })
  surveyId: number;

  @OneToOne(() => Survey, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'survey_id' })
  survey: Survey;

  static STATUS = {
    /** Đang hoạt động */
    ACTIVE: 1,
    /** Ngừng hoạt động */
    INACTIVE: -1,
    /** Chờ hoạt động */
    WAITING: -2,
  };

  static CUSTOMER_TYPE = {
    OD: 1,
    RETAIL: 2,
    BOTH: 3,
  };

  static CATEGORY = {
    PRICE_REPORT: 1,
    SURVEY: 2,
    TEXT: 3,
  };

  constructor(partial: Partial<Task>) {
    super();
    Object.assign(this, partial);
  }
}
