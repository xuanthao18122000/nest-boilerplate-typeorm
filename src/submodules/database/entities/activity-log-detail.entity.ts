import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ActivityLog, User } from '.';
import { BigintIdEntity } from './base.entity';

@Entity('activity_log_details')
export class ActivityLogDetail extends BigintIdEntity {
  @Column({ default: ActivityLogDetail.ACTION.UPDATE })
  action: number;

  @Column({ name: 'activity_log_id', type: 'bigint' })
  activityLogId: number;

  @Column({ nullable: true })
  column: string;

  @Column({ nullable: true, name: 'old_data' })
  oldData: string;

  @Column({ nullable: true, name: 'new_data' })
  newData: string;

  @Column({ name: 'module_id', nullable: true })
  moduleId: number;

  @Column({ name: 'creator_id', type: 'int', nullable: true })
  creatorId: number;

  @ManyToOne(() => User, (creator) => creator.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @ManyToOne(
    () => ActivityLog,
    (activityLog) => activityLog.activityLogDetails,
    { createForeignKeyConstraints: false },
  )
  @JoinColumn({ name: 'activity_log_id' })
  activityLog: ActivityLog;

  static ACTION = {
    CREATE: 1,
    UPDATE: 2,
  };

  static MODULE = {
    STAFF: 1,
    USER: 2,
    AREA: 3,
    VERSION: 4,
    KPI_CONFIGURATION: 5,
    OD: 6,
    RTL: 7,
    ORDER_CUSTOMER: 8,
  };

  constructor(data: Partial<ActivityLogDetail>) {
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
