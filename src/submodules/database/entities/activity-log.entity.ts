import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ActivityLogDetail } from './activity-log-detail.entity';
import { BigintIdEntity } from './base.entity';
import { User } from './user.entity';

@Entity('activity_logs')
export class ActivityLog extends BigintIdEntity {
  @Column({ nullable: true })
  action: string;

  @Column({ nullable: true })
  method: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  url: string;

  @Column({ name: 'creator_id', type: 'int', nullable: true })
  creatorId: number;

  @Column({ type: 'jsonb', default: {} })
  meta: object;

  @OneToMany(
    () => ActivityLogDetail,
    (activityLogDetail) => activityLogDetail.activityLog,
  )
  activityLogDetails: ActivityLogDetail[];

  @ManyToOne(() => User, (creator) => creator.activityLogs, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  static TYPE_ACTION = {
    CREATE: 1,
    GET: 2,
    UPDATE: 3,
    DELETE: 4,
    CHANGE_STATUS: 5,
    EXPORT: 6,
    AUTHENTICATION: 7,
    OTHER: 8,
  };

  constructor(data: Partial<ActivityLog>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }

  serialize() {
    return {
      id: this.id,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
    };
  }
}
