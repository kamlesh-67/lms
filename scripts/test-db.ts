
import { prisma } from '../lib/prisma';

async function main() {
    console.log('Testing DB connection...');
    try {
        const userCount = await prisma.user.count();
        console.log(`Successfully connected! Found ${userCount} users.`);

        const user = await prisma.user.findFirst();
        if (user) {
            console.log('Sample user:', user.email, user.role);
        } else {
            console.log('No users found.');
        }
    } catch (error) {
        console.error('DB Connection failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
