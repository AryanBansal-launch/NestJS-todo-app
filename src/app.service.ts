import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('app service logger called!');
    return 'Hello World!';
  }
}
