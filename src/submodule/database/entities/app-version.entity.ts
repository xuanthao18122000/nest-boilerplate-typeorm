import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IntIdEntity } from './base.entity';
import { User } from './user.entity';

@Entity({ name: 'app_versions' })
export class AppVersion extends IntIdEntity {
  @Column({ type: 'varchar', default: AppVersion.PLATFORM.ANDROID })
  platform: string;

  @Column({ type: 'varchar' })
  version: string;

  @Column({ name: 'old_version', nullable: true })
  oldVersion: string;

  @Column({ name: 'update_required', default: false })
  required: boolean;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'sales_number', type: 'int', default: 0 })
  salesNumber: number;

  @Column({ default: AppVersion.STATUS.ACTIVE })
  status: number;

  @Column({ name: 'creator_id', type: 'int', nullable: true })
  creatorId: number;

  @ManyToOne(() => User, (creator) => creator.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  static PLATFORM = {
    ANDROID: 'android',
    IOS: 'ios',
  };

  static STATUS = {
    ACTIVE: 1,
    INACTIVE: -1,
  };

  constructor(partial: Partial<AppVersion>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
