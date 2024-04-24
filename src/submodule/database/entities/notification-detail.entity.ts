import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Notification } from '.';
import { BigintIdEntity } from './base.entity';

@Entity({ name: 'notification_details' })
export class NotificationDetail extends BigintIdEntity {
  @Column({ name: 'notification_id' })
  notificationId: number;

  @Column({ name: 'target_id' })
  targetId: number;

  @Column({
    name: 'target_type',
    default: NotificationDetail.TARGET_TYPE.STAFF,
  })
  targetType: number;

  @Column({ default: false })
  seen: boolean;

  @Column({ name: 'seen_at', type: 'timestamptz', nullable: true })
  seenAt: Date;

  @ManyToOne(
    () => Notification,
    (notification) => notification.notificationDetails,
    { createForeignKeyConstraints: false },
  )
  @JoinColumn({ name: 'notification_id' })
  notification: Notification;

  static TARGET_TYPE = {
    STAFF: 1,
    USER: 1,
  };

  constructor(data: Partial<NotificationDetail>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }

  serialize() {
    return {
      id: this.id,
      notificationId: this.notificationId,
      targetId: this.targetId,
      targetType: this.targetType,
      seen: this.seen,
      seenAt: this.seenAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
