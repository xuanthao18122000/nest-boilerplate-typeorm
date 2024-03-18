import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Location,
  ORP,
  ORPManagement,
  Staff,
} from 'src/submodules/database/entities';
import { Potential } from 'src/submodules/database/entities/potentital.entity';
import { LocationService } from '../location/location.service';
import { PotentialCustomerController } from './potential-customer.controller';
import { PotentialCustomerService } from './potential-customer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Potential, ORP, Staff, Location, ORPManagement]),
  ],
  controllers: [PotentialCustomerController],
  providers: [PotentialCustomerService, LocationService],
})
export class PotentialCustomerModule {}
