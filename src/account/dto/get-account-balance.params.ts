import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class GetAccountBalanceParams {
  @Type(() => Number)
  @IsInt()
  @ApiProperty()
  accountId: number;
}
