import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CustomerFacade } from './customer.facade';
import { CustomerService } from './customer.service';

@Module({
  imports: [PrismaModule],
  providers: [CustomerService, CustomerFacade],
  exports: [CustomerFacade],
})
export class CustomerModule {}
