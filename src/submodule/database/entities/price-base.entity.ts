import { Column, JoinColumn, ManyToOne } from 'typeorm';
import {
  IDiscountPrice,
  ISupportPrice,
} from '../../common/interfaces/price.interface';
import { IntIdEntity } from './base.entity';
import { ProductManagement } from './product-management.entity';

export class PriceBase extends IntIdEntity {
  @Column({ name: 'buy_in_price', type: 'decimal', default: 0 })
  buyInPrice: number;

  @Column({ name: 'sell_out_price', type: 'decimal', default: 0 })
  sellOutPrice: number;

  @Column({ name: 'province_id', type: 'int', nullable: true })
  provinceId: number;

  @Column({ name: 'area_id', type: 'int', nullable: true })
  areaId: number;

  @Column({ type: 'decimal', nullable: true })
  volume: number;

  @Column({ name: 'free_bag', nullable: true })
  freeBag: number;

  @Column({ default: 0 })
  cost: number;

  @Column({ default: 0 })
  trade: number;

  @Column({
    type: 'json',
    default: {
      fixed: 0,
      payment: 0,
      marketDevelopment: 0,
      shortTerm: 0,
      monthly: 0,
      other: 0,
    },
  })
  discounts: IDiscountPrice;

  @Column({
    type: 'json',
    default: {
      shortTermMarket: 0,
      deliveryLoadingStorage: 0,
      rtlViaOd: 0,
      other: 0,
    },
  })
  supports: ISupportPrice;

  @Column({ type: 'decimal', nullable: true })
  promotion: number;

  @Column({ name: 'promotion_bag_od', type: 'decimal', nullable: true })
  promotionBagOD: number;

  @Column({ name: 'promotion_bag_rtl', type: 'decimal', nullable: true })
  promotionBagRTL: number;

  @Column({ name: 'promotion_other', type: 'decimal', nullable: true })
  promotionOther: number;

  @Column({ name: 'pick_up_point', nullable: true })
  pickUpPoint: string;

  @Column({ name: 'delivery_mode', default: PriceBase.DELIVERY_MODE.PK })
  deliveryMode: string;

  @Column({ name: 'invoice_price', type: 'decimal', nullable: true })
  invoicePrice: number;

  @Column({ name: 'direct_selling_price', type: 'decimal', nullable: true })
  directSellingPrice: number;

  @Column({ name: 'is_current', default: true })
  isCurrent: boolean;

  @Column({ name: 'market_feedback', nullable: true })
  marketFeedback: string;

  @Column({ name: 'product_management_id', nullable: true })
  productManagementId: number;

  @Column({ type: 'decimal', name: 'lc_tc_cost', default: 0 })
  LCTCCost: number;

  @ManyToOne(
    () => ProductManagement,
    (productManagement) => productManagement.prices,
  )
  @JoinColumn({ name: 'product_management_id' })
  productManagement: ProductManagement;

  static DELIVERY_MODE = {
    PK: 'PK',
    PS: 'PS',
  };

  constructor(data: Partial<PriceBase>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }
}
