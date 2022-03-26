import { Module } from '@nestjs/common';

import { AccountModule } from './account/account.module';
import { CustomerModule } from './customer/customer.module';
import { TransferModule } from './transfer/transfer.module';

@Module({
  imports: [AccountModule, CustomerModule, TransferModule],
})
export class AppModule {}
