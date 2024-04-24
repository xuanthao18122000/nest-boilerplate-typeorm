import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IntIdEntity } from './base.entity';
import { ProductManagement } from './product-management.entity';

@Entity({ name: 'product_transactions' })
export class ProductTransaction extends IntIdEntity {
  @Column({ type: 'decimal', nullable: true })
  volume: number;

  @ManyToOne(
    () => ProductManagement,
    (productManagement) => productManagement.productTransactions,
  )
  @JoinColumn([{ name: 'product_management_id' }])
  productManagement: ProductManagement;

  @Column({ name: 'product_management_id' })
  productManagementId: number;

  constructor(partial: Partial<ProductTransaction>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
