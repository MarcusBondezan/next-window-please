import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const customers = await prisma.customer.createMany({
        data: [
            { name: "Arisha Barron" },
            { name: "Branden Gibson" },
            { name: "Rhonda Church" },
            { name: "Georgina Hazel" },
        ]
    });
}

main()
.catch((e) => {
    console.error(e);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
})