import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FilmsRepository } from 'src/repository/films.repository.interface';
import { FilmDto } from './dto/films.dto';
import { ScheduleDto } from './dto/schedule.dto';

@Injectable()
export class FilmsService {
  constructor(
    @Inject('FilmsRepository') private readonly repository: FilmsRepository,
  ) {}

  async getAll(): Promise<FilmDto[]> {
    return this.repository.findAll();
  }

  async getById(id: string): Promise<FilmDto> {
    const film = await this.repository.findById(id);
    if (!film) throw new NotFoundException(`Film with ID ${id} not found`);
    return film;
  }

  async getSchedule(id: string): Promise<ScheduleDto[]> {
    const film = await this.repository.findById(id);
    if (!film) throw new NotFoundException(`Film with ID ${id} not found`);
    return this.repository.findScheduleByFilmId(id);
  }
}
