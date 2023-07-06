import { RepositoryPort } from '@libs/ddd';
import { AlchemyWalletEntity } from '../domain/alchemy-wallet.entity';

export type AlchemyRepositoryPort = RepositoryPort<AlchemyWalletEntity>;
