import { Controller, Get } from '@nestjs/common';
import { CountService } from '../service/count.service';

@Controller()
export class CountController {
  private countFromController = 1;
  constructor(private readonly todoService: CountService) {}
  @Get('count')
  getHello(count: number): string {
    count = this.countFromController;
    this.countFromController++;
    return this.todoService.getHello(count);
  }
}
