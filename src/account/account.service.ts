import { Injectable } from '@nestjs/common';
import { Account } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CustomerFacade } from '../customer/customer.facade';
import { CreateAccountInputDto } from './dto/create-account-input.dto';
import {
  AccountNotFoundException,
  CustomerNotFoundException,
} from '../shared/exception';

@Injectable()
export class AccountService {
  constructor(
    private prisma: PrismaService,
    private customerFacade: CustomerFacade,
  ) {}

  async createAccount(
    createAccountInputDto: CreateAccountInputDto,
  ): Promise<Account> {
    const customer = await this.customerFacade.getCustomerById(
      createAccountInputDto.customerId,
    );

    if (!customer) {
      throw new CustomerNotFoundException();
    }

    const newAccount = await this.prisma.account.create({
      data: {
        customerId: customer.id,
        balance: createAccountInputDto.initialDepositAmount,
      },
      include: { customer: true },
    });

    return newAccount;
  }

  async getAccountBalance(accountId: number): Promise<Account> {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new AccountNotFoundException();
    }

    return account;
  }

  async getAccountById(accountId: number): Promise<Account> {
    return this.prisma.account.findUnique({ where: { id: accountId } });
  }
}
