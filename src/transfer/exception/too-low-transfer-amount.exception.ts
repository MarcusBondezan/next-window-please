import { HttpException, HttpStatus } from '@nestjs/common';

export class TooLowTransferAmountException extends HttpException {
  constructor() {
    super('Too low transfer amount', HttpStatus.PRECONDITION_FAILED);
  }
}
