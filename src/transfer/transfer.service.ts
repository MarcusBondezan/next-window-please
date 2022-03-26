import { Injectable } from '@nestjs/common';
import { Account, Transfer } from '@prisma/client';
import { AccountWithCustomer, PrismaService } from '../prisma/prisma.service';
import { AccountFacade } from '../account/account.facade';
import {
  SameSourceAndTargetAccountException,
  SourceAccountNotFoundException,
  TooLowTransferAmountException,
  InsufficientBalanceException,
  TargetAccountNotFoundException,
} from './exception';
import { TransferInputDto } from './dto/transfer-input.dto';
import { TransferResultDto } from './dto/transfer-result.dto';

@Injectable()
export class TransferService {
  private readonly TRANSFER_MINIMUM_AMOUNT = 1;

  constructor(
    private prisma: PrismaService,
    private accountFacade: AccountFacade,
  ) {}

  async transfer(
    transferInputDto: TransferInputDto,
  ): Promise<TransferResultDto> {
    if (this.isSourceAccountEqualsToTargetAccount(transferInputDto)) {
      throw new SameSourceAndTargetAccountException();
    }

    if (this.isTransferAmountTooLow(transferInputDto)) {
      throw new TooLowTransferAmountException();
    }

    const sourceAccount = await this.findSourceAccountById(
      transferInputDto.sourceAccountId,
    );

    if (
      this.sourceAccountHasNotSufficientBalance(
        sourceAccount,
        transferInputDto.amount,
      )
    ) {
      throw new InsufficientBalanceException();
    }

    const targetAccount = await this.findTargetAccountById(
      transferInputDto.targetAccountId,
    );

    const [updatedSourceAccount, updatedTargetAccountWithCustomer, transfer] =
      await this.executeTransfer(
        sourceAccount,
        targetAccount,
        transferInputDto.amount,
      );

    return this.buildTransferResultDto(
      updatedSourceAccount,
      updatedTargetAccountWithCustomer,
      transfer,
    );
  }

  private isSourceAccountEqualsToTargetAccount(
    transferInputDto: TransferInputDto,
  ): boolean {
    return (
      transferInputDto.sourceAccountId === transferInputDto.targetAccountId
    );
  }

  private isTransferAmountTooLow(transferInputDto: TransferInputDto): boolean {
    return transferInputDto.amount < this.TRANSFER_MINIMUM_AMOUNT;
  }

  private async findSourceAccountById(
    sourceAccountId: number,
  ): Promise<Account> {
    const sourceAccount = await this.accountFacade.getAccountById(
      sourceAccountId,
    );

    if (!sourceAccount) {
      throw new SourceAccountNotFoundException();
    }

    return sourceAccount;
  }

  private sourceAccountHasNotSufficientBalance(
    sourceAccount: Account,
    amountToBeTransferred: number,
  ): boolean {
    return sourceAccount.balance < amountToBeTransferred;
  }

  private async findTargetAccountById(
    targetAccountId: number,
  ): Promise<Account> {
    const sourceAccount = await this.accountFacade.getAccountById(
      targetAccountId,
    );

    if (!sourceAccount) {
      throw new TargetAccountNotFoundException();
    }

    return sourceAccount;
  }

  private async executeTransfer(
    sourceAccount: Account,
    targetAccount: Account,
    amountToBeTransferred: number,
  ): Promise<[Account, AccountWithCustomer, Transfer]> {
    return await this.prisma.$transaction([
      this.prisma.account.update({
        where: { id: sourceAccount.id },
        data: { balance: sourceAccount.balance - amountToBeTransferred },
      }),
      this.prisma.account.update({
        where: { id: targetAccount.id },
        data: { balance: targetAccount.balance + amountToBeTransferred },
        include: { customer: true },
      }),
      this.prisma.transfer.create({
        data: {
          sourceAccountId: sourceAccount.id,
          targetAccountId: targetAccount.id,
          amount: amountToBeTransferred,
        },
      }),
    ]);
  }

  private buildTransferResultDto(
    sourceAccount: Account,
    targetAccount: AccountWithCustomer,
    transfer: Transfer,
  ): TransferResultDto {
    return {
      transferId: transfer.id,
      sourceAccountId: sourceAccount.id,
      targetAccountId: targetAccount.id,
      beneficiaryName: targetAccount.customer.name,
      updatedBalance: sourceAccount.balance,
      transferDate: transfer.createdAt,
    } as TransferResultDto;
  }
}
