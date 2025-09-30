/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CountService } from '../service/count.service';
import { CountController } from './count.controller';

describe('CountController', () => {
  let countController: CountController;
  let countService: CountService;

  beforeEach(async () => {
    // Create a mock of CountService
    const mockCountService = {
      getHello: jest.fn().mockReturnValue('countFromController: 1'),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountController],
      providers: [
        {
          provide: CountService,
          useValue: mockCountService,
        },
      ],
    }).compile();

    countController = module.get<CountController>(CountController);
    countService = module.get<CountService>(CountService);
  });

  it('should be defined', () => {
    expect(countController).toBeDefined();
  });

  it('should return the count from controller', () => {
    // Call the controller method
    const result = countController.getHello(1);

    // Verify the result
    expect(result).toBe('countFromController: 1');

    // Verify that the service method was called with the correct parameter
    expect(countService.getHello).toHaveBeenCalledWith(1);
  });

});
