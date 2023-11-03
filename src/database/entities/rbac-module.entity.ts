import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity, RbacAction } from './';

@Entity('rbac_modules')
export class RbacModule extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  key: string;

  @Column({ type: 'int', default: 1 })
  status: number;

  @OneToMany(() => RbacAction, (rbacAction) => rbacAction.rbacModule)
  rbacActions: RbacAction[];

  constructor(data: Partial<RbacModule>) {
    super();
    if (data) {
      this.id = data.id || null;
      this.key = data.key;
      this.name = data.name;
      this.status = data.status;
    }
  }
}
