import { Injectable } from '@nestjs/common';
import { Customer } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async getCustomerById(customerId: number): Promise<Customer> {
    return await this.prisma.customer.findUnique({ where: { id: customerId }});
  }
}