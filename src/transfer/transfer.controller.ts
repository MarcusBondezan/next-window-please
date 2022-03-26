import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiPreconditionFailedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TransferService } from './transfer.service';
import { TransferInputDto } from './dto/transfer-input.dto';
import { TransferResultDto } from './dto/transfer-result.dto';
import { TransferHistoryParams } from './dto/transfer-history.params';
import { TransferHistoryItemDto } from './dto/transfer-history-item.dto';

@ApiTags('transfer')
@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @ApiOperation({
    summary:
      'Transfer amounts between any two accounts, including those owned by different customers',
  })
  @ApiCreatedResponse({
    description: 'When successfully transferred money between accounts',
    type: TransferResultDto,
  })
  @ApiBadRequestResponse({
    description:
      'When there are validation errors in the input body values or if the source and target accounts are equal',
  })
  @ApiNotFoundResponse({
    description: 'When the source or the target accounts are not found',
  })
  @ApiPreconditionFailedResponse({
    description:
      'When source account does not have balance to transfer or the transfer amount is too low (< $1)',
  })
  @Post()
  async transfer(
    @Body() transferInputDto: TransferInputDto,
  ): Promise<TransferResultDto> {
    return this.transferService.transfer(transferInputDto);
  }

  @ApiOperation({
    summary: 'Retrieve transfer history for a given account',
  })
  @ApiOkResponse({
    description:
      'When successfully retrieve transfer history for a given accounet',
    type: [TransferHistoryItemDto],
  })
  @ApiBadRequestResponse({ description: 'When account id value is invalid' })
  @ApiNotFoundResponse({ description: 'When the account is not found' })
  @Get('/history/:accountId')
  async getTransferHistory(
    @Param() transferHistoryParams: TransferHistoryParams,
  ): Promise<TransferHistoryItemDto[]> {
    return this.transferService.getTransferHistoryByAccount(
      +transferHistoryParams.accountId,
    );
  }
}
