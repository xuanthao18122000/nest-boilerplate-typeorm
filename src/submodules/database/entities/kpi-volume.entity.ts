import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IntIdEntity } from './base.entity';
import { ORPManagement } from './orp-management.entity';
import { User } from './user.entity';

@Entity('kpi_volume')
export class KpiVolume extends IntIdEntity {
  @Column({ type: 'int' })
  month: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ name: 'current_volume', default: 0 })
  currentVolume: number;

  @Column({ name: 'target_volume', default: 0 })
  targetVolume: number;

  @Column({ name: 'orp_management_id', type: 'int', nullable: true })
  orpManagementId: number;

  @ManyToOne(() => ORPManagement, (orpManagements) => orpManagements.kpiVolumes)
  @JoinColumn([{ name: 'orp_management_id' }])
  orpManagement: ORPManagement;

  @Column({ name: 'creator_id', type: 'int', nullable: true })
  creatorId: number;

  @ManyToOne(() => User, (creator) => creator.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  constructor(data: Partial<KpiVolume>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }
}
