import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { NotificationDetail } from './notification-detail.entity';

@Entity({ name: 'notification-cards' })
export class NotificationCard extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ name: 'short_body' })
  shortBody: string;

  @Column({
    type: 'timestamp',
    name: 'sending_schedule',
    default: () => 'CURRENT_TIMESTAMP',
  })
  sendingSchedule: Date;

  @Column()
  creator: number;

  @Column({ name: 'type_schedule', default: 1 })
  typeSchedule: number;

  @Column({ name: 'type_receiver', default: 1 })
  typeReceiver: number;

  @Column()
  category: number;

  @Column({ default: 1 })
  status: number;

  @Column({ name: 'is_auto_notification', default: false })
  isAutoNotification: boolean;

  @Column({ name: 'type_reference', default: 1 })
  typeReference: number;

  @Column({ name: 'linked_object' })
  linkedObject: number;

  @Column('int', { array: true, default: [] })
  receivers: number[];

  @Column({ type: 'jsonb', default: {} })
  meta: object;

  @OneToMany(
    () => NotificationDetail,
    (notificationDetail) => notificationDetail.notificationCard,
  )
  notificationDetails: NotificationDetail[];

  constructor(data: Partial<NotificationCard>) {
    super();
    if (data) {
      this.id = data.id || null;
      this.title = data.title;
      this.body = data.body;
      this.shortBody = data.shortBody;
      this.sendingSchedule = data.sendingSchedule;
      this.creator = data.creator;
      this.typeSchedule = data.typeSchedule;
      this.typeReceiver = data.typeReceiver;
      this.category = data.category;
      this.status = data.status;
      this.isAutoNotification = data.isAutoNotification;
      this.typeReference = data.typeReference;
      this.linkedObject = data.linkedObject;
      this.receivers = data.receivers;
      this.meta = data.meta;
    }
  }

  serialize() {
    return {
      id: this.id,
      title: this.title,
      body: this.body,
      shortBody: this.shortBody,
      sendingSchedule: this.sendingSchedule,
      creator: this.creator,
      typeSchedule: this.typeSchedule,
      typeReceiver: this.typeReceiver,
      category: this.category,
      status: this.status,
      isAutoNotification: this.isAutoNotification,
      typeReference: this.typeReference,
      linkedObject: this.linkedObject,
      receivers: this.receivers,
      meta: this.meta,
    };
  }
}
