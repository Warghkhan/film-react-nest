import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmDto } from './dto/films.dto';
import { ScheduleDto } from './dto/schedule.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getFilms() {
    const items = await this.filmsService.getAll();
    return { total: items.length, items };
  }

  @Get(':id/schedule')
  async getSchedule(@Param('id') id: string) {
    const items = await this.filmsService.getSchedule(id);
    return { total: items.length, items };
  }
}
