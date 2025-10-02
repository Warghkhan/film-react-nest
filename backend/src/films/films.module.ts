import { DynamicModule, Module, Provider } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Film, FilmSchema } from './schemas/film.schema';
import { Schedule, ScheduleSchema } from './schemas/schedule.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film as FilmEntity } from '../films/entities/film.entity';
import { Schedule as ScheduleEntity } from '../films/entities/schedule.entity';
import { MongodbFilmsRepository } from 'src/repository/mongodb.films.repository';
import { TypeOrmFilmsRepository } from 'src/repository/typeorm.films.repository';

import * as dotenv from 'dotenv';
import * as path from 'path';
import { FilmsRepository } from 'src/repository/films.repository.interface';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const databaseDriver = process.env.DATABASE_DRIVER;

let dbFeatureModule: DynamicModule;
let filmsRepositoryProvider: Provider<FilmsRepository>;

switch (databaseDriver) {
  case 'mongodb':
    dbFeatureModule = MongooseModule.forFeature([
      { name: Film.name, schema: FilmSchema },
      { name: Schedule.name, schema: ScheduleSchema },
    ]);
    filmsRepositoryProvider = {
      provide: 'FilmsRepository',
      useClass: MongodbFilmsRepository,
    };
    break;

  case 'postgres':
    dbFeatureModule = TypeOrmModule.forFeature([FilmEntity, ScheduleEntity]);
    filmsRepositoryProvider = {
      provide: 'FilmsRepository',
      useClass: TypeOrmFilmsRepository,
    };
    break;

  default:
    throw new Error(
      `Unsupported DATABASE_DRIVER: "${databaseDriver}". Supported: "mongodb", "postgres".`,
    );
}

@Module({
  imports: [dbFeatureModule],
  controllers: [FilmsController],
  providers: [FilmsService, filmsRepositoryProvider],
})
export class FilmsModule {}
