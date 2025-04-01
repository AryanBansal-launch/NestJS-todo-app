import { App } from 'supertest/types';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import envConfig from './config/env.config';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfig],
      isGlobal: true,
    }
    ), 
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Ensure ConfigModule is available
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database', ' '), // Fetch MONGO_URI
      }),
      inject: [ConfigService], // Inject ConfigService
    }), TodoModule,  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
