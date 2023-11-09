import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { NotificationCard } from './notification-card.entity';

@Entity({ name: 'notification-details' })
export class NotificationDetail extends BaseEntity {
  @Column({ name: 'notification_card_id' })
  notificationCardId: number;

  @Column({ name: 'target_id' })
  targetId: number;

  @Column({ name: 'target_type', default: 1 })
  targetType: number;

  @Column({ default: false })
  seen: boolean;

  @Column({ name: 'seen_at', type: 'timestamp', nullable: true })
  seenAt: Date;

  @ManyToOne(
    () => NotificationCard,
    (notificationCard) => notificationCard.notificationDetails,
  )
  @JoinColumn({ name: 'notification_card_id' })
  notificationCard: NotificationCard;

  constructor(data: Partial<NotificationDetail>) {
    super();
    if (data) {
      this.id = data.id || null;
      this.notificationCardId = data.notificationCardId;
      this.targetId = data.targetId;
      this.targetType = data.targetType;
      this.seen = data.seen;
      this.seenAt = data.seenAt;
    }
  }

  serialize() {
    return {
      id: this.id,
      notificationCardId: this.notificationCardId,
      targetId: this.targetId,
      targetType: this.targetType,
      seen: this.seen,
      seenAt: this.seenAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
