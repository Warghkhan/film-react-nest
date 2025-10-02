import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from '../films/schemas/film.schema';
import { FilmsRepository } from './films.repository.interface';
import { FilmDto } from '../films/dto/films.dto';
import { Schedule } from 'src/films/entities/schedule.entity';
import { ScheduleDto } from 'src/films/dto/schedule.dto';

@Injectable()
export class TypeOrmFilmsRepository implements FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmRepository.find();
    return films.map((f) => this.mapFilmToDto(f));
  }

  async findById(id: string): Promise<FilmDto | null> {
    const film = await this.filmRepository.findOneBy({ id });
    return film ? this.mapFilmToDto(film) : null;
  }

  async findScheduleByFilmId(id: string): Promise<ScheduleDto[]> {
    const filmExists = await this.filmRepository.exist({ where: { id } });
    if (!filmExists) return [];

    const schedules = await this.scheduleRepository.find({
      where: { film: { id } },
    });
    return schedules.map((s) => ({
      id: s.id,
      daytime: s.daytime,
      hall: s.hall,
      rows: s.rows,
      seats: s.seats,
      price: s.price,
      taken: s.taken || [],
    }));
  }

  private mapFilmToDto(film: Film): FilmDto {
    return {
      id: film.id,
      title: film.title,
      director: film.director,
      rating: film.rating,
      tags: film.tags || [],
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    };
  }
}
