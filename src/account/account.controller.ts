import { Controller, Post, Body } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountDto } from './dto/account.dto';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async create(@Body() createAccountDto: CreateAccountDto): Promise<AccountDto> {
    const account = await this.accountService.create(createAccountDto);
    return AccountDto.fromAccount(account);
  }
}
