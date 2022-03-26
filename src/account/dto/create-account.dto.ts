import { IsInt, IsNumber, Min } from 'class-validator';

export class CreateAccountDto {
  @IsInt()
  @Min(1)
  customerId: number;

  @IsNumber()
  initialDepositAmount: number;

  constructor(customerId: number, initialDepositAmount: number) {
    this.customerId = customerId;
    this.initialDepositAmount = initialDepositAmount;
  }
}
