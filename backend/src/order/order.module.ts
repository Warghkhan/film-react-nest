import { DynamicModule, Module, Provider } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MongoOrderStorage } from './order.storage.mongodb';
import { PostgresOrderStorage } from './order.storage.postgres';

import { MongooseModule } from '@nestjs/mongoose';
import { Film, FilmSchema } from '../films/schemas/film.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from '../films/entities/schedule.entity';

import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const databaseDriver = process.env.DATABASE_DRIVER || 'postgres';

let dbFeatureModule: DynamicModule;
let orderStorageProvider: Provider;

switch (databaseDriver) {
  case 'mongodb':
    dbFeatureModule = MongooseModule.forFeature([
      { name: Film.name, schema: FilmSchema },
    ]);
    orderStorageProvider = {
      provide: 'OrderStorage',
      useClass: MongoOrderStorage,
    };
    break;

  case 'postgres':
    dbFeatureModule = TypeOrmModule.forFeature([Schedule]);
    orderStorageProvider = {
      provide: 'OrderStorage',
      useClass: PostgresOrderStorage,
    };
    break;

  default:
    throw new Error(
      `Unsupported DATABASE_DRIVER: "${databaseDriver}". Supported: "mongodb", "postgres".`,
    );
}

@Module({
  imports: [dbFeatureModule],
  controllers: [OrderController],
  providers: [OrderService, orderStorageProvider],
})
export class OrderModule {}
