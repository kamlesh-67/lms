
import Database from 'better-sqlite3';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Load .env first
dotenv.config();
// Load .env.local and override
dotenv.config({ path: '.env.local', override: true });

const prisma = new PrismaClient();

// Adjust path to your SQLite DB
const dbPath = path.resolve(process.cwd(), 'prisma/dev.db');

if (!fs.existsSync(dbPath)) {
    console.error(`SQLite database not found at ${dbPath}`);
    process.exit(1);
}

const sqlite = new Database(dbPath);

// Map of model name (Prisma Client property) to SQLite table name and date fields
const models = [
    { model: 'user', table: 'User', dateFields: ['lastLogin', 'createdAt', 'updatedAt'] },
    { model: 'role', table: 'Role', dateFields: ['createdAt', 'updatedAt'] },
    { model: 'driver', table: 'Driver', dateFields: ['createdAt', 'updatedAt'] },
    { model: 'vehicle', table: 'Vehicle', dateFields: ['lastMaintenance', 'nextMaintenance', 'createdAt', 'updatedAt'] },
    { model: 'warehouse', table: 'Warehouse', dateFields: ['createdAt', 'updatedAt'] },
    { model: 'location', table: 'Location', dateFields: ['createdAt', 'updatedAt'] },
    { model: 'setting', table: 'Setting', dateFields: ['updatedAt'] },
    { model: 'customer', table: 'Customer', dateFields: ['createdAt', 'updatedAt'] },
    { model: 'document', table: 'Document', dateFields: ['createdAt', 'updatedAt'] },
    { model: 'profile', table: 'Profile', dateFields: ['updatedAt'] },
    { model: 'route', table: 'Route', dateFields: ['createdAt', 'updatedAt'] },
    { model: 'manifest', table: 'Manifest', dateFields: ['date', 'closedAt', 'completedAt', 'createdAt', 'updatedAt'] },
    { model: 'shipment', table: 'Shipment', dateFields: ['estimatedDelivery', 'actualDelivery', 'createdAt', 'updatedAt'] },
    { model: 'trackingEvent', table: 'TrackingEvent', dateFields: ['timestamp'] },
    { model: 'pickup', table: 'Pickup', dateFields: ['scheduledDate', 'createdAt', 'updatedAt'] },
    { model: 'return', table: 'Return', dateFields: ['requestDate', 'approvalDate', 'pickupScheduled', 'createdAt', 'updatedAt'] },
    { model: 'inventory', table: 'Inventory', dateFields: ['createdAt', 'updatedAt'] },
    { model: 'notification', table: 'Notification', dateFields: ['createdAt'] },
    { model: 'auditLog', table: 'AuditLog', dateFields: ['timestamp'] },
    { model: 'apiHistory', table: 'ApiHistory', dateFields: ['timestamp'] },
    { model: 'invoice', table: 'Invoice', dateFields: ['dueDate', 'paidDate', 'createdAt', 'updatedAt'] },
    { model: 'rider', table: 'Rider', dateFields: ['updatedAt'] }
];

async function main() {
    console.log('Starting migration from SQLite to MongoDB...');

    for (const { model, table, dateFields } of models) {
        console.log(`Migrating ${table}...`);
        try {
            const rows = sqlite.prepare(`SELECT * FROM ${table}`).all();

            if (rows.length === 0) {
                console.log(`  No records found for ${table}`);
                continue;
            }

            console.log(`  Found ${rows.length} records. Inserting...`);

            for (const row of rows) {
                // Fix date fields
                if (dateFields) {
                    for (const field of dateFields) {
                        if (row[field]) {
                            // SQLite might store as milliseconds (number) or ISO string
                            const val = row[field];
                            if (typeof val === 'number') {
                                (row as any)[field] = new Date(val);
                            } else if (typeof val === 'string') {
                                (row as any)[field] = new Date(val);
                            }
                        }
                    }
                }

                // Handle JSON strings if parsed? 
                // Prisma Client expects string for JSON fields if type is String? 
                // In schema: preferences String?, permissions String (JSON string), metadata String?.
                // They are typed as String in schema, so they should remain strings.
                // If SQLite stored them as strings, we are good.

                try {
                    // Upsert creates if not exists, updates if exists (idempotent)
                    // @ts-ignore
                    await prisma[model].upsert({
                        where: { id: row.id }, // id maps to _id automatically due to schema
                        update: row,
                        create: row,
                    });
                } catch (e) {
                    console.error(`  Error processing ${model} ID ${row.id}:`, e);
                }
            }
            console.log(`  Finished ${table}`);
        } catch (err: any) {
            if (err.message.includes('no such table')) {
                console.log(`  Skipping ${table} (Table not found in SQLite DB)`);
            } else {
                console.error(`  Error querying ${table}:`, err);
            }
        }
    }

    console.log('Migration complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        sqlite.close();
    });
