import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { IntIdEntity } from './base.entity';
import { KpiVolume } from './kpi-volume.entity';
import { ORP } from './orp.entity';
import { Staff } from './staff.entity';
import { VisitingHistory } from './visiting-history.entity';

@Index('ORP_managements_pkey', ['id'], { unique: true })
@Entity('ORP_managements', { schema: 'public' })
export class ORPManagement extends IntIdEntity {
  @Column('integer', { name: 'status', default: -1 })
  status: number;

  @Column({ name: 'achieved_volume', default: 0 })
  achievedVolume: number;

  @Column({ name: 'target_volume', default: 0 })
  targetVolume: number;

  @Column({ name: 'volume_previous', default: 0 })
  volumePrevious: number;

  @Column({ name: 'select_count', default: 0 })
  selectCount: number;

  @Column('timestamp without time zone', {
    name: 'effective_date',
    nullable: true,
  })
  effectiveDate: Date;

  @Column('boolean', { name: 'in_route_plan', default: false })
  inRoutePlan: boolean;

  @ManyToOne(() => ORP, (orp) => orp.orpManagements, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'orp_id', referencedColumnName: 'id' }])
  orp: ORP;

  @Column({ name: 'orp_id', nullable: true })
  orpId: number;

  @Column({ name: 'creator_id', nullable: true })
  creatorId: number;

  @ManyToOne(() => Staff, (staffs) => staffs.orpManagements, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'staff_id', referencedColumnName: 'id' }])
  staff: Staff;

  @Column({ name: 'staff_id', nullable: true })
  staffId: number;

  @OneToMany(
    () => VisitingHistory,
    (visitingHistory) => visitingHistory.orpManagement,
    {
      onDelete: 'NO ACTION',
    },
  )
  visitingHistories: VisitingHistory[];

  @OneToMany(() => KpiVolume, (kpiVolume) => kpiVolume.orpManagement)
  kpiVolumes: KpiVolume[];

  @OneToMany(() => ORPManagement, (orpManagements) => orpManagements.orp)
  orpManagements: ORPManagement[];

  constructor(partial: Partial<ORPManagement>) {
    super();
    Object.assign(this, partial);
  }
}
