import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { IntIdEntity } from './base.entity';
import { Location } from './location.entity';
import { ORP } from './orp.entity';
import { Promotion } from './promotion.entity';
import { User } from './user.entity';

@Entity({ name: 'ROUs' })
export class ROU extends IntIdEntity {
  @Column()
  name: string;

  @Column({ default: ROU.STATUS.ACTIVE, nullable: true })
  status: number;

  @Column({ name: 'creator_id', type: 'int', nullable: true })
  creatorId: number;

  @ManyToOne(() => User, (creator) => creator.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @OneToMany(() => ORP, (orp) => orp.rou, {
    createForeignKeyConstraints: false,
  })
  ORPs: ORP[];

  @OneToMany(() => User, (user) => user.rou, {
    createForeignKeyConstraints: false,
  })
  users: User[];

  @OneToMany(() => Promotion, (promotion) => promotion.rou, {
    createForeignKeyConstraints: false,
  })
  promotions: Promotion[];

  @OneToMany(() => Location, (location) => location.rou)
  provinces: Location[];

  static STATUS = {
    ACTIVE: 1,
    INACTIVE: -1,
  };

  constructor(partial: Partial<ROU>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
  }

  serialize() {
    return {
      id: this.id,
      name: this.name,
      status: this.status,
      creator: this.creator,
      creatorId: this.creatorId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
