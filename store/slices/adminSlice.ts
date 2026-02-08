import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface ApiHistoryEntry {
  id: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  statusCode: number;
  durationMs: number;
  timestamp: string;
  userId?: string;
  payload?: any;
  response?: any;
}

interface AdminState {
  auditLogs: AuditLog[];
  apiHistory: ApiHistoryEntry[];
  loading: boolean;
  error: string | null;
}

const mockAuditLogs: AuditLog[] = [
  {
    id: 'aud-1',
    userId: 'u-1',
    userName: 'Administrator',
    action: 'LOGIN',
    entityType: 'USER',
    entityId: 'u-1',
    details: 'User logged in successfully',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    ipAddress: '192.168.1.1'
  },
  {
    id: 'aud-2',
    userId: 'u-2',
    userName: 'Ops Manager',
    action: 'CREATE_SHIPMENT',
    entityType: 'SHIPMENT',
    entityId: 'shp-101',
    details: 'Created shipment AWB-998877',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    ipAddress: '192.168.1.5'
  },
  {
    id: 'aud-3',
    userId: 'u-2',
    userName: 'Ops Manager',
    action: 'UPDATE_STATUS',
    entityType: 'SHIPMENT',
    entityId: 'shp-101',
    details: 'Updated status to Pickup Assigned',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    ipAddress: '192.168.1.5'
  },
  {
    id: 'aud-4',
    userId: 'u-1',
    userName: 'Administrator',
    action: 'CLOSE_MANIFEST',
    entityType: 'MANIFEST',
    entityId: 'MAN-005',
    details: 'Closed daily manifest with 45 shipments',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    ipAddress: '192.168.1.1'
  }
];

const mockApiHistory: ApiHistoryEntry[] = [
  {
    id: 'api-1',
    endpoint: '/api/auth/login',
    method: 'POST',
    statusCode: 200,
    durationMs: 150,
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    userId: 'u-1',
    payload: { email: "admin@lmd.com", password: "***" },
    response: { token: "jwt_token", user: { id: "u-1", name: "Admin" } }
  },
  {
    id: 'api-2',
    endpoint: '/api/shipments',
    method: 'GET',
    statusCode: 200,
    durationMs: 45,
    timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    userId: 'u-1',
    payload: { page: 1, limit: 10 },
    response: { data: [], total: 100 }
  },
  {
    id: 'api-3',
    endpoint: '/api/shipments',
    method: 'POST',
    statusCode: 201,
    durationMs: 230,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    userId: 'u-2',
    payload: { awb: "AWB123", consignee: "John Doe" },
    response: { id: "shp-101", status: "Created" }
  },
  {
    id: 'api-4',
    endpoint: '/api/pickups/schedule',
    method: 'POST',
    statusCode: 400,
    durationMs: 80,
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    userId: 'u-3',
    payload: { address: "Unknown", date: "invalid-date" },
    response: { error: "Invalid date format" }
  },
  {
    id: 'api-5',
    endpoint: '/api/tracking/update',
    method: 'POST',
    statusCode: 200,
    durationMs: 60,
    timestamp: new Date(Date.now() - 1000 * 30).toISOString(),
    payload: { lat: 25.2048, lng: 55.2708 },
    response: { success: true }
  }
];

const initialState: AdminState = {
  auditLogs: [],
  apiHistory: [],
  loading: false,
  error: null,
};

export const fetchAuditLogs = createAsyncThunk(
  'admin/fetchAuditLogs',
  async () => {
    const response = await fetch('/api/admin/audit');
    if (!response.ok) throw new Error('Failed to fetch audit logs');
    return await response.json();
  }
);

export const fetchApiHistory = createAsyncThunk(
  'admin/fetchApiHistory',
  async () => {
    const response = await fetch('/api/admin/api-history');
    if (!response.ok) throw new Error('Failed to fetch API history');
    return await response.json();
  }
);

export const retriggerApiRequest = createAsyncThunk(
  'admin/retriggerApiRequest',
  async (requestId: string) => {
    // This would typically call an endpoint to re-execute the request
    // For now, we'll simulate it or implement a real one later
    return new Promise<{ id: string; success: boolean }>((resolve) => {
      setTimeout(() => {
        resolve({ id: requestId, success: true });
      }, 1000);
    });
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    addApiHistoryEntry: (state, action: PayloadAction<ApiHistoryEntry>) => {
      state.apiHistory.unshift(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.auditLogs = action.payload;
      })
      .addCase(fetchApiHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApiHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.apiHistory = action.payload;
      })
      .addCase(retriggerApiRequest.fulfilled, (state, action) => {
        // In a real app, we might fetch the new history entry or add it if returned
        // For now, we just acknowledge success
      });
  },
});

export const { addApiHistoryEntry } = adminSlice.actions;
export default adminSlice.reducer;
