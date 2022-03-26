import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CustomerModule } from 'src/customer/customer.module';
import { AccountFacade } from './account.facade';

@Module({
  imports: [PrismaModule, CustomerModule],
  controllers: [AccountController],
  providers: [AccountService, AccountFacade],
  exports: [AccountFacade],
})
export class AccountModule {}
