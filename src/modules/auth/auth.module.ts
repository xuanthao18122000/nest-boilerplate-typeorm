import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { User } from 'src/submodule/database/entities';
import { ROUModule } from '../rou/rou.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AzureAdStrategy } from './strategies/azure-ad.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'azure-ad' }),
    ROUModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    AzureAdStrategy,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
