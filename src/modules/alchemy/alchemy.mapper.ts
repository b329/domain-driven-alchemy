import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { AlchemyEntity } from './domain/alchemy.entity';
import { AlchemyModel, alchemySchema } from './database/alchemy.repository';

@Injectable()
export class AlchemyMapper implements Mapper<AlchemyEntity, AlchemyModel> {
  toPersistence(entity: AlchemyEntity): AlchemyModel {
    const copy = entity.getProps();
    const record: AlchemyModel = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      userId: copy.userId,
      balance: copy.balance,
    };
    return alchemySchema.parse(record);
  }

  toDomain(record: AlchemyModel): AlchemyEntity {
    const entity = new AlchemyEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        userId: record.userId,
        balance: record.balance,
      },
    });
    return entity;
  }

  toResponse(): any {
    throw new Error('Not implemented');
  }
}
