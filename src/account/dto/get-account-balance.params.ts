import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class GetAccountBalanceParams {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiProperty()
  accountId: number;
}
