import { InjectPool } from 'nestjs-slonik';
import { DatabasePool, sql } from 'slonik';
import { z } from 'zod';
import { SqlRepositoryBase } from '@src/libs/db/sql-repository.base';
import { AlchemyRepositoryPort } from './alchemy.repository.port';
import { AlchemyEntity } from '../domain/alchemy.entity';
import { AlchemyMapper } from '../alchemy.mapper';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AlchemyRoles } from '@modules/alchemy/domain/alchemy.types';

export const alchemySchema = z.object({
  id: z.string().uuid(),
  createdAt: z.preprocess((val: any) => new Date(val), z.date()),
  updatedAt: z.preprocess((val: any) => new Date(val), z.date()),
  email: z.string().email(),
  country: z.string().min(1).max(255),
  postalCode: z.string().min(1).max(20),
  street: z.string().min(1).max(255),
  role: z.nativeEnum(AlchemyRoles),
});

export type AlchemyModel = z.TypeOf<typeof alchemySchema>;

@Injectable()
export class AlchemyRepository
  extends SqlRepositoryBase<AlchemyEntity, AlchemyModel>
  implements AlchemyRepositoryPort
{
  protected tableName = 'alchemy';

  protected schema = alchemySchema;

  constructor(
    @InjectPool()
    pool: DatabasePool,
    mapper: AlchemyMapper,
    eventEmitter: EventEmitter2,
  ) {
    super(pool, mapper, eventEmitter, new Logger(AlchemyRepository.name));
  }

  async findOneByUserId(userId: string): Promise<AlchemyEntity> {
    const alchemy = await this.pool.one(
      sql.type(alchemySchema)`SELECT * FROM "alchemy" WHERE userId = ${userId}`,
    );

    return this.mapper.toDomain(alchemy);
  }
}
