const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting fresh database seeding...');

  // Clear existing data
  await prisma.ticketMessage.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleared existing data');

  // Create categories ONLY
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Technical Support',
        description: 'Hardware, software, and technical issues'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Account Access',
        description: 'Login, password, and account-related issues'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Billing',
        description: 'Payment, subscription, and billing inquiries'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Feature Request',
        description: 'Suggestions and feature enhancement requests'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Bug Report',
        description: 'Software bugs and unexpected behavior'
      }
    })
  ]);

  console.log(`📂 Created ${categories.length} categories`);
  console.log('\n🎉 Fresh database setup completed!');
  console.log('\n📊 Database Contents:');
  console.log(`📂 Categories: ${categories.length}`);
  console.log(`👥 Users: 0 (ready for fresh signups)`);
  console.log(`🎫 Tickets: 0 (ready for new tickets)`);
  console.log(`💬 Messages: 0 (ready for conversations)`);
  console.log('\n✅ Database is clean and ready for testing!');
  console.log('🚀 You can now signup with any email and create tickets!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });