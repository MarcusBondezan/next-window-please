import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber } from 'class-validator';

export class CreateAccountInputDto {
  @IsInt()
  @ApiProperty()
  customerId: number;

  @IsNumber()
  @ApiProperty()
  initialDepositAmount: number;

  constructor(customerId: number, initialDepositAmount: number) {
    this.customerId = customerId;
    this.initialDepositAmount = initialDepositAmount;
  }
}
