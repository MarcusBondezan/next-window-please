import { Injectable, NotFoundException } from '@nestjs/common';
import { Account } from '@prisma/client';
import { CustomerFacade } from 'src/customer/customer.facade';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountService {
  constructor(
    private prisma: PrismaService,
    private customerFacade: CustomerFacade,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    
    const customer = await this.customerFacade.getCustomerById(createAccountDto.customerId);
    console.log({customer});

    if(!customer){
      throw new NotFoundException('Customer not found');
    }

    const newAccount = await this.prisma.account.create({
      data: {
        customerId: customer.id,
        balance: createAccountDto.initialDepositAmount
      },
      include: { customer: true }
    });

    return newAccount;
  }
}
