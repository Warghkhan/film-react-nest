import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItemDto, OrderResponseDto } from './dto/order.dto';
import { Schedule } from '../films/entities/schedule.entity';
import { v4 as uuidv4 } from 'uuid';
import { OrderStorage } from './order.service';

@Injectable()
export class PostgresOrderStorage implements OrderStorage {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async createOrder(tickets: OrderItemDto[]) {
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
