import { Column, Entity } from 'typeorm';
import { IntIdEntity } from './base.entity';

@Entity({ name: 'configure_trackings' })
export class ConfigureTracking extends IntIdEntity {
  @Column({ default: false })
  regular: boolean;

  @Column({ name: 'time_normal', nullable: true })
  timeNormal: number;

  @Column({ name: 'time_check_in', nullable: true })
  timeCheckIn: number;

  @Column({ default: false })
  warning: boolean;

  @Column({ name: 'allowed_radius', nullable: true })
  allowedRadius: number;

  constructor(data: Partial<ConfigureTracking>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }
}
