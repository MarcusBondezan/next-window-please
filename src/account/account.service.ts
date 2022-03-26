import { Injectable, NotFoundException } from '@nestjs/common';
import { Account } from '@prisma/client';
import { CustomerFacade } from '../customer/customer.facade';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountService {
  constructor(
    private prisma: PrismaService,
    private customerFacade: CustomerFacade,
  ) {}

  async createAccount(createAccountDto: CreateAccountDto): Promise<Account> {
    const customer = await this.customerFacade.getCustomerById(
      createAccountDto.customerId,
    );

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const newAccount = await this.prisma.account.create({
      data: {
        customerId: customer.id,
        balance: createAccountDto.initialDepositAmount,
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
      throw new NotFoundException('Account not found');
    }

    return account;
  }
}
