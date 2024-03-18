import { Column, Entity, OneToMany } from 'typeorm';
import { IntIdEntity } from './base.entity';
import { StaffActivity } from './staff-activity.entity';

@Entity({ name: 'staff_devices' })
export class StaffDevice extends IntIdEntity {
  @Column({ name: 'staff_id', nullable: false })
  staffId: number;

  @Column({ type: 'varchar', name: 'device_id' })
  deviceId: string;

  @Column({ type: 'varchar' })
  os: string;

  @Column({ type: 'varchar', name: 'os_version', nullable: true })
  osVersion: string;

  @Column({ type: 'varchar', name: 'app_version', nullable: true })
  appVersion?: string;

  @OneToMany(() => StaffActivity, (activity) => activity.device)
  activities: StaffActivity[];

  constructor(data: Partial<StaffDevice>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }

  serialize() {
    return {
      id: this.id,
      staffId: this.staffId,
      deviceId: this.deviceId,
      os: this.os,
      osVersion: this.osVersion,
      appVersion: this.appVersion,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
