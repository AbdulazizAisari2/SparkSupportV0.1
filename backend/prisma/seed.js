const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting fresh database seeding with leaderboard data...');

  // Clear existing data
  await prisma.userAchievement.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.ticketMessage.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleared existing data');

  // Create achievements
  const achievements = await Promise.all([
    prisma.achievement.create({
      data: {
        name: 'First Resolution',
        description: 'Resolved your first ticket',
        icon: 'star',
        color: 'bronze',
        pointsReward: 50,
        requirements: JSON.stringify({ ticketsResolved: 1 })
      }
    }),
    prisma.achievement.create({
      data: {
        name: 'Speed Demon',
        description: 'Resolved 10 tickets in one day',
        icon: 'zap',
        color: 'gold',
        pointsReward: 200,
        requirements: JSON.stringify({ dailyTickets: 10 })
      }
    }),
    prisma.achievement.create({
      data: {
        name: 'Customer Hero',
        description: 'Achieved 5-star rating from 50 customers',
        icon: 'crown',
        color: 'purple',
        pointsReward: 300,
        requirements: JSON.stringify({ customerRatings: 50, minRating: 5 })
      }
    }),
    prisma.achievement.create({
      data: {
        name: 'Streak Master',
        description: 'Maintained 30-day resolution streak',
        icon: 'target',
        color: 'blue',
        pointsReward: 500,
        requirements: JSON.stringify({ streak: 30 })
      }
    }),
    prisma.achievement.create({
      data: {
        name: 'Team Player',
        description: 'Helped colleagues with 20+ tickets',
        icon: 'award',
        color: 'green',
        pointsReward: 250,
        requirements: JSON.stringify({ helpedTickets: 20 })
      }
    }),
    prisma.achievement.create({
      data: {
        name: 'Resolution Master',
        description: 'Resolved 100 tickets',
        icon: 'trophy',
        color: 'gold',
        pointsReward: 400,
        requirements: JSON.stringify({ ticketsResolved: 100 })
      }
    }),
    prisma.achievement.create({
      data: {
        name: 'Lightning Fast',
        description: 'Average response time under 5 minutes',
        icon: 'flash',
        color: 'yellow',
        pointsReward: 300,
        requirements: JSON.stringify({ avgResponseTime: 5 })
      }
    }),
    prisma.achievement.create({
      data: {
        name: 'Customer Champion',
        description: 'Maintained 4.8+ satisfaction rating',
        icon: 'heart',
        color: 'pink',
        pointsReward: 350,
        requirements: JSON.stringify({ avgSatisfaction: 4.8 })
      }
    })
  ]);

  console.log(`🏆 Created ${achievements.length} achievements`);

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

  // Create sample staff users with leaderboard data
  const staffUsers = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Mohammed Hassan',
        email: 'mohammed@company.co',
        phone: '+1 (555) 234-5678',
        role: 'staff',
        department: 'Technical Support',
        passwordHash: await bcrypt.hash('Staff123!', 12),
        points: 2940,
        level: 8,
        ticketsResolved: 147,
        averageResolutionTimeHours: 4.2,
        customerSatisfactionRating: 4.8,
        currentStreak: 23,
        totalTicketsHandled: 189,
        averageResponseTimeMinutes: 12,
        monthlyGrowth: 15.3,
        specialRecognition: 'Staff of the Month',
        lastActiveDate: new Date()
      }
    }),
    prisma.user.create({
      data: {
        name: 'Sarah Johnson',
        email: 'sarah@company.co',
        phone: '+1 (555) 345-6789',
        role: 'staff',
        department: 'Customer Success',
        passwordHash: await bcrypt.hash('Staff123!', 12),
        points: 2680,
        level: 7,
        ticketsResolved: 134,
        averageResolutionTimeHours: 3.8,
        customerSatisfactionRating: 4.9,
        currentStreak: 18,
        totalTicketsHandled: 156,
        averageResponseTimeMinutes: 8,
        monthlyGrowth: 12.7,
        lastActiveDate: new Date()
      }
    }),
    prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@company.co',
        phone: '+1 (555) 456-7890',
        role: 'admin',
        department: 'IT Administration',
        passwordHash: await bcrypt.hash('Admin123!', 12),
        points: 1780,
        level: 6,
        ticketsResolved: 89,
        averageResolutionTimeHours: 2.1,
        customerSatisfactionRating: 4.7,
        currentStreak: 12,
        totalTicketsHandled: 95,
        averageResponseTimeMinutes: 15,
        monthlyGrowth: 8.9,
        lastActiveDate: new Date()
      }
    })
  ]);

  console.log(`👥 Created ${staffUsers.length} staff users with leaderboard data`);

  // Assign achievements to users
  const userAchievements = [];
  
  // Mohammed's achievements (top performer)
  userAchievements.push(
    prisma.userAchievement.create({
      data: {
        userId: staffUsers[0].id,
        achievementId: achievements[0].id, // First Resolution
        unlockedAt: new Date('2024-01-15')
      }
    }),
    prisma.userAchievement.create({
      data: {
        userId: staffUsers[0].id,
        achievementId: achievements[1].id, // Speed Demon
        unlockedAt: new Date('2024-01-20')
      }
    }),
    prisma.userAchievement.create({
      data: {
        userId: staffUsers[0].id,
        achievementId: achievements[3].id, // Streak Master
        unlockedAt: new Date('2024-01-25')
      }
    }),
    prisma.userAchievement.create({
      data: {
        userId: staffUsers[0].id,
        achievementId: achievements[5].id, // Resolution Master
        unlockedAt: new Date('2024-02-01')
      }
    })
  );

  // Sarah's achievements
  userAchievements.push(
    prisma.userAchievement.create({
      data: {
        userId: staffUsers[1].id,
        achievementId: achievements[0].id, // First Resolution
        unlockedAt: new Date('2024-01-10')
      }
    }),
    prisma.userAchievement.create({
      data: {
        userId: staffUsers[1].id,
        achievementId: achievements[2].id, // Customer Hero
        unlockedAt: new Date('2024-01-18')
      }
    }),
    prisma.userAchievement.create({
      data: {
        userId: staffUsers[1].id,
        achievementId: achievements[7].id, // Customer Champion
        unlockedAt: new Date('2024-02-05')
      }
    })
  );

  // Admin's achievements
  userAchievements.push(
    prisma.userAchievement.create({
      data: {
        userId: staffUsers[2].id,
        achievementId: achievements[0].id, // First Resolution
        unlockedAt: new Date('2024-01-12')
      }
    }),
    prisma.userAchievement.create({
      data: {
        userId: staffUsers[2].id,
        achievementId: achievements[6].id, // Lightning Fast
        unlockedAt: new Date('2024-01-30')
      }
    })
  );

  await Promise.all(userAchievements);

  console.log(`🏅 Assigned achievements to staff users`);
  console.log('\n🎉 Fresh database setup completed with leaderboard!');
  console.log('\n📊 Database Contents:');
  console.log(`📂 Categories: ${categories.length}`);
  console.log(`👥 Staff Users: ${staffUsers.length} (with leaderboard data)`);
  console.log(`🏆 Achievements: ${achievements.length}`);
  console.log(`🏅 User Achievements: ${userAchievements.length}`);
  console.log(`🎫 Tickets: 0 (ready for new tickets)`);
  console.log(`💬 Messages: 0 (ready for conversations)`);
  console.log('\n🔐 Demo Login Credentials:');
  console.log('Staff (Top Performer): mohammed@company.co / Staff123!');
  console.log('Staff (Customer Success): sarah@company.co / Staff123!');
  console.log('Admin: admin@company.co / Admin123!');
  console.log('\n✅ Database is ready for leaderboard functionality!');
  console.log('🚀 You can now signup with any email and see real leaderboard data!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });