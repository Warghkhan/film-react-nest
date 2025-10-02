import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderItemDto, OrderResponseDto } from './dto/order.dto';
import { Film } from '../films/schemas/film.schema';
import { v4 as uuidv4 } from 'uuid';
import { OrderStorage } from './order.service';

@Injectable()
export class MongoOrderStorage implements OrderStorage {
  constructor(@InjectModel(Film.name) private filmModel: Model<Film>) {}

  async createOrder(tickets: OrderItemDto[]) {
    const result: OrderResponseDto[] = [];
    for (const ticket of tickets) {
      const { film, session, row, seat } = ticket;
      const seatKey = `${row}:${seat}`;

      const filmDoc = await this.filmModel.findOne({ id: film });
      if (!filmDoc) throw new NotFoundException(`Film ${film} not found`);

      const schedule = filmDoc.schedule.find((s) => s.id === session);
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
}
