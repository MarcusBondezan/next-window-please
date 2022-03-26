import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Min } from 'class-validator';

export class CreateAccountDto {
  @IsInt()
  @Min(1)
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
