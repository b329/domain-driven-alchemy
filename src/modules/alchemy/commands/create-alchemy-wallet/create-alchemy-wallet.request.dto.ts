import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAlchemyWalletRequestDto {
  @ApiProperty({
    example: '195c8b99-34ac-4c7a-b43e-18dfaf0d4e56',
    description: 'User Id',
  })
  @MaxLength(320)
  @MinLength(5)
  @IsEmail()
  readonly userId: string;
}
