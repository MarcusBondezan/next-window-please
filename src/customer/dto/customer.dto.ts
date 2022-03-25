import { Customer } from "@prisma/client";

export class CustomerDto {
  id: number;
  name: string;

  static fromCustomer(customer: Customer) {
    const dto = new CustomerDto();
    dto.id = customer.id;
    dto.name = customer.name;
  }
}