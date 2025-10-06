import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import {
  CreateOrderDto,
  OrderResponseDto,
  OrderItemDto,
} from './dto/order.dto';

const mockOrderService = {
  createOrder: jest.fn(),
};

describe('OrderController', () => {
  let controller: OrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create an order and return total and items', async () => {
      const mockTickets: OrderItemDto[] = [
        {
          film: 'Avengers',
          session: 'sess-1',
          daytime: '2025-04-06T18:00:00',
          row: 5,
          seat: 10,
          price: 300,
        },
        {
          film: 'Spider-Man',
          session: 'sess-2',
          daytime: '2025-04-06T21:00:00',
          row: 3,
          seat: 7,
          price: 250,
        },
      ];

      const mockOrderResponse: OrderResponseDto[] = [
        {
          id: 'ticket-1',
          ...mockTickets[0],
        },
        {
          id: 'ticket-2',
          ...mockTickets[1],
        },
      ];

      mockOrderService.createOrder.mockResolvedValue({
        total: 2,
        items: mockOrderResponse,
      });

      const body: CreateOrderDto = {
        email: 'user@example.com',
        phone: '+71234567890',
        tickets: mockTickets,
      };

      const result = await controller.createOrder(body);

      expect(result).toEqual({
        total: 2,
        items: mockOrderResponse,
      });

      expect(mockOrderService.createOrder).toHaveBeenCalledWith(mockTickets);
    });
  });
});
