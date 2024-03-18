import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Area,
  Product,
  Promotion,
  PromotionArea,
  PromotionProduct,
  PromotionStaff,
  ROU,
  Staff,
} from 'src/submodules/database/entities';
import { PromotionController } from './promotion.controller';
import { PromotionService } from './promotion.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Promotion,
      PromotionProduct,
      PromotionStaff,
      PromotionArea,
      Product,
      Staff,
      Area,
      ROU,
    ]),
  ],
  controllers: [PromotionController],
  providers: [PromotionService],
})
export class PromotionModule {}
