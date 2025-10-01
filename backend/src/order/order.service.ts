import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { OrderItemDto, OrderResponseDto } from './dto/order.dto';
import { Film } from '../films/schemas/film.schema';
import { Schedule as MongoSchedule } from '../films/schemas/schedule.schema';
import { Schedule as PostgresSchedule } from '../films/entities/schedule.entity';

@Injectable()
export class OrderService {
  private readonly isPostgres: boolean;

  constructor(
    @InjectModel(Film.name) private filmModel: Model<Film>,
    @InjectRepository(PostgresSchedule)
    private scheduleRepository: Repository<PostgresSchedule>,
    private configService: ConfigService,
  ) {
    this.isPostgres =
      this.configService.get<string>('DATABASE_DRIVER') === 'postgres';
  }

  async createOrder(
    tickets: OrderItemDto[],
  ): Promise<{ total: number; items: OrderResponseDto[] }> {
    if (this.isPostgres) {
      return this.createOrderPostgres(tickets);
    }
    return this.createOrderMongo(tickets);
  }

  // === MongoDB версия ===
  private async createOrderMongo(
    tickets: OrderItemDto[],
  ): Promise<{ total: number; items: OrderResponseDto[] }> {
    const result: OrderResponseDto[] = [];

    for (const ticket of tickets) {
      const { film, session, row, seat } = ticket;
      const seatKey = `${row}:${seat}`;

      const filmDoc = await this.filmModel.findOne({ id: film });
      if (!filmDoc) throw new NotFoundException(`Film ${film} not found`);

      const schedule = filmDoc.schedule.find(
        (s) => s.id === session,
      ) as MongoSchedule;
      if (!schedule)
        throw new NotFoundException(`Session ${session} not found`);

      if (schedule.taken.includes(seatKey)) {
        throw new BadRequestException(`Seat ${seatKey} is already taken`);
      }

      schedule.taken.push(seatKey);
      filmDoc.markModified('schedule');
      await filmDoc.save();

      result.push({ ...ticket, id: uuidv4() });
    }

    return { total: result.length, items: result };
  }

  // === PostgreSQL версия ===
  private async createOrderPostgres(
    tickets: OrderItemDto[],
  ): Promise<{ total: number; items: OrderResponseDto[] }> {
    const result: OrderResponseDto[] = [];

    for (const ticket of tickets) {
      const { session, row, seat } = ticket;
      const seatKey = `${row}:${seat}`;

      const schedule = await this.scheduleRepository.findOneBy({ id: session });
      if (!schedule)
        throw new NotFoundException(`Session ${session} not found`);

      if (schedule.taken.includes(seatKey)) {
        throw new BadRequestException(`Seat ${seatKey} is already taken`);
      }

      schedule.taken.push(seatKey);
      await this.scheduleRepository.save(schedule);

      result.push({ ...ticket, id: uuidv4() });
    }

    return { total: result.length, items: result };
  }
}
