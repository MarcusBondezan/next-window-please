import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber } from 'class-validator';

export class TransferInputDto {
  @ApiProperty()
  @IsInt()
  sourceAccountId: number;
  @ApiProperty()
  @IsInt()
  targetAccountId: number;
  @ApiProperty()
  @IsNumber()
  amount: number;
}
