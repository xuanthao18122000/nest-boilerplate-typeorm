import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerDevService {
  error(name: string) {
    console.log(`Dev: ${name}`);
  }
}
