import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity, RbacModule } from './';

@Entity('rbac_actions')
export class RbacAction extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  key: string;

  @Column({ type: 'int', default: 1 })
  status: number;

  @ManyToOne(() => RbacModule, (module) => module.rbacActions)
  rbacModule: RbacModule;

  constructor(data: Partial<RbacAction>) {
    super();
    if (data) {
      this.id = data.id || null;
      this.key = data.key;
      this.name = data.name;
      this.status = data.status;
    }
  }
}
