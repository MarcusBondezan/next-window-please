import { ApiProperty } from '@nestjs/swagger';

export class TransferHistoryItemDto {
  @ApiProperty()
  type: string;
  @ApiProperty()
  involvedCustomer: string;
  @ApiProperty()
  amountTransferred: number;
  @ApiProperty()
  date: Date;
}
