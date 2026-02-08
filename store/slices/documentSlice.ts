import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export interface Manifest {
  id: string;
  manifestRef: string;
  date: string;
  status: 'Open' | 'Closed';
  shipmentCount: number;
  shipmentIds: string[];
  generatedBy: string;
  closedAt?: string;
}

interface DocumentState {
  manifests: Manifest[];
  loading: boolean;
  error: string | null;
}

const initialState: DocumentState = {
  manifests: [],
  loading: false,
  error: null,
};

export const fetchManifests = createAsyncThunk(
  'documents/fetchManifests',
  async () => {
    const response = await fetch('/api/manifests');
    if (!response.ok) throw new Error('Failed to fetch manifests');
    const data = await response.json();
    return data.map((m: any) => ({
      id: m.id,
      manifestRef: m.manifestRef,
      date: m.date,
      status: m.status,
      shipmentCount: m.shipments?.length || 0,
      shipmentIds: m.shipments?.map((s: any) => s.id) || [],
      generatedBy: m.generatedBy,
      closedAt: m.closedAt,
    }));
  }
);

export const createManifest = createAsyncThunk(
  'documents/createManifest',
  async (shipmentIds: string[]) => {
    const response = await fetch('/api/manifests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shipmentIds }),
    });
    if (!response.ok) throw new Error('Failed to create manifest');
    const m = await response.json();
    return {
      id: m.id,
      manifestRef: m.manifestRef,
      date: m.date,
      status: m.status,
      shipmentCount: m.shipments?.length || 0,
      shipmentIds: m.shipments?.map((s: any) => s.id) || [],
      generatedBy: m.generatedBy,
      closedAt: m.closedAt,
    };
  }
);

export const closeManifest = createAsyncThunk(
  'documents/closeManifest',
  async (id: string) => {
    const response = await fetch(`/api/manifests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Closed' }),
    });
    if (!response.ok) throw new Error('Failed to close manifest');
    const m = await response.json();
    return {
      id: m.id,
      manifestRef: m.manifestRef,
      date: m.date,
      status: m.status,
      shipmentCount: m.shipments?.length || 0,
      shipmentIds: m.shipments?.map((s: any) => s.id) || [],
      generatedBy: m.generatedBy,
      closedAt: m.closedAt,
    };
  }
);

const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    addManifest: (state, action: PayloadAction<Manifest>) => {
      state.manifests.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchManifests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchManifests.fulfilled, (state, action) => {
        state.loading = false;
        state.manifests = action.payload;
      })
      .addCase(createManifest.pending, (state) => {
        state.loading = true;
      })
      .addCase(createManifest.fulfilled, (state, action) => {
        state.loading = false;
        state.manifests.unshift(action.payload);
      })
      .addCase(createManifest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create manifest';
      })
      .addCase(closeManifest.fulfilled, (state, action) => {
        const index = state.manifests.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.manifests[index] = action.payload;
        }
      });
  }
});

export const { addManifest } = documentSlice.actions;
export default documentSlice.reducer;
