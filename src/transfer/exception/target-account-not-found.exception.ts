import { HttpException, HttpStatus } from '@nestjs/common';

export class TargetAccountNotFoundException extends HttpException {
  constructor() {
    super('Transfer target account not found', HttpStatus.NOT_FOUND);
  }
}
