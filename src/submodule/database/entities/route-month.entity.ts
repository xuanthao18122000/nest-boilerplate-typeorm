import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { IApprovalInfo, IRejectInfo } from '../../common/interfaces';
import { IntIdEntity } from './base.entity';
import { RouteRegister } from './route-register.entity';
import { Staff } from './staff.entity';

@Entity({ name: 'route_months' })
export class RouteMonth extends IntIdEntity {
  @Column()
  month: string;

  @Column()
  year: string;

  @Column({ nullable: true })
  note: string;

  @Column({ default: RouteMonth.STATUS.WAITING })
  status: number;

  @Column({ default: RouteMonth.TYPE.CREATE })
  type: number;

  @Column({ name: 'type_month', default: RouteMonth.TYPE_MONTH.CURRENT })
  typeMonth: number;

  @Column({ name: 'reject_info', type: 'jsonb', default: {} })
  rejectInfo: IRejectInfo;

  @Column({ name: 'approval_info', type: 'jsonb', default: {} })
  approvalInfo: IApprovalInfo;

  @Column({ type: 'jsonb', name: 'reason_change', default: {} })
  reason: object;

  @Column({ name: 'staff_id' })
  staffId: number;

  @ManyToOne(() => Staff, (staff) => staff.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'staff_id' })
  staff: Staff;

  @OneToMany(() => RouteRegister, (routeRegisters) => routeRegisters.routeMonth)
  routeRegisters: RouteRegister[];

  static STATUS = {
    CANCEL: -4,
    NOT_YET_REGISTER: -3,
    REJECT: -2,
    WAITING: -1,
    APPROVE: 1,
  };

  static TYPE = {
    CREATE: 1,
    EDIT: 2,
  };

  static TYPE_MONTH = {
    CURRENT: 1,
    NEXT: 2,
  };

  constructor(data?: Partial<RouteRegister>) {
    super();
    if (data) {
      this.id = data.id;
      this.staffId = data.staffId;
      this.status = data.status;
      this.year = data.year;
      this.month = data.month;
      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;
    }
  }
}
