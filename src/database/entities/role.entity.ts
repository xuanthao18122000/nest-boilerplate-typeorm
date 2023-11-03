import { Column, Entity, OneToMany } from 'typeorm';
import { actionDefaultType } from '../../common/types';
import { BaseEntity, User } from './';

@Entity('roles')
export class Role extends BaseEntity {
  @Column({ type: 'varchar', length: 50, nullable: true })
  key: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @Column({ type: 'int', default: 1 })
  status: number;

  @Column({ type: 'jsonb', default: [], nullable: true })
  moduleDefault: actionDefaultType[];

  @Column({ type: 'jsonb', default: [], nullable: true })
  actionDefault: actionDefaultType[];

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  constructor(data: Partial<Role>) {
    super();
    if (data) {
      this.id = data.id || null;
      this.key = data.key;
      this.name = data.name;
      this.status = data.status;
      this.moduleDefault = data.moduleDefault;
      this.actionDefault = data.actionDefault;
    }
  }
}
