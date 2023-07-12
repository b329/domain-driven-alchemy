import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { AlchemyEntity } from './domain/alchemy.entity';
import { AlchemyModel, alchemySchema } from './database/alchemy.repository';
import { Address } from '@modules/alchemy/domain/value-objects/address.value-object';
import { AlchemyResponseDto } from '@modules/alchemy/dtos/alchemy.response.dto';

@Injectable()
export class AlchemyMapper
  implements Mapper<AlchemyEntity, AlchemyModel, AlchemyResponseDto>
{
  toPersistence(entity: AlchemyEntity): AlchemyModel {
    const copy = entity.getProps();
    const record: AlchemyModel = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      email: copy.email,
      country: copy.address.country,
      postalCode: copy.address.postalCode,
      street: copy.address.street,
      role: copy.role,
    };
    return alchemySchema.parse(record);
  }

  toDomain(record: AlchemyModel): AlchemyEntity {
    const entity = new AlchemyEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        userId: '',
        balance: 0,
        email: record.email,
        role: record.role,
        address: new Address({
          street: record.street,
          postalCode: record.postalCode,
          country: record.country,
        }),
      },
    });
    return entity;
  }

  toResponse(entity: AlchemyEntity): AlchemyResponseDto {
    const props = entity.getProps();
    const response = new AlchemyResponseDto(entity);
    response.email = props.email;
    response.country = props.address.country;
    response.postalCode = props.address.postalCode;
    response.street = props.address.street;
    return response;
  }
}
