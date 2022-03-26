import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AccountService } from './account.service';
import { AccountDto } from './dto/account.dto';
import { CreateAccountDto } from './dto/create-account.dto';

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
}
