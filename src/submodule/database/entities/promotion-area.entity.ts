import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Area } from './area.entity';
import { IntIdEntity } from './base.entity';
import { Promotion } from './promotion.entity';

@Entity({ name: 'promotion-areas' })
export class PromotionArea extends IntIdEntity {
  @Column({ name: 'promotion_id', type: 'int', nullable: true })
  promotionId: number;

  @ManyToOne(() => Promotion, (promotion) => promotion.promotionAreas)
  @JoinColumn({ name: 'promotion_id' })
  promotion: Promotion;

  @Column({ name: 'area_id', type: 'int', nullable: true })
  areaId: number;

  @ManyToOne(() => Area, (area) => area.promotionAreas)
  @JoinColumn({ name: 'area_id' })
  area: Area;

  static STATUS = {
    ACTIVE: 1,
    INACTIVE: -1,
  };

  constructor(partial: Partial<PromotionArea>) {
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
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
