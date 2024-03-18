import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '.';
import { UUIDIdentifiableEntity } from './base.entity';

@Entity('history_exports')
export class HistoryExport extends UUIDIdentifiableEntity {
  @Column({ type: 'varchar', name: 'file_name', nullable: true })
  fileName: string;

  @Column({ type: 'varchar', name: 'query_url', nullable: true })
  queryUrl: string;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'export_at',
    nullable: true,
  })
  exportAt: Date;

  @Column({ type: 'int', default: HistoryExport.TYPE.OTHER })
  type: number;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @Column({ type: 'int', default: HistoryExport.STATUS.CREATED })
  status: number;

  @Column({ name: 'creator_id', type: 'int', nullable: true })
  creatorId: number;

  @ManyToOne(() => User, (creator) => creator.historyExports, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  static STATUS = {
    CREATED: 1,
    PROCESSING: 2,
    DONE: 3,
    FAIL: -1,
  };

  static TYPE = {
    USER: 1,
    STAFF: 2,
    DEPARTMENT: 3,
    OTHER: 4,
  };

  constructor(data: Partial<HistoryExport>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }

  serialize() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
