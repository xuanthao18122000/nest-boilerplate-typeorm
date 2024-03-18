import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { INamePosition } from '../../common/interfaces';
import { IntIdEntity } from './base.entity';
import { User } from './user.entity';

@Entity('positions')
export class Position extends IntIdEntity {
  @Column({ type: 'jsonb', default: { vi: '', en: '' } })
  name: INamePosition;

  @Column({ default: Position.TYPE.SALES })
  type: number;

  @Column({ nullable: true })
  description: string;

  @Column({ default: Position.STATUS.ACTIVE })
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
    INACTIVE: 1,
  };

  static TYPE = {
    SALES: 1,
    SALES_HEAD: 2,
  };

  constructor(data: Partial<Position>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }

  serialize() {
    return {
      id: this.id,
      type: this.type,
      status: this.status,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
