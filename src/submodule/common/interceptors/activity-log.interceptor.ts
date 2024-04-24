// import {
//   CallHandler,
//   ExecutionContext,
//   Injectable,
//   NestInterceptor,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Request } from 'express';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { ActivityLog } from '../../database/entities';
// import { Repository } from 'typeorm';
// import { ACTIVITY_LOG_METADATA_KEY } from '../decorators/activity-log.decorator';

// @Injectable()
// export class ActivityLogInterceptor implements NestInterceptor {
//   constructor(
//     private readonly reflector: Reflector,

//     @InjectRepository(ActivityLog)
//     private readonly activityLogRepo: Repository<ActivityLog>,
//   ) {}

//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const activityLogMetadata = this.reflector.get(
//       ACTIVITY_LOG_METADATA_KEY,
//       context.getHandler(),
//     );

//     return next.handle().pipe(
//       map(async (response) => {
//         const req: Request = context.switchToHttp().getRequest();

//         if (activityLogMetadata) {
//           let { action } = activityLogMetadata;

//           if (!action) {
//             return response;
//           }
//           const creator: number = context.switchToHttp().getRequest().user?.id;

//           if (action.includes('CREATE')) {
//             const id = response.data?.id;
//             // const activityLog =
//             //   await this.activityLogRepo.findOneByActionAndUserId(
//             //     action,
//             //     creator,
//             //   );
//             // activityLog.url =
//             //   activityLog.url?.replace('/add', `/${id}`) || activityLog.url;
//             // this.activityLogService.saveOne(activityLog);
//           }
//         }

//         return response;
//       }),
//     );
//   }
// }

// @Injectable()
// export class PreInterceptor implements NestInterceptor {
//   constructor(
//     private readonly reflector: Reflector,

//     @InjectRepository(ActivityLog)
//     private readonly activityLogRepo: Repository<ActivityLog>,
//   ) {}
//   async intercept(context: ExecutionContext, next: CallHandler) {
//     const req: Request = context.switchToHttp().getRequest();

//     const activityLogMetadata = this.reflector.get(
//       ACTIVITY_LOG_METADATA_KEY,
//       context.getHandler(),
//     );
//     if(!activityLogMetadata) return next.handle();

//     let { action } = activityLogMetadata;

//     if (req.query.noLogs || !action) {
//       return next.handle();
//     }

//     // action = this.setActivityCodeCaseGameConfig(action, req);

//     // const description = ActivityLogEnum[action];

//     const creator: number = context.switchToHttp().getRequest().user?.id;
//     let fullUrl: string = req.headers.url as string;
//     const method = this.getEnumMethod(action);

//     // await this.activityLogRepo.create(
//     //   action,
//     //   // description,
//     //   method,
//     //   fullUrl,
//     //   creator,
//     // );

//     return next.handle();
//   }

//   getEnumMethod(action: string): number {
//     let method = ActivityLog.TYPE_ACTION.READ;
//     if (action.includes('CREATE')) {
//       method = ActivityLog.TYPE_ACTION.CREATE;
//     } else if (action.includes('UPDATE') || action.includes('PATCH')) {
//       method = ActivityLog.TYPE_ACTION.UPDATE;
//     } else if (action.includes('DELETE')) {
//       method = ActivityLog.TYPE_ACTION.DELETE;
//     } else {
//       method = ActivityLog.TYPE_ACTION.READ;
//     }
//     return method;
//   }
// }
