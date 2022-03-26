import { HttpException, HttpStatus } from '@nestjs/common';

export class SourceAccountNotFoundException extends HttpException {
  constructor() {
    super('Transfer source account not found', HttpStatus.NOT_FOUND);
  }
}
