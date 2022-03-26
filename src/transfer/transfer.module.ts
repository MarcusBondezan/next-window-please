import { Module } from '@nestjs/common';
import { AccountModule } from 'src/account/account.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';

@Module({
  imports: [PrismaModule, AccountModule],
  controllers: [TransferController],
  providers: [TransferService],
})
export class TransferModule {}
