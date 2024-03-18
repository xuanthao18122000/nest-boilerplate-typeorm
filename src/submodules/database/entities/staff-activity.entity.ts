import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IntIdEntity } from './base.entity';
import { StaffDevice } from './staff-device.entity';

@Entity({ name: 'staff_activities' })
export class StaffActivity extends IntIdEntity {
  @Column({ name: 'staff_id' })
  staffId: number;

  @Column({ name: 'login_time', type: 'timestamptz' })
  loginTime: Date;

  @Column({ name: 'logout_time', type: 'timestamptz', nullable: true })
  logoutTime: Date;

  @Column()
  os: string;

  @Column({ name: 'log_out_type', nullable: true })
  logOutType: number;

  @Column({ name: 'log_out_by', nullable: true })
  logOutBy: string;

  @Column({ name: 'device_id', type: 'int', nullable: true })
  deviceId: number;

  @ManyToOne(() => StaffDevice, (device) => device.activities)
  @JoinColumn({ name: 'device_id' })
  device: StaffDevice;

  static LOGOUT_TYPE = {
    STAFF: 1,
    USER: 2,
  };

  constructor(data: Partial<StaffActivity>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }

  serialize() {
    return {
      id: this.id,
      staffId: this.staffId,
      loginTime: this.loginTime,
      os: this.os,
      logoutTime: this.logoutTime,
      deviceId: this.deviceId,
      device: this.device,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
