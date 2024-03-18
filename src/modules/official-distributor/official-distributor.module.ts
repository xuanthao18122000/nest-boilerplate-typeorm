import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ORP, ROU } from 'src/submodules/database/entities';
import { ODController } from './official-distributor.controller';
import { ODService } from './official-distributor.service';

@Module({
  imports: [TypeOrmModule.forFeature([ORP, ROU])],
  controllers: [ODController],
  providers: [ODService],
})
export class ODModule {}
