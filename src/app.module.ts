import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  ActivityLogInterceptor,
  PreInterceptor,
} from './common/interceptors/activity-log.interceptor';
import { ActivityLogModule } from './modules/activity-log/activity-log.module';
import { ActivityLogService } from './modules/activity-log/activity-log.service';
import { AuthModule } from './modules/auth/auth.module';
import { BrandModule } from './modules/brand/brand.module';
import { HealthModule } from './modules/health/health.module';
import { LocationModule } from './modules/location/location.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ProductModule } from './modules/product/product.module';
import { RbacActionsModule } from './modules/rbac-action/rbac-action.module';
import { RbacModulesModule } from './modules/rbac-module/rbac-module.module';
import { RoleModule } from './modules/role/role.module';
import { ROUModule } from './modules/rou/rou.module';
import { StaffModule } from './modules/staff/staff.module';
import { TaskModule } from './modules/task/task.module';
import { UserModule } from './modules/user/user.module';
import { dataSourceOptions } from './submodule/configs/typeorm.config';
import {
  ActivityLog,
  ActivityLogDetail,
  User,
} from './submodule/database/entities';
import { LoggerModule } from './submodule/loggers/logger.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
    }),
    TypeOrmModule.forFeature([User, ActivityLog, ActivityLogDetail]),
    HealthModule,
    LoggerModule,
    AuthModule,
    UserModule,
    RoleModule,
    StaffModule,
    TaskModule,
    ActivityLogModule,
    NotificationModule,
    ProductModule,
    BrandModule,
    RbacModulesModule,
    RbacActionsModule,
    ROUModule,
    LocationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ActivityLogService,
    {
      provide: APP_INTERCEPTOR,
      useClass: PreInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ActivityLogInterceptor,
    },
  ],
  exports: [],
})
export class AppModule {}
