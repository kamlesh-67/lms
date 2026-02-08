const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  const users = [
    {
      name: 'Admin User',
      email: 'admin@lmd.com',
      password,
      role: 'Admin',
    },
    {
      name: 'Operations Manager',
      email: 'ops@lmd.com',
      password,
      role: 'Operations',
    },
    {
      name: 'Supervisor',
      email: 'supervisor@lmd.com',
      password,
      role: 'Supervisor',
    },
  ];

  for (const user of users) {
    const upsertUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
    console.log(`Created user: ${upsertUser.name} (${upsertUser.role})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
