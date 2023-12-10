import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerStagingService {
  error(name: string) {
    console.log(`Staging: ${name}`);
  }
}
