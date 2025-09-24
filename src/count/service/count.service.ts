import { Injectable } from '@nestjs/common';

@Injectable()
export class CountService {
  private countfromservice = 1;
  getHello(countFromController: number): string {
    console.log('Counter from service: ', this.countfromservice);
    this.countfromservice++;
    return 'countFromController: ' + countFromController;
  }
}
