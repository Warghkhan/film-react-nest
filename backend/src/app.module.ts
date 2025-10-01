import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'node:path';

import { configProvider } from './app.config.provider';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';
import { Film } from './films/entities/film.entity';
import { Schedule } from './films/entities/schedule.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.resolve(__dirname, '../.env'),
      isGlobal: true,
      cache: true,
    }),

    // MongoDB
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        const driver = config.get<string>('DATABASE_DRIVER');
        return driver === 'mongodb'
          ? { uri: config.get<string>('DATABASE_URL') }
          : { uri: 'mongodb://localhost:27017/prac' }; 
      },
      inject: [ConfigService],
    }),

    // PostgreSQL
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        const driver = config.get<string>('DATABASE_DRIVER');
        if (driver === 'postgres') {
          return {
            type: 'postgres',
            host: config.get('DB_HOST', 'localhost'),
            port: config.get('DB_PORT', 5432),
            username: config.get('DB_USERNAME', 'prac'),
            password: config.get('DB_PASSWORD', 'prac'),
            database: config.get('DB_NAME', 'prac'),
            entities: [Film, Schedule],
            synchronize: false,
            logging: config.get('DEBUG', false) ? ['query', 'error'] : false,
          };
        }
        return {
          type: 'postgres',
          entities: [],
          synchronize: false,
          logging: false,
        };
      },
      inject: [ConfigService],
    }),

    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),

    FilmsModule,
    OrderModule,
  ],
  providers: [configProvider],
})
export class AppModule {}