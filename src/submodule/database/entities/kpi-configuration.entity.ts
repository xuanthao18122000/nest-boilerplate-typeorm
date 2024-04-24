import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IntIdEntity } from './base.entity';
import { User } from './user.entity';

@Entity('kpi_configurations')
export class KpiConfiguration extends IntIdEntity {
  @Column({ name: 'mcp_day', type: 'int', nullable: true })
  mcpDay: number;

  @Column({ name: 'visiting_route', nullable: true })
  visitingRoute: number;

  @Column({ name: 'application_date', type: 'timestamptz', nullable: true })
  applicationDate: Date;

  @Column({ default: KpiConfiguration.STATUS.PENDING })
  status: number;

  @Column({ name: 'creator_id', type: 'int', nullable: true })
  creatorId: number;

  @ManyToOne(() => User, (creator) => creator.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  static STATUS = {
    ACTIVE: 1,
    PENDING: -1,
    INACTIVE: -2,
  };

  constructor(data: Partial<KpiConfiguration>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }

  serialize() {
    return {
      id: this.id,
      mcpDay: this.mcpDay,
      status: this.status,
      visitingRoute: this.visitingRoute,
      applicationDate: this.applicationDate,
      creator: this.creator,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
