import { Injectable } from '@nestjs/common';
import { Customer } from '@prisma/client';
import { CustomerService } from './customer.service';

@Injectable()
export class CustomerFacade {
  constructor(private customerService: CustomerService) {}

  async getCustomerById(customerId: number): Promise<Customer> {
    return this.customerService.getCustomerById(customerId);
  }
}
