import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film } from '../films/schemas/film.schema';
import { FilmsRepository } from './films.repository.interface';
import { FilmDto } from '../films/dto/films.dto';
import { ScheduleDto } from '../films/dto/schedule.dto';

@Injectable()
export class MongodbFilmsRepository implements FilmsRepository {
  constructor(@InjectModel(Film.name) private filmModel: Model<Film>) {}

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmModel.find().exec();
    return films.map((f) => this.mapFilmToDto(f));
  }

  async findById(id: string): Promise<FilmDto | null> {
    const film = await this.filmModel.findOne({ id }).exec();
    return film ? this.mapFilmToDto(film) : null;
  }

  async findScheduleByFilmId(id: string): Promise<ScheduleDto[]> {
    const film = await this.filmModel.findOne({ id }, 'schedule').exec();
    if (!film || !film.schedule) return [];
    return film.schedule.map((s) => ({
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
