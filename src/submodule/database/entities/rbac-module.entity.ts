import { Column, Entity, OneToMany } from 'typeorm';
import { RbacAction } from '.';
import { IntIdEntity } from './base.entity';

@Entity('rbac_modules')
export class RbacModule extends IntIdEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  key: string;

  @Column({ type: 'int', default: RbacModule.STATUS.ACTIVE })
  status: number;

  @OneToMany(() => RbacAction, (rbacAction) => rbacAction.module)
  actions: RbacAction[];

  constructor(data: Partial<RbacModule>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }

  static STATUS = {
    ACTIVE: 1,
    INACTIVE: -1,
  };

  serialize() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
