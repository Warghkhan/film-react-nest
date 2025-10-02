import { Injectable, Inject } from '@nestjs/common';
import { OrderItemDto, OrderResponseDto } from './dto/order.dto';

export interface OrderStorage {
  createOrder(
    tickets: OrderItemDto[],
  ): Promise<{ total: number; items: OrderResponseDto[] }>;
}

@Injectable()
export class OrderService {
  constructor(@Inject('OrderStorage') private orderStorage: OrderStorage) {}

  async createOrder(tickets: OrderItemDto[]) {
    return this.orderStorage.createOrder(tickets);
  }
}
