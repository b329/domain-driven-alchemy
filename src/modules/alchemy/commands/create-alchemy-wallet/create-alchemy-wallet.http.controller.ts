import {
  Body,
  ConflictException as ConflictHttpException,
  Controller,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { routesV1 } from '@config/app.routes';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { match, Result } from 'oxide.ts';
import { CreateAlchemyWalletCommand } from './create-alchemy-wallet.command';
import { CreateAlchemyWalletRequestDto } from './create-alchemy-wallet.request.dto';
import { UserAlreadyExistsError } from '@modules/user/domain/user.errors';
import { IdResponse } from '@libs/api/id.response.dto';
import { AggregateID } from '@libs/ddd';
import { ApiErrorResponse } from '@src/libs/api/api-error.response';

@Controller(routesV1.version)
export class CreateAlchemyWalletHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Create an Alchemy Wallet' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: IdResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: UserAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @Post(routesV1.alchemyWallet.root)
  async create(
    @Body() body: CreateAlchemyWalletRequestDto,
  ): Promise<IdResponse> {
    const command = new CreateAlchemyWalletCommand(body);

    const result: Result<AggregateID, UserAlreadyExistsError> =
      await this.commandBus.execute(command);

    // Deciding what to do with a Result (similar to Rust matching)
    // if Ok we return a response with an id
    // if Error decide what to do with it depending on its type
    return match(result, {
      Ok: (id: string) => new IdResponse(id),
      Err: (error: Error) => {
        if (error instanceof UserAlreadyExistsError)
          throw new ConflictHttpException(error.message);
        throw error;
      },
    });
  }
}
