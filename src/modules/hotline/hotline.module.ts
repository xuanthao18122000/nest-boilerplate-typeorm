import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotline } from 'src/submodules/database/entities';
import { HotlineController } from './hotline.controller';
import { HotlineService } from './hotline.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Hotline])],
  controllers: [HotlineController],
  providers: [HotlineService],
  exports: [HotlineService],
})
export class HotlineModule {}
