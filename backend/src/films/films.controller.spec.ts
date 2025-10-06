import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

const mockFilmsService = {
  getAll: jest.fn(),
  getSchedule: jest.fn(),
};

describe('FilmsController', () => {
  let controller: FilmsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getFilms', () => {
    it('should return all films with total count', async () => {
      const mockFilms = [
        { id: '1', title: 'Film 1' },
        { id: '2', title: 'Film 2' },
      ];
      mockFilmsService.getAll.mockResolvedValue(mockFilms);

      const result = await controller.getFilms();

      expect(result).toEqual({
        total: 2,
        items: mockFilms,
      });
      expect(mockFilmsService.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getSchedule', () => {
    it('should return schedule for a film by id', async () => {
      const mockSchedule = [{ id: 's1', time: '18:00' }];
      mockFilmsService.getSchedule.mockResolvedValue(mockSchedule);

      const result = await controller.getSchedule('123');

      expect(result).toEqual({
        total: 1,
        items: mockSchedule,
      });
      expect(mockFilmsService.getSchedule).toHaveBeenCalledWith('123');
    });
  });
});
