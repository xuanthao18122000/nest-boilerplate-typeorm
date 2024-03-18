import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { NotificationDetail, User } from '.';
import { IAttachmentsNotify, IRejectInfo } from '../../common/interfaces';
import { BigintIdEntity } from './base.entity';

@Entity({ name: 'notifications' })
export class Notification extends BigintIdEntity {
  @Column()
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({
    type: 'timestamptz',
    name: 'start_time',
    nullable: true,
  })
  startTime: Date;

  @Column({
    type: 'timestamptz',
    name: 'end_time',
    nullable: true,
  })
  endTime: Date;

  @Column({ name: 'type_schedule', nullable: true })
  typeSchedule: number;

  @Column({ name: 'send_mode', nullable: true })
  sendMode: number;

  @Column({ name: 'repeat_after_hour', default: 1 })
  repeatAfterHour: number;

  @Column('int', { name: 'repeat_weekdays', array: true, default: [] })
  repeatWeekdays: number[];

  @Column({
    type: 'timestamptz',
    name: 'sending_schedule',
    nullable: true,
  })
  sendingSchedule: Date;

  @Column({
    type: 'time',
    name: 'sending_time_weekdays',
    nullable: true,
  })
  sendingTimeWeekdays: Date;

  @Column({ name: 'type_receiver', default: Notification.TYPE_RECEIVER.ALL })
  typeReceiver: number;

  @Column({ default: Notification.CATEGORY.GENERAL })
  category: number;

  @Column({ default: 0 })
  readersNumber: number;

  @Column({ default: 0 })
  receiversNumber: number;

  @Column({ type: 'jsonb', name: 'reject_info', default: {} })
  rejectInfo: IRejectInfo;

  @Column({ default: Notification.STATUS.DRAFT })
  status: number;

  @Column({ name: 'is_auto_notification', default: false })
  isAutoNotification: boolean;

  @Column('int', { array: true, default: [] })
  provinceIds: number[];

  @Column('int', { array: true, default: [] })
  receivers: number[];

  @Column({ type: 'json', default: [] })
  attachments: IAttachmentsNotify[];

  @Column({ type: 'jsonb', default: {} })
  meta: object;

  @Column({
    type: 'timestamptz',
    name: 'approved_date',
    nullable: true,
  })
  approvedDate: Date;

  @Column({ name: 'approved_by_id', type: 'int', nullable: true })
  approvedById: number;

  @ManyToOne(() => User, (approvedBy) => approvedBy.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'approved_by_id' })
  approvedBy: User;

  @Column({ name: 'creator_id', type: 'int', nullable: true })
  creatorId: number;

  @ManyToOne(() => User, (creator) => creator.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @OneToMany(
    () => NotificationDetail,
    (notificationDetail) => notificationDetail.notification,
  )
  notificationDetails: NotificationDetail[];

  static TYPE_SCHEDULE = {
    /** Gửi ngay lập tức */
    NOW: 1,
    /** Gửi theo một thời gian */
    SPECIFY_TIME: 2,
  };

  static SEND_MODE = {
    /** Một lần */
    ONE_TIME: 1,
    /** Lặp lại sau (repeatHour) lần */
    REPEAT_BY_HOUR: 2,
    /** Lặp lại vào ngày trong tuần */
    REPEAT_BY_WEEK: 3,
  };

  /**
   * Đối tượng nhận
   * @enum {number}
   */
  static TYPE_RECEIVER = {
    /** Tất cả người dùng */
    ALL: 1,
    /** Riêng tư (Một danh sách người dùng) */
    PRIVATE: 2,
  };

  /**
   * Loại thông báo
   * @enum {number}
   */
  static CATEGORY = {
    /** Thông báo chung */
    GENERAL: 1,
  };

  /**
   * Trạng thái thông báo
   * @enum {number}
   */
  static STATUS = {
    /** Đã hủy */
    CANCEL: -2,
    /** Từ chối */
    REJECT: -1,
    /** Mới tạo */
    DRAFT: 1,
    /** Chờ duyệt */
    PENDING: 2,
    /** Đã duyệt */
    ACCEPT: 3,
    /** Đang gửi */
    SENDING: 4,
    /** Hoàn thành */
    DONE: 5,
  };

  /**
   * Lặp lại vào các ngày trong tuần
   * @enum {number}
   */
  static WEEKDAYS = {
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    SUNDAY: 7,
  };

  /**
   * Loại đính kèm
   * @enum {number}
   */
  static TYPE_ATTACHMENT = {
    IMAGE: 1,
    VIDEO: 2,
    PDF: 3,
    WEBSITE: 4,
  };

  constructor(data: Partial<Notification>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }
}
