import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RbacAction, RbacModule } from 'src/submodules/database/entities';
import { RbacActionController } from './rbac-action.controller';
import { RbacActionService } from './rbac-action.service';

@Module({
  imports: [TypeOrmModule.forFeature([RbacModule, RbacAction])],
  controllers: [RbacActionController],
  providers: [RbacActionService],
})
export class RbacActionsModule {}
