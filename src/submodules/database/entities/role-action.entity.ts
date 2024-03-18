import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Role } from '.';
import { IntIdEntity } from './base.entity';

@Entity('role_actions')
export class RoleAction extends IntIdEntity {
  @Column({ name: 'role_id' })
  roleId: number;

  @ManyToOne(() => Role, (role) => role.users, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ type: 'varchar' })
  action: string;

  constructor(data: Partial<RoleAction>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }
}
