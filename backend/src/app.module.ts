import * as dotenv from 'dotenv';
import { DynamicModule, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'node:path';

import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';
import { Film } from './films/entities/film.entity';
import { Schedule } from './films/entities/schedule.entity';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const databaseDriver = process.env.DATABASE_DRIVER;

let dbModule: DynamicModule;

if (databaseDriver === 'mongodb') {
  dbModule = MongooseModule.forRootAsync({
    useFactory: (config: ConfigService) => ({
      uri: config.get<string>('DATABASE_URL'),
    }),
    inject: [ConfigService],
  });
} else if (databaseDriver === 'postgres') {
  dbModule = TypeOrmModule.forRootAsync({
    useFactory: (config: ConfigService) => ({
      type: 'postgres',
      host: config.get('DB_HOST'),
      port: config.get('DB_PORT'),
      username: config.get('DB_USERNAME'),
      password: config.get('DB_PASSWORD'),
      database: config.get('DB_NAME'),
      entities: [Film, Schedule],
      synchronize: false,
      logging: config.get('DEBUG', false) ? ['query', 'error'] : false,
    }),
    inject: [ConfigService],
  });
} else {
  throw new Error(
    `Unsupported DATABASE_DRIVER: "${databaseDriver}". Supported: "mongodb", "postgres".`,
  );
}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.resolve(__dirname, '../.env'),
      isGlobal: true,
      cache: true,
    }),
    dbModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),
    FilmsModule,
    OrderModule,
  ],
})
export class AppModule {}
