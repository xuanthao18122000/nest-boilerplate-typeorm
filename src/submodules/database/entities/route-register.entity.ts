import { Column, Entity } from 'typeorm';
import { ROUTE_CONSTANT } from '../../common/constants/route.constant';
import { IntIdEntity } from './base.entity';

@Entity({ name: 'route_registers' })
export class RouteRegister extends IntIdEntity {
  @Column({ name: 'staff_id' })
  staffId: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'jsonb', name: 'route_ids', default: [] })
  routeIds: number[];

  @Column({ name: 'total_route', nullable: true })
  totalRoute: number;

  @Column({ type: 'int', default: ROUTE_CONSTANT.STATUS.WAITING })
  status: number;

  @Column({ nullable: true })
  note: string;

  @Column({ nullable: true })
  year: string;

  @Column({ type: 'varchar', nullable: true })
  month: string;

  @Column({ type: 'jsonb', name: 'reason_change', default: {} })
  reason: object;

  @Column({ name: 'orp_management_id', nullable: true })
  orpManagementId: number;

  constructor(data?: Partial<RouteRegister>) {
    super();
    if (data) {
      this.id = data.id;
      this.staffId = data.staffId;
      this.date = data.date;
      this.routeIds = data.routeIds;
      this.status = data.status;
      this.note = data.note;
      this.year = data.year;
      this.month = data.month;
      this.reason = data.reason;
      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;
    }
  }
}
