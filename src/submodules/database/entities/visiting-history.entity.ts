import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BigintIdEntity } from './base.entity';
import { ORPManagement } from './orp-management.entity';
import { ORP } from './orp.entity';
import { Staff } from './staff.entity';
import { Ticket } from './ticket.entity';

@Entity({ name: 'visiting_histories' })
export class VisitingHistory extends BigintIdEntity {
  @Column({ nullable: true, name: 'check_in_time' })
  checkInTime: Date;

  @Column({ nullable: true, name: 'check_out_time' })
  checkOutTime: Date;

  @Column({ type: 'decimal', nullable: true, name: 'total_time', default: 0 })
  totalTime: number;

  @Column({ type: 'boolean', nullable: true, name: 'in_radius_check_in' })
  inRadiusCheckIn: boolean;

  @Column({ type: 'boolean', nullable: true, name: 'in_radius_check_out' })
  inRadiusCheckout: boolean;

  @Column({ name: 'is_checked_in', default: false })
  isCheckedIn: boolean;

  @Column({ name: 'is_checked_out', default: false })
  isCheckedOut: boolean;

  @Column({ type: 'decimal', nullable: true, name: 'distance_check_in' })
  distanceCheckIn: number;

  @Column({ type: 'decimal', nullable: true, name: 'distance_check_out' })
  distanceCheckOut: number;

  @Column({ name: 'lat_check_in', type: 'decimal', nullable: true })
  latCheckIn: number;

  @Column({ name: 'lng_check_in', type: 'decimal', nullable: true })
  lngCheckIn: number;

  @Column({ name: 'lat_check_out', type: 'decimal', nullable: true })
  latCheckOut: number;

  @Column({ name: 'lng_check_out', type: 'decimal', nullable: true })
  lngCheckOut: number;

  @Column({ name: 'reason_cancel', nullable: true })
  reasonCancel: string;

  @Column({ default: VisitingHistory.STATUS.NOT_STARTED })
  status: number;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true })
  result: string;

  @Column({ type: 'jsonb', default: [] })
  image: object;

  @Column({ name: 'is_not_checked_out', default: false })
  isNotCheckedOut: boolean;

  @Column({ name: 'orp_id', nullable: true })
  orpId: number;

  @ManyToOne(() => Staff, (staff) => staff.visitingHistories, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'staff_id' })
  staff: Staff;

  @Column({ name: 'staff_id' })
  staffId: number;

  @ManyToOne(() => ORP, (orp) => orp.visitingHistories, {
    onDelete: 'NO ACTION',
  })
  @JoinColumn([{ name: 'orp_id', referencedColumnName: 'id' }])
  orp: ORP;

  @OneToMany(() => Ticket, (tickets) => tickets.visitingHistory, {
    onDelete: 'CASCADE',
  })
  tickets: Ticket[];

  @ManyToOne(
    () => ORPManagement,
    (orpManagements) => orpManagements.visitingHistories,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'orp_management_id', referencedColumnName: 'id' }])
  orpManagement: ORPManagement;

  static STATUS = {
    NOT_STARTED: 1,
    PROCESSING: 2,
    COMPLETED: 3,
    REJECTED: -1,
  };

  static CHECK_IN = {
    NOT_CHECK_IN: 1,
    ALREADY_CHECK_IN: 2,
  };

  static END_DATE_KPI = 29;

  constructor(partial: Partial<VisitingHistory>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
  }

  serialize() {
    return {
      id: this.id,
      status: this.status,
      latCheckIn: this.latCheckIn,
      latCheckOut: this.latCheckOut,
      lngCheckIn: this.lngCheckIn,
      lngCheckOut: this.lngCheckOut,
      distanceCheckIn: this.distanceCheckIn,
      checkInTime: this.checkInTime,
      checkOutTime: this.checkOutTime,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
