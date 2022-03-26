import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

export type AccountWithCustomer = Prisma.AccountGetPayload<{
  include: {
    customer: true;
  };
}>;

export type TransferWithCustomerData = Prisma.TransferGetPayload<{
  include: {
    sourceAccount: { include: { customer: true } };
    targetAccount: { include: { customer: true } };
  };
}>;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
