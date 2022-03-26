import { HttpException, HttpStatus } from '@nestjs/common';

export class InsufficientBalanceException extends HttpException {
  constructor() {
    super(
      'Source account has insufficient balance for the requested transfer',
      HttpStatus.PRECONDITION_FAILED,
    );
  }
}
