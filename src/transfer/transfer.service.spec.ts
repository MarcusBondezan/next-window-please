import { Test, TestingModule } from '@nestjs/testing';
import { Account, Transfer } from '@prisma/client';
import { AccountWithCustomer, PrismaService } from '../prisma/prisma.service';
import { AccountFacade } from '../account/account.facade';
import { TransferService } from './transfer.service';
import {
  SameSourceAndTargetAccountException,
  TooLowTransferAmountException,
  SourceAccountNotFoundException,
  InsufficientBalanceException,
  TargetAccountNotFoundException,
} from './exception';
import { TransferInputDto } from './dto/transfer-input.dto';

describe('TransferService', () => {
  let transferService: TransferService;
  let prisma: PrismaService;

  const mockAccountFacade = {
    getAccountById: jest.fn().mockReturnValue(null),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, TransferService, AccountFacade],
    })
      .overrideProvider(AccountFacade)
      .useValue(mockAccountFacade)
      .compile();

    transferService = module.get<TransferService>(TransferService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should throw a SameSourceAndTargetAccountException if source and target accounts are the same', async () => {
    const transferInputDto: TransferInputDto = {
      sourceAccountId: 1,
      targetAccountId: 1,
      amount: 500,
    };

    await expect(
      transferService.transfer(transferInputDto),
    ).rejects.toBeInstanceOf(SameSourceAndTargetAccountException);
  });

  it('should throw a TooLowTransferAmountException if amount to be transfered is less than minimun accepted by the bank', async () => {
    const transferInputDto: TransferInputDto = {
      sourceAccountId: 1,
      targetAccountId: 2,
      amount: 0.5,
    };

    await expect(
      transferService.transfer(transferInputDto),
    ).rejects.toBeInstanceOf(TooLowTransferAmountException);
  });

  it('should throw an SourceAccoutNotFoundException if source account does not exist', async () => {
    const transferInputDto: TransferInputDto = {
      sourceAccountId: 99,
      targetAccountId: 2,
      amount: 5,
    };

    await expect(
      transferService.transfer(transferInputDto),
    ).rejects.toBeInstanceOf(SourceAccountNotFoundException);
  });

  it('should throw an InsufficientBalanceException if source account does not have enough money to be transferred', async () => {
    const transferInputDto: TransferInputDto = {
      sourceAccountId: 1,
      targetAccountId: 2,
      amount: 500,
    };

    const sourceAccount: Account = {
      id: transferInputDto.sourceAccountId,
      customerId: 1,
      balance: 10,
      createdAt: new Date(),
    };

    mockAccountFacade.getAccountById = jest.fn().mockReturnValue(sourceAccount);

    await expect(
      transferService.transfer(transferInputDto),
    ).rejects.toBeInstanceOf(InsufficientBalanceException);
  });

  it('should throw an TargetAccoutNotFoundException if target account does not exist', async () => {
    const transferInputDto: TransferInputDto = {
      sourceAccountId: 99,
      targetAccountId: 2,
      amount: 5,
    };

    const sourceAccount: Account = {
      id: transferInputDto.sourceAccountId,
      customerId: 1,
      balance: 10,
      createdAt: new Date(),
    };

    mockAccountFacade.getAccountById = jest
      .fn()
      .mockReturnValueOnce(sourceAccount)
      .mockReturnValueOnce(null);

    await expect(
      transferService.transfer(transferInputDto),
    ).rejects.toBeInstanceOf(TargetAccountNotFoundException);
  });

  it('should substract the amount from source account balance and add it to the target account ', async () => {
    const transferInputDto: TransferInputDto = {
      sourceAccountId: 99,
      targetAccountId: 2,
      amount: 5,
    };

    const sourceAccount: Account = {
      id: transferInputDto.sourceAccountId,
      customerId: 1,
      balance: 10,
      createdAt: new Date(),
    };

    const targetAccount: Account = {
      id: transferInputDto.targetAccountId,
      customerId: 2,
      balance: 30,
      createdAt: new Date(),
    };

    mockAccountFacade.getAccountById = jest
      .fn()
      .mockReturnValueOnce(sourceAccount)
      .mockReturnValueOnce(targetAccount);

    const transfer: Transfer = {
      id: 1,
      sourceAccountId: sourceAccount.id,
      targetAccountId: targetAccount.id,
      amount: transferInputDto.amount,
      createdAt: new Date(),
    };

    const updatedSourceAccount: Account = {
      id: transferInputDto.sourceAccountId,
      customerId: 1,
      balance: 5,
      createdAt: new Date(),
    };

    const updatedTargetAccount: AccountWithCustomer = {
      id: transferInputDto.targetAccountId,
      customerId: 2,
      balance: 25,
      createdAt: new Date(),
      customer: {
        id: 2,
        name: 'José',
      },
    };

    prisma.$transaction = jest
      .fn()
      .mockReturnValueOnce([
        updatedSourceAccount,
        updatedTargetAccount,
        transfer,
      ]);

    await transferService.transfer(transferInputDto);
  });
});
