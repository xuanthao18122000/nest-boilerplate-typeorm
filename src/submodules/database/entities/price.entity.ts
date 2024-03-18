import { Column, Entity } from 'typeorm';
import { IntIdEntity } from './base.entity';

@Entity({ name: 'prices' })
export class Price extends IntIdEntity {
  @Column({
    name: 'buy_in_price',
    type: 'decimal',
    scale: 2,
    unsigned: true,
    nullable: true,
  })
  buyInPrice: number;

  @Column({
    name: 'sell_out_price',
    type: 'decimal',
    scale: 2,
    unsigned: true,
    nullable: true,
  })
  sellOutPrice: number;

  @Column({ type: 'decimal', scale: 2, unsigned: true, nullable: true })
  volume: number;

  @Column({ name: 'free_bag', nullable: true })
  freeBag: number;

  @Column({ type: 'decimal', scale: 2, unsigned: true, nullable: true })
  promotion: number;

  @Column({ name: 'pick_up_point', nullable: true })
  pickUpPoint: string;

  @Column({ name: 'delivery_mode', default: 'PK' })
  deliveryMode: string;

  @Column({ name: 'is_current', default: true })
  isCurrent: boolean;

  constructor(data: Partial<Price>) {
    super();
    if (data) {
      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;
      this.buyInPrice = data.buyInPrice;
      this.sellOutPrice = data.sellOutPrice;
      this.volume = data.volume;
      this.freeBag = data.freeBag;
      this.promotion = data.promotion;
      this.pickUpPoint = data.pickUpPoint;
      this.deliveryMode = data.deliveryMode;
      this.isCurrent = data.isCurrent;
    }
  }
}
