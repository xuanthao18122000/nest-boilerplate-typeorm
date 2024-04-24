import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { SourceType } from '../../common/enums';
import { IntIdEntity } from './base.entity';
import { Brand } from './brand.entity';
import { ProductManagement } from './product-management.entity';
import { PromotionProduct } from './promotion-product.entity';
import { User } from './user.entity';

@Entity({ name: 'products' })
export class Product extends IntIdEntity {
  @Index({ fulltext: true })
  @Column()
  name: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  avatar: string;

  // @Column({ name: 'market_feedback', nullable: true })
  // marketFeedback: string;

  @Column({ nullable: true })
  note: string;

  @Column({ type: 'jsonb', default: [] })
  images: Array<string>;

  @Column({
    type: 'enum',
    enum: SourceType,
    name: 'source_type',
    default: SourceType.INTERNAL,
  })
  sourceType: SourceType;

  @Column({ default: Product.STATUS.ACTIVE })
  status: number;

  @Column({ name: 'brand_id', type: 'int', nullable: true })
  brandId: number;

  @ManyToOne(() => Brand, (brand) => brand.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @OneToMany(
    () => PromotionProduct,
    (promotionProduct) => promotionProduct.product,
  )
  promotionProducts: PromotionProduct[];

  @OneToMany(
    () => ProductManagement,
    (productManagements) => productManagements.product,
  )
  productManagements: ProductManagement[];

  @Column({ name: 'creator_id', type: 'int', nullable: true })
  creatorId: number;

  @ManyToOne(() => User, (creator) => creator.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  static STATUS = {
    ACTIVE: 1,
    INACTIVE: -1,
  };

  static SourceType = {
    INTERNAL: 'internal',
    EXTERNAL: 'external',
  };

  constructor(partial: Partial<Product>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
