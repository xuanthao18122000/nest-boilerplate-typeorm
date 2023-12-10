import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerTestService {
  error(name: string) {
    console.log(`Test: ${name}`);
  }
}
