import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IntIdEntity } from './base.entity';
import { RouteMonth } from './route-month.entity';
import { Staff } from './staff.entity';

@Entity({ name: 'route_registers' })
export class RouteRegister extends IntIdEntity {
  @Column({ name: 'staff_id' })
  staffId: number;

  @ManyToOne(() => Staff, (staff) => staff.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'staff_id' })
  staff: Staff;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'jsonb', name: 'route_ids', default: [] })
  routeIds: number[];

  @Column({ name: 'total_route', nullable: true })
  totalRoute: number;

  @Column({ type: 'int', default: RouteRegister.STATUS.WAITING })
  status: number;

  @Column({ default: RouteRegister.TYPE.REGISTER })
  type: number;

  @Column({ name: 'type_month', default: RouteRegister.TYPE_MONTH.CURRENT })
  typeMonth: number;

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

  @Column({ name: 'route_month_id', nullable: true })
  routeMonthId: number;

  @Column({ type: 'jsonb', name: 'previous_route_ids', default: [] })
  previousRouteIds: number[];

  @ManyToOne(() => RouteMonth, (routeMonth) => routeMonth.routeRegisters, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'route_month_id', referencedColumnName: 'id' }])
  routeMonth: RouteMonth;

  static END_DATE_REGISTER = 30;

  static STATUS = {
    REJECT: -2,
    WAITING: -1,
    APPROVE: 1,
  };

  static TYPE = {
    REGISTER: 1,
    EDIT: 2,
  };

  static TYPE_MONTH = {
    CURRENT: 1,
    NEXT: 2,
  };

  static ACTION = {
    ADD: 1,
    NONE: 2,
    REMOVE: 3,
  };

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
