import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '.';
import { IntIdEntity } from './base.entity';

@Entity('user_actions')
export class UserAction extends IntIdEntity {
  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.actions, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar' })
  action: string;

  constructor(data: Partial<UserAction>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }
}
