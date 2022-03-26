export class TransferResultDto {
  transferId: number;
  sourceAccountId: number;
  targetAccountId: number;
  beneficiaryName: string;
  updatedBalance: number;
  transferDate: Date;
}
