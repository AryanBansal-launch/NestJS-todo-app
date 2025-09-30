import { Test, TestingModule } from '@nestjs/testing';
import { CountService } from './count.service';

describe('ConutService', () => {
  let countService: CountService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CountService],
    }).compile();
    countService = module.get<CountService>(CountService);
  });
  it('should be defined', () => {
    expect(countService).toBeDefined();
  });
  it('should return the count from service', () => {
    const count = countService.getHello(1);
    expect(count).toBe('countFromController: 1');
  });
});
