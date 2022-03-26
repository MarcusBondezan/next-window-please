import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Account, Customer } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CustomerFacade } from '../../customer/customer.facade';
import { AccountService } from '../account.service';
import { CreateAccountDto } from '../dto/create-account.dto';

describe('AccountService', () => {
  let accountService: AccountService;
  let prisma: PrismaService;

  const mockCustomerFacade = {
    getCustomerById: jest.fn().mockReturnValue(null),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, AccountService, CustomerFacade],
    })
      .overrideProvider(CustomerFacade)
      .useValue(mockCustomerFacade)
      .compile();

    accountService = module.get<AccountService>(AccountService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should throw a NotFoundException if trying to create account with inexistent customer', async () => {
    const createAccountDto = new CreateAccountDto(10, 38.0);
    await expect(
      accountService.createAccount(createAccountDto),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should create an account if customer exists', async () => {
    const customer: Customer = {
      id: 1,
      name: 'John',
    };

    const createAccountDto = new CreateAccountDto(customer.id, 38.0);

    const newAccount: Account = {
      id: 1,
      customerId: customer.id,
      balance: createAccountDto.initialDepositAmount,
      createdAt: new Date(),
    };

    mockCustomerFacade.getCustomerById = jest.fn().mockReturnValue(customer);
    prisma.account.create = jest.fn().mockReturnValueOnce(newAccount);

    await accountService.createAccount(createAccountDto);

    expect(prisma.account.create).toBeCalled();
  });

  it('should throw a NotFoundException when trying to get balance of an inexistent account', async () => {
    prisma.account.findUnique = jest.fn().mockReturnValueOnce(null);

    await expect(accountService.getAccountBalance(1)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
