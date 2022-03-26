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
import { CreateAccountDto } from './dto/create-account.dto';
import { GetAccountBalanceParams } from './dto/get-account-balance.params';

@ApiTags('account')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiOperation({ summary: 'Create account' })
  @ApiCreatedResponse({
    description: 'Successfully created customer account',
    type: AccountDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid parameters values' })
  @ApiNotFoundResponse({ description: 'Customer not found' })
  @Post()
  async createAccount(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<AccountDto> {
    const account = await this.accountService.createAccount(createAccountDto);
    return AccountDto.fromAccount(account);
  }

  @ApiOperation({ summary: 'Retrieve account balance' })
  @ApiOkResponse({
    description: 'Successfully retrivied account balance',
    type: AccountDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid account id value' })
  @ApiNotFoundResponse({ description: 'Account not found' })
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
