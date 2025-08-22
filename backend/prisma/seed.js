const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.ticketMessage.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleared existing data');

  // Create categories
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

  // Create demo users with secure passwords
  const users = await Promise.all([
    // Customer
    prisma.user.create({
      data: {
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        role: 'customer',
        passwordHash: await bcrypt.hash('Customer123!', 12)
      }
    }),
    // Staff
    prisma.user.create({
      data: {
        name: 'Sarah Johnson',
        email: 'sarah@company.co',
        phone: '+1 (555) 234-5678',
        role: 'staff',
        department: 'Technical Support',
        passwordHash: await bcrypt.hash('Staff123!', 12)
      }
    }),
    // Admin
    prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@company.co',
        phone: '+1 (555) 345-6789',
        role: 'admin',
        department: 'IT Administration',
        passwordHash: await bcrypt.hash('Admin123!', 12)
      }
    }),
    // Additional Customer
    prisma.user.create({
      data: {
        name: 'Emily Davis',
        email: 'emily@example.com',
        phone: '+1 (555) 456-7890',
        role: 'customer',
        passwordHash: await bcrypt.hash('Customer456!', 12)
      }
    })
  ]);

  console.log(`👥 Created ${users.length} demo users`);

  // Generate random dates within the last 3 months
  const getRandomDate = () => {
    const now = new Date();
    const threeMonthsAgo = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
    const randomTime = threeMonthsAgo.getTime() + Math.random() * (now.getTime() - threeMonthsAgo.getTime());
    return new Date(randomTime);
  };

  // Create demo tickets
  const tickets = await Promise.all([
    prisma.ticket.create({
      data: {
        id: 'T001',
        customerId: users[0].id, // John Smith
        assignedStaffId: users[1].id, // Sarah Johnson
        categoryId: categories[0].id, // Technical Support
        priority: 'high',
        status: 'in_progress',
        subject: 'Cannot access dashboard after update',
        description: 'After the recent system update, I cannot access my dashboard. The page loads but shows a blank screen.',
        createdAt: getRandomDate()
      }
    }),
    prisma.ticket.create({
      data: {
        id: 'T002',
        customerId: users[3].id, // Emily Davis
        categoryId: categories[2].id, // Billing
        priority: 'medium',
        status: 'open',
        subject: 'Billing discrepancy in last invoice',
        description: 'I noticed an extra charge on my last invoice that I don\'t recognize. Could you please review this?',
        createdAt: getRandomDate()
      }
    }),
    prisma.ticket.create({
      data: {
        id: 'T003',
        customerId: users[0].id, // John Smith
        assignedStaffId: users[2].id, // Admin User
        categoryId: categories[3].id, // Feature Request
        priority: 'low',
        status: 'resolved',
        subject: 'Request for dark mode in mobile app',
        description: 'Would love to see a dark mode option in the mobile application for better nighttime usage.',
        createdAt: getRandomDate()
      }
    }),
    prisma.ticket.create({
      data: {
        id: 'T004',
        customerId: users[3].id, // Emily Davis
        categoryId: categories[4].id, // Bug Report
        priority: 'urgent',
        status: 'open',
        subject: 'Data export function not working',
        description: 'The export function is returning corrupted files. This is affecting our monthly reports.',
        createdAt: getRandomDate()
      }
    })
  ]);

  console.log(`🎫 Created ${tickets.length} demo tickets`);

  // Create demo messages
  const messages = await Promise.all([
    // T001 Messages
    prisma.ticketMessage.create({
      data: {
        ticketId: 'T001',
        senderId: users[0].id, // Customer
        message: 'After the recent system update, I cannot access my dashboard. The page loads but shows a blank screen.',
        createdAt: tickets[0].createdAt
      }
    }),
    prisma.ticketMessage.create({
      data: {
        ticketId: 'T001',
        senderId: users[1].id, // Staff
        message: 'Thank you for reporting this issue. I\'m looking into the dashboard problem now. Can you try clearing your browser cache?',
        createdAt: new Date(tickets[0].createdAt.getTime() + 60 * 60 * 1000) // 1 hour later
      }
    }),
    prisma.ticketMessage.create({
      data: {
        ticketId: 'T001',
        senderId: users[0].id, // Customer
        message: 'I tried clearing the cache but the issue persists. Still seeing a blank dashboard.',
        createdAt: new Date(tickets[0].createdAt.getTime() + 2 * 60 * 60 * 1000) // 2 hours later
      }
    }),

    // T002 Messages
    prisma.ticketMessage.create({
      data: {
        ticketId: 'T002',
        senderId: users[3].id, // Customer
        message: 'I noticed an extra charge on my last invoice that I don\'t recognize. Could you please review this?',
        createdAt: tickets[1].createdAt
      }
    }),

    // T003 Messages
    prisma.ticketMessage.create({
      data: {
        ticketId: 'T003',
        senderId: users[0].id, // Customer
        message: 'Would love to see a dark mode option in the mobile application for better nighttime usage.',
        createdAt: tickets[2].createdAt
      }
    }),
    prisma.ticketMessage.create({
      data: {
        ticketId: 'T003',
        senderId: users[2].id, // Admin
        message: 'Great suggestion! Dark mode is now on our roadmap for the next mobile app release.',
        createdAt: new Date(tickets[2].createdAt.getTime() + 24 * 60 * 60 * 1000) // 1 day later
      }
    }),

    // T004 Messages
    prisma.ticketMessage.create({
      data: {
        ticketId: 'T004',
        senderId: users[3].id, // Customer
        message: 'The export function is returning corrupted files. This is affecting our monthly reports.',
        createdAt: tickets[3].createdAt
      }
    })
  ]);

  console.log(`💬 Created ${messages.length} demo messages`);

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📊 Demo Data Summary:');
  console.log(`👥 Users: ${users.length}`);
  console.log(`📂 Categories: ${categories.length}`);
  console.log(`🎫 Tickets: ${tickets.length}`);
  console.log(`💬 Messages: ${messages.length}`);

  console.log('\n🔐 Demo Login Credentials:');
  console.log('Customer: john@example.com / Customer123!');
  console.log('Staff: sarah@company.co / Staff123!');
  console.log('Admin: admin@company.co / Admin123!');
  console.log('Customer 2: emily@example.com / Customer456!');

  console.log('\n🚀 Ready to start your servers!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });