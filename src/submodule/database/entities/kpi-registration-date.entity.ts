import { Column, Entity } from 'typeorm';
import { IntIdEntity } from './base.entity';

@Entity({ name: 'kpi-registration-dates' })
export class KpiRegistrationDate extends IntIdEntity {
  @Column({ name: 'start_day', type: 'int' })
  startDay: Date;

  @Column({ name: 'end_day', type: 'int' })
  endDay: Date;

  constructor(partial: Partial<KpiRegistrationDate>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
