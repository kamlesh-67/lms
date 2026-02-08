import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export interface Shipment {
  id: string;
  awb: string;
  orderId: string;
  consigneeName: string;
  consigneePhone: string;
  address: string;
  origin?: string;
  destination?: string;
  weight: number;
  serviceType: string;
  status: 'Created' | 'Pickup Assigned' | 'Picked' | 'In Transit' | 'Delivered' | 'Failed' | 'Cancelled' | 'Delayed' | 'RTO' | 'Returned';
  cancellationReason?: string;
  isDelayed?: boolean;
  isRTO?: boolean;
  podUrl?: string;
  podSignature?: string;
  manifestId?: string;
  isLocked?: boolean;
  lastScan?: {
    location: string;
    timestamp: string;
    hub?: string;
  };
  timeline: {
    status: string;
    timestamp: string;
    location: string;
  }[];
}

interface ShipmentState {
  items: Shipment[];
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
}

const initialState: ShipmentState = {
  items: [],
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
};

export const fetchShipments = createAsyncThunk(
  'shipments/fetch',
  async ({ page = 1, status = '', search = '' }: { page?: number; status?: string; search?: string } = {}) => {
    let url = `/api/shipments?page=${page}&limit=20`;
    if (status && status !== 'all') url += `&status=${encodeURIComponent(status)}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch shipments');
    return await response.json();
  }
);

export const createShipment = createAsyncThunk(
  'shipments/create',
  async (shipmentData: Partial<Shipment>) => {
    const response = await fetch('/api/shipments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shipmentData),
    });
    if (!response.ok) throw new Error('Failed to create shipment');
    return await response.json();
  }
);

export const updateShipmentStatus = createAsyncThunk(
  'shipments/updateStatus',
  async ({ id, status, location, timestamp, cancellationReason }: { id: string; status: Shipment['status']; location?: string; timestamp?: string; cancellationReason?: string }) => {
    const response = await fetch(`/api/shipments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, location, timestamp, cancellationReason }),
    });
    if (!response.ok) throw new Error('Failed to update shipment status');
    return await response.json();
  }
);

export const updateShipmentDetails = createAsyncThunk(
  'shipments/updateDetails',
  async ({ id, data }: { id: string; data: Partial<Shipment> }) => {
    const response = await fetch(`/api/shipments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update shipment details');
    return await response.json();
  }
);

export const cancelShipment = createAsyncThunk(
  'shipments/cancel',
  async ({ id, reason }: { id: string; reason: string }) => {
    const response = await fetch(`/api/shipments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'Cancelled',
        cancellationReason: reason
      }),
    });
    if (!response.ok) throw new Error('Failed to cancel shipment');
    return await response.json();
  }
);

const shipmentSlice = createSlice({
  name: 'shipments',
  initialState,
  reducers: {
    addShipment: (state, action: PayloadAction<Shipment>) => {
      state.items.push(action.payload);
    },
    assignManifest: (state, action: PayloadAction<{ shipmentIds: string[]; manifestId: string }>) => {
      state.items.forEach(shipment => {
        if (action.payload.shipmentIds.includes(shipment.id)) {
          shipment.manifestId = action.payload.manifestId;
        }
      });
    },
    lockShipments: (state, action: PayloadAction<{ manifestId: string }>) => {
      state.items.forEach(shipment => {
        if (shipment.manifestId === action.payload.manifestId) {
          shipment.isLocked = true;
        }
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShipments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShipments.fulfilled, (state, action) => {
        state.loading = false;
        // Check if payload is paginated response or array (fallback)
        const data = action.payload.data || action.payload;
        const meta = action.payload.meta || { page: 1, totalPages: 1 };

        if (meta.page === 1) {
          state.items = data;
        } else {
          // Avoid duplicates
          const newItems = data.filter((item: Shipment) =>
            !state.items.some(existing => existing.id === item.id)
          );
          state.items = [...state.items, ...newItems];
        }
        state.page = meta.page;
        state.hasMore = meta.page < meta.totalPages;
      })
      .addCase(fetchShipments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch shipments';
      })
      .addCase(createShipment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createShipment.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create shipment';
      })
      .addCase(updateShipmentStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateShipmentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateShipmentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update shipment status';
      })
      .addCase(updateShipmentDetails.fulfilled, (state, action) => {
        const index = state.items.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(cancelShipment.fulfilled, (state, action) => {
        const index = state.items.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { addShipment, assignManifest, lockShipments } = shipmentSlice.actions;
export default shipmentSlice.reducer;
