import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IntIdEntity } from './base.entity';
import { Product } from './product.entity';
import { Promotion } from './promotion.entity';

@Entity({ name: 'promotion-products' })
export class PromotionProduct extends IntIdEntity {
  @Column({ name: 'promotion_id', type: 'int', nullable: true })
  promotionId: number;

  @ManyToOne(() => Promotion, (promotion) => promotion.promotionProducts)
  @JoinColumn({ name: 'promotion_id' })
  promotion: Promotion;

  @Column({ name: 'product_id', type: 'int', nullable: true })
  productId: number;

  @ManyToOne(() => Product, (product) => product.promotionProducts)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  static STATUS = {
    ACTIVE: 1,
    INACTIVE: -1,
  };

  constructor(partial: Partial<PromotionProduct>) {
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
      productId: this.productId,
      product: this.product,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
