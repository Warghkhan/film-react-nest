import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film } from './schemas/film.schema';
import { Schedule } from './schemas/schedule.schema';
import { FilmsRepository } from 'src/repository/films.repository.interface';
import { ConfigService } from '@nestjs/config';
import { MongodbFilmsRepository } from 'src/repository/mongodb.films.repository';
import { TypeOrmFilmsRepository } from 'src/repository/typeorm.films.repository';
import { FilmDto } from './dto/films.dto';
import { ScheduleDto } from './dto/schedule.dto';


@Injectable()
export class FilmsService implements OnModuleInit {
  private repository: FilmsRepository;

  constructor(
    private configService: ConfigService,
    private mongodbRepo: MongodbFilmsRepository,
    private typeormRepo: TypeOrmFilmsRepository,
  ) {}

  onModuleInit() {
    const driver = this.configService.get<string>('DATABASE_DRIVER');
    this.repository = driver === 'postgres' ? this.typeormRepo : this.mongodbRepo;
  }

  async getAll(): Promise<FilmDto[]> {
    return this.repository.findAll();
  }

  async getById(id: string): Promise<FilmDto> {
    const film = await this.repository.findById(id);
    if (!film) throw new NotFoundException(`Film with ID ${id} not found`);
    return film;
  }

  async getSchedule(id: string): Promise<ScheduleDto[]> {
    // Проверим, существует ли фильм (для единообразия с MongoDB)
    const film = await this.repository.findById(id);
    if (!film) throw new NotFoundException(`Film with ID ${id} not found`);

    return this.repository.findScheduleByFilmId(id);
  }
}


/*
@Injectable()
export class FilmsService {
  constructor(@InjectModel(Film.name) private filmModel: Model<Film>) {}

  async getAll(): Promise<Film[]> {
    return this.filmModel.find().exec();
  }

  async getById(id: string): Promise<Film> {
    const film = await this.filmModel.findOne({ id }).exec();
    if (!film) {
      throw new NotFoundException(`Film with ID ${id} not found`);
    }
    return film;
  }

  async getSchedule(id: string): Promise<Schedule[]> {
    const film = await this.filmModel.findOne({ id }, 'schedule').exec();
    if (!film) {
      throw new NotFoundException(`Film with ID ${id} not found`);
    }
     
    return (film.schedule as Schedule[]) || [];
  }
}
  */