import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Film.name, schema: FilmSchema },
      { name: Schedule.name, schema: ScheduleSchema },
    ]),
    TypeOrmModule.forFeature([FilmEntity, ScheduleEntity]),
  ],
  controllers: [FilmsController],
  providers: [
    FilmsService,
    MongodbFilmsRepository,
    TypeOrmFilmsRepository,
  ],
})
export class FilmsModule {}