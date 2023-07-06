import { ExceptionBase } from '@libs/exceptions';

export class AlchemyWalletNotEnoughBalanceError extends ExceptionBase {
  static readonly message = 'Alchemy Wallet has not enough balance';

  public readonly code = 'ALCHEMY_WALLET.NOT_ENOUGH_BALANCE';

  constructor(metadata?: unknown) {
    super(AlchemyWalletNotEnoughBalanceError.message, undefined, metadata);
  }
}
