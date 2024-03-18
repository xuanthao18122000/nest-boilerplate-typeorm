import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ORP } from 'src/submodules/database/entities';
import { RetailerController } from './retailer.controller';
import { RetailerService } from './retailer.service';

@Module({
  imports: [TypeOrmModule.forFeature([ORP])],
  controllers: [RetailerController],
  providers: [RetailerService],
})
export class RetailerModule {}
