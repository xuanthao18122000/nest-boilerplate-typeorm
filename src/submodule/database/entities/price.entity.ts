import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { PriceBase } from './price-base.entity';
import { PriceBreakdown } from './price-breakdown.entity';
import { Ticket } from './ticket.entity';

@Entity({ name: 'prices' })
export class Price extends PriceBase {
  @Column({ name: 'ticket_id', type: 'int', nullable: true })
  ticketId: number;

  @ManyToOne(() => Ticket, (ticket) => ticket.prices, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @Column({ name: 'price_breakdown_id', type: 'int', nullable: true })
  priceBreakdownId: number;

  @OneToOne(() => PriceBreakdown, (priceBreakdown) => priceBreakdown.price, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'price_breakdown_id' })
  priceBreakdown: PriceBreakdown;

  constructor(data: Partial<Price>) {
    super(data);
    if (data) {
      Object.assign(this, data);
    }
  }
}
