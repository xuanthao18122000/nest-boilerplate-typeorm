import { Column, Entity } from 'typeorm';
import { PriceBase } from './price-base.entity';

@Entity({ name: 'price-policies' })
export class PricePolicy extends PriceBase {
  @Column({ default: PricePolicy.STATUS.ACTIVE, nullable: true })
  status: number;

  static STATUS = {
    ACTIVE: 1,
    INACTIVE: -1,
  };

  constructor(data: Partial<PricePolicy>) {
    super(data);
    if (data) {
      Object.assign(this, data);
    }
  }
}
