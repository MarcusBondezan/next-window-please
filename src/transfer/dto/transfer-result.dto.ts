import { ApiProperty } from '@nestjs/swagger';

export class TransferResultDto {
  @ApiProperty()
  transferId: number;
  @ApiProperty()
  sourceAccountId: number;
  @ApiProperty()
  targetAccountId: number;
  @ApiProperty()
  beneficiaryName: string;
  @ApiProperty()
  updatedBalance: number;
  @ApiProperty()
  transferDate: Date;
}
