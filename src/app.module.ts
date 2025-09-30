import { Module } from '@nestjs/common';
import { TodoModule } from './todo/module/todo.module';
import { CountModule } from './count/module/count.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import envConfig from './config/env.config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfig],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    TodoModule,
    CountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
