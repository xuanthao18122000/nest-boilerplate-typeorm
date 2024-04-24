import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { IntIdEntity } from './base.entity';
import { ORP } from './orp.entity';
import { Price } from './price.entity';
import { ProductTransaction } from './product-transaction.entity';
import { Product } from './product.entity';
import { Staff } from './staff.entity';

@Entity({ name: 'product_managements' })
export class ProductManagement extends IntIdEntity {
  @Column({ name: 'created_by' })
  createdBy: number;

  @ManyToOne(() => Staff, (creator) => creator.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'created_by' })
  creator: Staff;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: number;

  @ManyToOne(() => Staff, (creator) => creator.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'updated_by' })
  updater: Staff;

  @ManyToOne(() => ORP, (orp) => orp.productManagements, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'orp_id', referencedColumnName: 'id' }])
  orp: ORP;

  @Column({ name: 'orp_id' })
  orpId: number;

  @Column({ name: 'status', default: ProductManagement.STATUS.CURRENT })
  status: number;

  @Column({ name: 'product_id' })
  productId: number;

  @ManyToOne(() => Product, (product) => product.productManagements, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'product_id', referencedColumnName: 'id' }])
  product: Product;

  @OneToMany(
    () => ProductTransaction,
    (productTransaction) => productTransaction.productManagement,
  )
  productTransactions: ProductTransaction[];

  @OneToMany(() => Price, (price) => price.productManagement)
  prices: Price[];

  static STATUS = {
    NOT_YET_IMPORT: 1,
    CURRENT: 2,
    SOLD_OUT: 3,
  };

  constructor(data: any) {
    super();
    if (data) {
      this.id = data.id;
      this.status = data.status;
      this.orp = data.orp;
      this.product = data.product;
      this.orpId = data.orpId;
      this.prices = data.prices;
      this.productId = data.productId;
      this.createdBy = data.createdBy;
      this.updatedBy = data.updatedBy;
    }
  }
}
