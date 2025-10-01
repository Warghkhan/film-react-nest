import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Film, FilmSchema } from '../films/schemas/film.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from 'src/films/entities/schedule.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
    TypeOrmModule.forFeature([Schedule])
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}