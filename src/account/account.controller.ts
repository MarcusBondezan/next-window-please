import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AccountService } from './account.service';
import { AccountDto } from './dto/account.dto';
import { CreateAccountInputDto } from './dto/create-account-input.dto';
import { GetAccountBalanceParams } from './dto/get-account-balance.params';

@ApiTags('account')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiOperation({
    summary:
      'Create a new bank account for a customer, with an initial deposit amount',
  })
  @ApiCreatedResponse({
    description: 'When successfully created customer account',
    type: AccountDto,
  })
  @ApiBadRequestResponse({
    description: 'When there are invalid parameters values',
  })
  @ApiNotFoundResponse({ description: 'When customer is not found' })
  @Post()
  async createAccount(
    @Body() createAccountDto: CreateAccountInputDto,
  ): Promise<AccountDto> {
    const account = await this.accountService.createAccount(createAccountDto);
    return AccountDto.fromAccount(account);
  }

  @ApiOperation({ summary: 'Retrieve balances for a given account' })
  @ApiOkResponse({
    description: 'When successfully retrieved account balance',
    type: AccountDto,
  })
  @ApiBadRequestResponse({ description: 'When account id value is invalid' })
  @ApiNotFoundResponse({ description: 'When the account is not found' })
  @Get(':accountId')
  async getAccountBalance(
    @Param() params: GetAccountBalanceParams,
  ): Promise<AccountDto> {
    const account = await this.accountService.getAccountBalance(
      +params.accountId,
    );
    return AccountDto.fromAccount(account);
  }
}
