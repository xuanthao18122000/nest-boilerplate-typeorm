import { Injectable } from '@nestjs/common';
import { User } from './database/entities/user.entity';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
