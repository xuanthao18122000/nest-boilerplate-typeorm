import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { RbacModule } from '.';
import { IntIdEntity } from './base.entity';

@Entity('rbac_actions')
export class RbacAction extends IntIdEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  key: string;

  @Column({ type: 'int', default: 1 })
  status: number;

  @Column({ name: 'module_id', type: 'int', nullable: true })
  moduleId: number;

  @ManyToOne(() => RbacModule, (module) => module.actions, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'module_id' })
  module: RbacModule;

  constructor(data: Partial<RbacAction>) {
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
