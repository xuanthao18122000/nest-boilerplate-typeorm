import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { PriceBase } from './price-base.entity';
import { Price } from './price.entity';

@Entity({ name: 'price-breakdowns' })
export class PriceBreakdown extends PriceBase {
  @Column({ name: 'price_id', type: 'int', nullable: true })
  priceId: number;

  @OneToOne(() => Price, (price) => price.priceBreakdown, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'price_id' })
  price: Price;

  constructor(data: Partial<PriceBreakdown>) {
    super(data);
    if (data) {
      Object.assign(this, data);
    }
  }
}
