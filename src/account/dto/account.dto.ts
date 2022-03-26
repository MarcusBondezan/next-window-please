import { ApiProperty } from '@nestjs/swagger';
import { Account } from '@prisma/client';

export class AccountDto {
  @ApiProperty()
  customerId: number;
  @ApiProperty()
  balance: number;
  @ApiProperty()
  createdAt: Date;

  static fromAccount(account: Account): AccountDto {
    const dto = new AccountDto();
    dto.customerId = account.customerId;
    dto.balance = account.balance;

    return dto;
  }
}
