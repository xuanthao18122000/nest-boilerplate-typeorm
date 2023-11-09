// activity-log.decorator.ts

import { SetMetadata } from '@nestjs/common';

export const ACTIVITY_LOG_METADATA_KEY = 'activityLog';

export const ActivityLog = (action: string) =>
  SetMetadata(ACTIVITY_LOG_METADATA_KEY, { action });
