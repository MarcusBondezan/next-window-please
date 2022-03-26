import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class TransferHistoryParams {
  @Type(() => Number)
  @IsInt()
  @ApiProperty()
  accountId: number;
}
