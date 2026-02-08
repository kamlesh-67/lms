import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seeding...')
    // ============================================
    // 0. CLEANUP
    // ============================================
    console.log('🧹 Cleaning up database...')
    // Delete in order of foreign key constraints
    await prisma.trackingEvent.deleteMany()
    await prisma.shipment.deleteMany()
    await prisma.pickup.deleteMany()
    await prisma.rider.deleteMany()
    await prisma.manifest.deleteMany()
    await prisma.auditLog.deleteMany()
    await prisma.apiHistory.deleteMany()
    // Users are kept (upsert) but their related data is gone. Note: AuditLog relates to User but we deleted AuditLogs.

    // ============================================
    // 1. SEED USERS (6 Mock Users)
    // ============================================
    console.log('👥 Seeding users...')

    const hashedPassword = await bcrypt.hash('Password@123', 10)

    // Create users sequentially
    await prisma.user.upsert({
        where: { email: 'admin@lmd.com' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@lmd.com',
            password: hashedPassword,
            role: 'Admin',
            isActive: true,
        },
    })

    await prisma.user.upsert({
        where: { email: 'ops.manager@lmd.com' },
        update: {},
        create: {
            name: 'Operations Manager',
            email: 'ops.manager@lmd.com',
            password: hashedPassword,
            role: 'Operations Manager',
            isActive: true,
        },
    })

    await prisma.user.upsert({
        where: { email: 'supervisor@lmd.com' },
        update: {},
        create: {
            name: 'Supervisor',
            email: 'supervisor@lmd.com',
            password: hashedPassword,
            role: 'Supervisor',
            isActive: true,
        },
    })

    await prisma.user.upsert({
        where: { email: 'warehouse@lmd.com' },
        update: {},
        create: {
            name: 'Warehouse Staff',
            email: 'warehouse@lmd.com',
            password: hashedPassword,
            role: 'Warehouse Staff',
            isActive: true,
        },
    })

    await prisma.user.upsert({
        where: { email: 'driver@lmd.com' },
        update: {},
        create: {
            name: 'Driver',
            email: 'driver@lmd.com',
            password: hashedPassword,
            role: 'Driver',
            isActive: true,
        },
    })

    await prisma.user.upsert({
        where: { email: 'cs@lmd.com' },
        update: {},
        create: {
            name: 'Customer Service',
            email: 'cs@lmd.com',
            password: hashedPassword,
            role: 'Customer Service',
            isActive: true,
        },
    })

    console.log(`✅ Created 6 users`)

    // ============================================
    // 2. SEED SHIPMENTS (50 shipments)
    // ============================================
    console.log('📦 Seeding shipments...')

    const statuses = ['Created', 'Pickup Assigned', 'Picked', 'In Transit', 'Out for Delivery', 'Delivered', 'Failed', 'Delayed', 'RTO']
    const serviceTypes = ['Standard', 'Express', 'Same Day']
    const cities = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah']
    const streets = ['Sheikh Zayed Rd', 'Al Wasl Rd', 'Jumeirah St', 'Al Khail Rd', 'Emirates Rd']

    for (let i = 1; i <= 50; i++) {
        const shipment = await prisma.shipment.create({
            data: {
                awb: `AWB-${String(i).padStart(8, '0')}`,
                orderId: `ORD-${String(i).padStart(6, '0')}`,
                consigneeName: `Consignee ${i}`,
                consigneePhone: `+971-50-${String(Math.floor(Math.random() * 9000000) + 1000000)}`,
                address: `Unit ${Math.floor(Math.random() * 100)}, ${streets[Math.floor(Math.random() * streets.length)]}`,
                origin: cities[Math.floor(Math.random() * cities.length)],
                destination: cities[Math.floor(Math.random() * cities.length)],
                weight: parseFloat((0.5 + Math.random() * 20).toFixed(2)),
                serviceType: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
                status: statuses[Math.floor(Math.random() * statuses.length)],
                isDelayed: Math.random() > 0.9,
                isRTO: Math.random() > 0.95,
            },
        })

        // Add 3-5 tracking events for each shipment
        const eventCount = Math.floor(Math.random() * 3) + 3
        for (let j = 0; j < eventCount; j++) {
            await prisma.trackingEvent.create({
                data: {
                    shipmentId: shipment.id,
                    status: statuses[Math.min(j, statuses.length - 1)],
                    location: cities[Math.floor(Math.random() * cities.length)],
                    hub: `Hub ${Math.floor(Math.random() * 3) + 1}`,
                    timestamp: new Date(Date.now() - (eventCount - j) * 24 * 60 * 60 * 1000),
                    description: `Shipment status updated to ${statuses[Math.min(j, statuses.length - 1)]}`,
                },
            })
        }
    }

    console.log(`✅ Created 50 shipments with tracking events`)

    // ============================================
    // 2.5 SEED PICKUPS (20 pickups)
    // ============================================
    console.log('📦 Seeding pickups...')

    const pickupStatuses = ['Requested', 'Assigned', 'Picked', 'Failed', 'Cancelled']

    for (let i = 1; i <= 20; i++) {
        await prisma.pickup.create({
            data: {
                requestId: `REQ-${String(i).padStart(6, '0')}`,
                customerName: `Customer ${i}`,
                customerPhone: `+971-50-${String(Math.floor(Math.random() * 9000000) + 1000000)}`,
                customerEmail: `customer${i}@example.com`,
                scheduledDate: new Date(Date.now() + (Math.random() * 7 * 24 * 60 * 60 * 1000)), // Future date
                address: `Unit ${Math.floor(Math.random() * 100)}, Tower ${i}, Street ${i}`,
                city: cities[Math.floor(Math.random() * cities.length)],
                serviceType: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
                status: pickupStatuses[Math.floor(Math.random() * pickupStatuses.length)],
                location: `${(25.2 + Math.random() * 0.1).toFixed(4)}, ${(55.2 + Math.random() * 0.1).toFixed(4)}`, // Random Dubai coords
                contactName: `Contact Person ${i}`,
                contactPhone: `+971-55-${String(Math.floor(Math.random() * 9000000) + 1000000)}`,
                itemCount: Math.floor(Math.random() * 5) + 1,
                estimatedWeight: parseFloat((Math.floor(Math.random() * 10) + 1).toFixed(2)),
            },
        })
    }
    console.log(`✅ Created 20 pickups`)

    // ============================================
    // 3. SEED RIDERS (10 riders)
    // ============================================
    console.log('👨‍✈️ Seeding riders...')

    for (let i = 1; i <= 10; i++) {
        await prisma.rider.create({
            data: {
                name: `Rider ${i}`,
                status: ['Idle', 'Moving', 'Offline'][Math.floor(Math.random() * 3)],
                lat: 25.2048 + (Math.random() - 0.5) * 0.1,
                lng: 55.2708 + (Math.random() - 0.5) * 0.1,
            },
        })
    }

    console.log(`✅ Created 10 riders`)

    // ============================================
    // 4. SEED MANIFESTS (15 manifests)
    // ============================================
    console.log('📋 Seeding manifests...')

    const users = await prisma.user.findMany()

    for (let i = 1; i <= 15; i++) {
        await prisma.manifest.create({
            data: {
                manifestRef: `MAN-${String(i).padStart(6, '0')}`,
                status: ['Open', 'Closed'][Math.floor(Math.random() * 2)],
                generatedBy: users[0].id,
            },
        })
    }

    console.log(`✅ Created 15 manifests`)

    // ============================================
    // 5. SEED AUDIT LOGS (20 logs)
    // ============================================
    console.log('📝 Seeding audit logs...')

    const actions = ['Created', 'Updated', 'Deleted', 'Viewed']
    const entityTypes = ['Shipment', 'Pickup', 'Manifest', 'User']

    for (let i = 1; i <= 20; i++) {
        await prisma.auditLog.create({
            data: {
                userId: users[Math.floor(Math.random() * users.length)].id,
                action: actions[Math.floor(Math.random() * actions.length)],
                entityType: entityTypes[Math.floor(Math.random() * entityTypes.length)],
                entityId: `entity-${i}`,
                details: JSON.stringify({ action: 'test', timestamp: new Date() }),
                ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
            },
        })
    }

    console.log(`✅ Created 20 audit logs`)

    // ============================================
    // 6. SEED API HISTORY (15 records)
    // ============================================
    console.log('🔌 Seeding API history...')

    const methods = ['GET', 'POST', 'PUT', 'DELETE']
    const endpoints = ['/api/shipments', '/api/pickups', '/api/manifests', '/api/tracking']

    for (let i = 1; i <= 15; i++) {
        await prisma.apiHistory.create({
            data: {
                endpoint: endpoints[Math.floor(Math.random() * endpoints.length)],
                method: methods[Math.floor(Math.random() * methods.length)],
                statusCode: [200, 201, 400, 404, 500][Math.floor(Math.random() * 5)],
                durationMs: Math.floor(Math.random() * 1000) + 50,
                userId: Math.random() > 0.5 ? users[Math.floor(Math.random() * users.length)].id : null,
            },
        })
    }

    console.log(`✅ Created 15 API history records`)

    console.log('\n✨ Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`   - 6 Users (Admin, Ops Manager, Supervisor, Warehouse, Driver, CS)`)
    console.log(`   - 50 Shipments with tracking events`)
    console.log(`   - 10 Riders`)
    console.log(`   - 15 Manifests`)
    console.log(`   - 20 Audit Logs`)
    console.log(`   - 15 API History records`)
    console.log('\n🔑 Login Credentials (All use same password for demo):')
    console.log(`   Admin: admin@lmd.com / Password@123`)
    console.log(`   Ops Manager: ops.manager@lmd.com / Password@123`)
    console.log(`   Supervisor: supervisor@lmd.com / Password@123`)
    console.log(`   Warehouse: warehouse@lmd.com / Password@123`)
    console.log(`   Driver: driver@lmd.com / Password@123`)
    console.log(`   Customer Service: cs@lmd.com / Password@123`)
}

main()
    .catch((e) => {
        console.error('\n❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
