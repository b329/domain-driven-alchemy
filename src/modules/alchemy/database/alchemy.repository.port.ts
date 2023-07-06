import { RepositoryPort } from '@libs/ddd';
import { AlchemyEntity } from '../domain/alchemy.entity';

export type AlchemyRepositoryPort = RepositoryPort<AlchemyEntity>;
