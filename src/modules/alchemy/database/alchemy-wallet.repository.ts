import { InjectPool } from 'nestjs-slonik';
import { DatabasePool, sql } from 'slonik';
import { z } from 'zod';
import { SqlRepositoryBase } from '@src/libs/db/sql-repository.base';
import { AlchemyWalletRepositoryPort } from './alchemy-wallet.repository.port';
import { AlchemyWalletEntity } from '../domain/alchemy-wallet.entity';
import { AlchemyWalletMapper } from '../alchemy-wallet.mapper';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

export const alchemyWalletSchema = z.object({
  id: z.string().min(1).max(255),
  createdAt: z.preprocess((val: any) => new Date(val), z.date()),
  updatedAt: z.preprocess((val: any) => new Date(val), z.date()),
  balance: z.number().min(0).max(9999999),
  userId: z.string().min(1).max(255),
});

export type AlchemyWalletModel = z.TypeOf<typeof alchemyWalletSchema>;

@Injectable()
export class AlchemyWalletRepository
  extends SqlRepositoryBase<AlchemyWalletEntity, AlchemyWalletModel>
  implements AlchemyWalletRepositoryPort
{
  protected tableName = 'alchemy_wallets';

  protected schema = alchemyWalletSchema;

  constructor(
    @InjectPool()
    pool: DatabasePool,
    mapper: AlchemyWalletMapper,
    eventEmitter: EventEmitter2,
  ) {
    super(pool, mapper, eventEmitter, new Logger(AlchemyWalletRepository.name));
  }

  async findOneByUserId(userId: string): Promise<AlchemyWalletEntity> {
    const alchemy = await this.pool.one(
      sql.type(
        alchemyWalletSchema,
      )`SELECT * FROM "alchemy_wallets" WHERE userId = ${userId}`,
    );

    return this.mapper.toDomain(alchemy);
  }
}
