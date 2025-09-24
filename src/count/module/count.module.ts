import { Module } from '@nestjs/common';
import { CountController } from '../controller/count.controller';
import { CountService } from '../service/count.service';

@Module({
  imports: [],
  controllers: [CountController],
  providers: [CountService],
})
export class CountModule {}
