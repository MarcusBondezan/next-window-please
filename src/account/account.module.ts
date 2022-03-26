import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CustomerModule } from 'src/customer/customer.module';

@Module({
  imports: [PrismaModule, CustomerModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
