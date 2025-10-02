export class OrderItemDto {
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
}

export class OrderResponseDto extends OrderItemDto {
  id: string;
}

export class CreateOrderDto {
  email: string;
  phone: string;
  tickets: OrderItemDto[];
}
