import { Injectable } from '@nestjs/common';
import { Account } from '@prisma/client';
import { AccountService } from './account.service';

@Injectable()
export class AccountFacade {
  constructor(private readonly accountService: AccountService) {}

  public async getAccountById(accountId: number): Promise<Account> {
    return this.accountService.getAccountById(accountId);
  }
}
