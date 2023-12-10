import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerProductionService {
  error(name: string) {
    console.log(`Production: ${name}`);
  }
}
