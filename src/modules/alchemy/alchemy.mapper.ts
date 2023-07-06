import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { AlchemyWalletEntity } from './domain/alchemy-wallet.entity';
import {
  AlchemyWalletModel,
  alchemyWalletSchema,
} from './database/alchemy.repository';

@Injectable()
export class AlchemyMapper
  implements Mapper<AlchemyWalletEntity, AlchemyWalletModel>
{
  toPersistence(entity: AlchemyWalletEntity): AlchemyWalletModel {
    const copy = entity.getProps();
    const record: AlchemyWalletModel = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      userId: copy.userId,
      balance: copy.balance,
    };
    return alchemyWalletSchema.parse(record);
  }

  toDomain(record: AlchemyWalletModel): AlchemyWalletEntity {
    const entity = new AlchemyWalletEntity({
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
