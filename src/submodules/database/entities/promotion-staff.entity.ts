import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IntIdEntity } from './base.entity';
import { Promotion } from './promotion.entity';
import { Staff } from './staff.entity';

@Entity({ name: 'promotion-staffs' })
export class PromotionStaff extends IntIdEntity {
  @Column({ name: 'promotion_id', type: 'int', nullable: true })
  promotionId: number;

  @ManyToOne(() => Promotion, (promotion) => promotion.promotionStaffs)
  @JoinColumn({ name: 'promotion_id' })
  promotion: Promotion;

  @Column({ name: 'staff_id', type: 'int', nullable: true })
  staffId: number;

  @ManyToOne(() => Staff, (staff) => staff.promotionStaffs)
  @JoinColumn({ name: 'staff_id' })
  staff: Staff;

  static STATUS = {
    ACTIVE: 1,
    INACTIVE: -1,
  };

  constructor(partial: Partial<PromotionStaff>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
  }

  serialize() {
    return {
      id: this.id,
      promotionId: this.promotionId,
      promotion: this.promotion,
      staffId: this.staffId,
      staff: this.staff,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
