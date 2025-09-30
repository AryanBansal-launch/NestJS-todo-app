import { Module } from '@nestjs/common';
import { TodoModule } from './todo/module/todo.module';
import { CountModule } from './count/module/count.module';
import { ConfigModule } from '@nestjs/config';
import envConfig from './config/env.config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfig],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    TodoModule,
    CountModule,
  ],
})
export class AppModule {}
