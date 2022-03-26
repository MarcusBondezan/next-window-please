import { Test, TestingModule } from '@nestjs/testing';
import { Account, Customer } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AccountService } from './account.service';
import { CustomerFacade } from '../customer/customer.facade';
import {
  CustomerNotFoundException,
  AccountNotFoundException,
} from '../shared/exception';
import { CreateAccountInputDto } from './dto/create-account-input.dto';

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
    const createAccountInputDto = new CreateAccountInputDto(10, 38.0);
    await expect(
      accountService.createAccount(createAccountInputDto),
    ).rejects.toBeInstanceOf(CustomerNotFoundException);
  });

  it('should create an account if customer exists', async () => {
    const customer: Customer = {
      id: 1,
      name: 'John',
    };

    const createAccountInputDto = new CreateAccountInputDto(customer.id, 38.0);

    const newAccount: Account = {
      id: 1,
      customerId: customer.id,
      balance: createAccountInputDto.initialDepositAmount,
      createdAt: new Date(),
    };

    mockCustomerFacade.getCustomerById = jest.fn().mockReturnValue(customer);
    prisma.account.create = jest.fn().mockReturnValueOnce(newAccount);

    await accountService.createAccount(createAccountInputDto);

    expect(prisma.account.create).toBeCalled();
  });

  it('should throw a NotFoundException when trying to get balance of an inexistent account', async () => {
    prisma.account.findUnique = jest.fn().mockReturnValueOnce(null);

    await expect(accountService.getAccountBalance(1)).rejects.toBeInstanceOf(
      AccountNotFoundException,
    );
  });
});
