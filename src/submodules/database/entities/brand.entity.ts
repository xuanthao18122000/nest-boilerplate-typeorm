import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IntIdEntity } from './base.entity';
import { User } from './user.entity';

@Entity({ name: 'brands' })
export class Brand extends IntIdEntity {
  @Column()
  name: string;

  @Column({ default: Brand.STATUS.ACTIVE })
  status: number;

  @Column({ default: Brand.CATEGORY.FICO_YTL })
  category: number;

  @Column({ name: 'creator_id', type: 'int', nullable: true })
  creatorId: number;

  @ManyToOne(() => User, (creator) => creator.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  static STATUS = {
    ACTIVE: 1,
    INACTIVE: -1,
  };

  static CATEGORY = {
    /** Nhà phân phối của Fico */
    FICO_YTL: 1,
    /** Nhà phân phối của của đối thủ */
    COMPETITORS: 2,
  };

  constructor(partial: Partial<Brand>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
