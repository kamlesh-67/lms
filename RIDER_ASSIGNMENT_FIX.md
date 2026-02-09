# Rider Assignment Fix

## Problem
The rider assignment feature was failing with the error: **"Failed to update pickup status"**

## Root Cause
There was a **field name mismatch** between the frontend code and the database schema:
- **Frontend/Redux**: Used `riderId`
- **Database Schema**: Uses `driverId`

When trying to assign a rider to a pickup, the API was attempting to update a non-existent `riderId` field in the database, causing the update to fail.

## Solution
Fixed the field mapping in three locations:

### 1. API Route (`app/api/pickups/[id]/route.ts`)
```typescript
// Before
if (riderId !== undefined) updateData.riderId = riderId;

// After
if (riderId !== undefined) updateData.driverId = riderId;
```

### 2. Pickup Interface (`store/slices/pickupSlice.ts`)
```typescript
// Before
riderId?: string;

// After
driverId?: string; // Changed from riderId to match database schema
```

### 3. Pickup Detail Page (`app/(dashboard)/pickups/[id]/page.tsx`)
```typescript
// Before
{pickup.riderId ? `Rider ${pickup.riderId}` : 'Not Assigned'}

// After
{pickup.driverId ? `Rider ${pickup.driverId}` : 'Not Assigned'}
```

## Status
✅ **Fixed** - Rider assignment now works correctly. The frontend still uses `riderId` in the request body for consistency, but the API properly maps it to `driverId` when updating the database.

## Testing
To test the fix:
1. Go to Pickups page
2. Click on a pickup with "Requested" status
3. Click "Assign Rider"
4. Select a rider from the dropdown
5. Click "Assign"
6. The pickup status should update to "Assigned" and the rider should be displayed
