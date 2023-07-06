import { RepositoryPort } from '@libs/ddd';
import { AlchemyWalletEntity } from '../domain/alchemy-wallet.entity';

export interface AlchemyWalletRepositoryPort
  extends RepositoryPort<AlchemyWalletEntity> {
  findOneByUserId(userId: string): Promise<AlchemyWalletEntity | null>;
}
