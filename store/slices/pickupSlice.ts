import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export interface Pickup {
  id: string;
  requestId: string;
  scheduledDate: string; // ISO string
  address: string;
  serviceType: string;
  status: 'Requested' | 'Assigned' | 'Picked' | 'Failed';
  driverId?: string; // Changed from riderId to match database schema
  failureReason?: string;
  remarks?: string;
  location: string; // For filtering
  contactName: string;
  contactPhone: string;
  awbNumber: string;
  itemCount?: number;
  estimatedWeight?: number;
  customerName?: string;
  customerPhone?: string;
}

interface PickupState {
  items: Pickup[];
  loading: boolean;
  error: string | null;
}

const initialState: PickupState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchPickups = createAsyncThunk(
  'pickups/fetch',
  async () => {
    const response = await fetch('/api/pickups');
    if (!response.ok) throw new Error('Failed to fetch pickups');
    return await response.json();
  }
);

export const schedulePickup = createAsyncThunk(
  'pickups/schedule',
  async (pickupData: Partial<Pickup>) => {
    const response = await fetch('/api/pickups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pickupData),
    });
    if (!response.ok) throw new Error('Failed to schedule pickup');
    return await response.json();
  }
);

export const updatePickupStatus = createAsyncThunk(
  'pickups/updateStatus',
  async ({ id, status, failureReason, remarks, riderId }: { id: string; status: Pickup['status']; failureReason?: string; remarks?: string; riderId?: string }) => {
    const response = await fetch(`/api/pickups/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, failureReason, remarks, riderId }),
    });
    if (!response.ok) throw new Error('Failed to update pickup status');
    return await response.json();
  }
);

const pickupSlice = createSlice({
  name: 'pickups',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPickups.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPickups.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPickups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch pickups';
      })
      .addCase(schedulePickup.pending, (state) => {
        state.loading = true;
      })
      .addCase(schedulePickup.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(schedulePickup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to schedule pickup';
      })
      .addCase(updatePickupStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePickupStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updatePickupStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update pickup status';
      });
  },
});

export default pickupSlice.reducer;
