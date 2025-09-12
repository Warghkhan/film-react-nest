import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film } from './schemas/film.schema';
import { Schedule } from './schemas/schedule.schema';

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