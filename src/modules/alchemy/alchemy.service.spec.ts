import { Test, TestingModule } from '@nestjs/testing';
import { AlchemyApiService } from './alchemy.service';

describe('AlchemyApiService', () => {
  let service: AlchemyApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlchemyApiService],
    }).compile();

    service = module.get<AlchemyApiService>(AlchemyApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
