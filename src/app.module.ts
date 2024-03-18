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
import { AppVersionModule } from './modules/app-version/app-version.module';
import { AreaModule } from './modules/area/area.module';
import { AuthModule } from './modules/auth/auth.module';
import { BrandModule } from './modules/brand/brand.module';
import { ConfigTrackingModule } from './modules/configure-tracking/configure-tracking.module';
import { HealthModule } from './modules/health/health.module';
import { HistoryExportModule } from './modules/history-export/history-export.module';
import { HotlineModule } from './modules/hotline/hotline.module';
import { KpiConfigureModule } from './modules/kpi-configuration/kpi-configuration.module';
import { KpiVolumeModule } from './modules/kpi-volume/kpi-volume.module';
import { LocationLookupModule } from './modules/location-lookup/location-lookup.module';
import { LocationModule } from './modules/location/location.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ODModule } from './modules/official-distributor/official-distributor.module';
import { OtherCustomerModule } from './modules/other-customer/other-customer.module';
import { PositionModule } from './modules/position/position.module';
import { PotentialCustomerModule } from './modules/potential-customer/potential-customer.module';
import { ProductModule } from './modules/product/product.module';
import { PromotionModule } from './modules/promotion/promotion.module';
import { RbacActionsModule } from './modules/rbac-action/rbac-action.module';
import { RbacModulesModule } from './modules/rbac-module/rbac-module.module';
import { RetailerModule } from './modules/retailer/retailer.module';
import { RoleModule } from './modules/role/role.module';
import { ROUModule } from './modules/rou/rou.module';
import { StaffModule } from './modules/staff/staff.module';
import { TaskModule } from './modules/task/task.module';
import { UserModule } from './modules/user/user.module';
import { VisitingHistoryModule } from './modules/visiting-history/visiting-history.module';
import { dataSourceOptions } from './submodules/configs/typeorm.config';
import {
  ActivityLog,
  ActivityLogDetail,
  User,
} from './submodules/database/entities';
import { LoggerModule } from './submodules/loggers/logger.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
    }),
    TypeOrmModule.forFeature([User, ActivityLog, ActivityLogDetail]),
    HealthModule,
    HotlineModule,
    LoggerModule,
    AuthModule,
    UserModule,
    RoleModule,
    StaffModule,
    ODModule,
    RetailerModule,
    PotentialCustomerModule,
    OtherCustomerModule,
    VisitingHistoryModule,
    ConfigTrackingModule,
    LocationLookupModule,
    PromotionModule,
    TaskModule,
    KpiConfigureModule,
    AppVersionModule,
    KpiVolumeModule,
    LocationModule,
    ActivityLogModule,
    PositionModule,
    AreaModule,
    ROUModule,
    NotificationModule,
    ProductModule,
    BrandModule,
    HistoryExportModule,
    RbacModulesModule,
    RbacActionsModule,
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
