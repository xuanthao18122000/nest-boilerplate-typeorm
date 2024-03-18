import { Column, Entity } from 'typeorm';
import { IntIdEntity } from './base.entity';

@Entity('hotlines')
export class Hotline extends IntIdEntity {
  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({ default: Hotline.STATUS.ACTIVE })
  status: number;

  static STATUS = {
    ACTIVE: 1,
    INACTIVE: -1,
  };

  constructor(data: Partial<Hotline>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }

  serialize() {
    return {
      id: this.id,
      status: this.status,
      phoneNumber: this.phoneNumber,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
