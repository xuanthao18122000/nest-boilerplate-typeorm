import { Column, Entity, OneToMany } from 'typeorm';
import { RoleAction, User } from '.';
import { IntIdEntity } from './base.entity';

@Entity('roles')
export class Role extends IntIdEntity {
  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  key: string;

  @Column({ type: 'int', default: Role.STATUS.ACTIVE })
  status: number;

  @OneToMany(() => User, (user) => user.role, {
    createForeignKeyConstraints: false,
  })
  users: User[];

  @OneToMany(() => RoleAction, (action) => action.role, {
    createForeignKeyConstraints: false,
  })
  actions: RoleAction[];

  static STATUS = {
    ACTIVE: 1,
    INACTIVE: -1,
  };

  static KEY = {
    ADMIN: 'ADMIN',
    RSM: 'RSM',
  };

  constructor(data: Partial<Role>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }

  serialize() {
    return {
      id: this.id,
      name: this.name,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
