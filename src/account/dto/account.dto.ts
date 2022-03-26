import { Account } from '@prisma/client';

export class AccountDto {
  customerId: number;
  balance: number;
  createdAt: Date;

  static fromAccount(account: Account): AccountDto {
    const dto = new AccountDto();
    dto.customerId = account.customerId;
    dto.balance = account.balance;
    dto.createdAt = account.createdAt;

    return dto;
  }
}
