import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiPreconditionFailedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TransferService } from './transfer.service';
import { TransferInputDto } from './dto/transfer-input.dto';
import { TransferResultDto } from './dto/transfer-result.dto';

@ApiTags('transfer')
@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @ApiOperation({
    summary: 'Transfer money from a source account to a target account',
  })
  @ApiCreatedResponse({
    description: 'When successfully transferred money between accounts',
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
}
