import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/module/todo.module';
import { CountModule } from './count/module/count.module';

@Module({
  imports: [TodoModule, CountModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
