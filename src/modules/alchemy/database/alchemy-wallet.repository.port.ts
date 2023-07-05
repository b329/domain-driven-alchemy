import { RepositoryPort } from '@libs/ddd';
import { AlchemyWalletEntity } from '../domain/alchemy-wallet.entity';

export type AlchemyWalletRepositoryPort = RepositoryPort<AlchemyWalletEntity>;
