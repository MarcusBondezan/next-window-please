import { HttpException, HttpStatus } from '@nestjs/common';

export class SameSourceAndTargetAccountException extends HttpException {
  constructor() {
    super(
      'Source and target accounts must be different',
      HttpStatus.BAD_REQUEST,
    );
  }
}
