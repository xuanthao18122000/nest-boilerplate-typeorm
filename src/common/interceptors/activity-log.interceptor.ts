import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivityLogService } from 'src/modules/activity-log/activity-log.service';
import { ACTIVITY_LOG_METADATA_KEY } from 'src/submodules/common/decorators/activity-log.decorator';
import { ActivityLog } from 'src/submodules/database/entities';
import { ActivityLogEnum } from '../enums';

@Injectable()
export class ActivityLogInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,

    private readonly activityLogService: ActivityLogService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const activityLogMetadata = this.reflector.get(
      ACTIVITY_LOG_METADATA_KEY,
      context.getHandler(),
    );

    return next.handle().pipe(
      map(async (response) => {
        if (activityLogMetadata) {
          const { action } = activityLogMetadata;

          if (!action) {
            return response;
          }

          const creatorId: number = context.switchToHttp().getRequest()
            .user?.id;

          if (action.includes('CREATE')) {
            const id = response.data?.id;
            const activityLog =
              await this.activityLogService.findOneByActionAndUserId(
                action,
                creatorId,
              );

            const logCreatedAt = moment(activityLog?.createdAt);
            const currentTime = moment();

            const timeDifference = currentTime.diff(logCreatedAt, 'minutes');

            if (activityLog && timeDifference === 0) {
              activityLog.url = activityLog.url?.replace('/create', `/${id}`);

              await this.activityLogService.saveOne(activityLog);
            }
          }
        }

        return response;
      }),
    );
  }
}

@Injectable()
export class PreInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,

    private readonly activityLogService: ActivityLogService,
  ) {}
  async intercept(context: ExecutionContext, next: CallHandler) {
    const req: Request = context.switchToHttp().getRequest();

    const activityLogMetadata = this.reflector.get(
      ACTIVITY_LOG_METADATA_KEY,
      context.getHandler(),
    );
    if (!activityLogMetadata) return next.handle();

    const { action }: { action: keyof typeof ActivityLogEnum } =
      activityLogMetadata;

    if (req.query.noLogs || !action) {
      return next.handle();
    }

    const description = ActivityLogEnum[action];

    const creatorId: number = context.switchToHttp().getRequest().user?.id;
    const url: string = req.headers.url as string;
    const method = this.getEnumMethod(action);

    if (!url || url?.includes('localhost') || url?.includes('192.')) {
      return next.handle();
    }

    const activityLog: Partial<ActivityLog> = {
      action,
      description,
      method,
      url,
      creatorId,
    };

    await this.activityLogService.saveOne(activityLog);

    return next.handle();
  }

  getEnumMethod(action: string): number {
    let method = ActivityLog.TYPE_ACTION.GET;
    if (action.includes('CREATE')) {
      method = ActivityLog.TYPE_ACTION.CREATE;
    } else if (action.includes('UPDATE') || action.includes('PATCH')) {
      method = ActivityLog.TYPE_ACTION.UPDATE;
    } else if (action.includes('DELETE')) {
      method = ActivityLog.TYPE_ACTION.DELETE;
    } else {
      method = ActivityLog.TYPE_ACTION.GET;
    }
    return method;
  }
}
