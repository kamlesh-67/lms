import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export interface Location {
  lat: number;
  lng: number;
  timestamp: string;
}

export interface Rider {
  id: string;
  name: string;
  location: Location;
  status: 'Idle' | 'Moving' | 'Offline';
  currentShipmentId?: string;
}

interface TrackingState {
  riders: Rider[];
  selectedRiderId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: TrackingState = {
  riders: [
    {
      id: 'R001',
      name: 'Ahmed Khan',
      location: { lat: 25.2048, lng: 55.2708, timestamp: new Date().toISOString() }, // Dubai
      status: 'Moving',
      currentShipmentId: 'SHP12345'
    },
    {
        id: 'R002',
        name: 'John Smith',
        location: { lat: 25.0657, lng: 55.1713, timestamp: new Date().toISOString() }, // Dubai Marina
        status: 'Idle'
    }
  ],
  selectedRiderId: null,
  loading: false,
  error: null,
};

// Async thunk to simulate rider movement
export const simulateRiderMovement = createAsyncThunk(
    'tracking/simulateMovement',
    async (riderId: string) => {
        return new Promise<{ riderId: string; location: Location }>((resolve) => {
            // Simulate random movement around Dubai
            const randomLat = (Math.random() - 0.5) * 0.001;
            const randomLng = (Math.random() - 0.5) * 0.001;
            
            setTimeout(() => {
                resolve({
                    riderId,
                    location: {
                        lat: 25.2048 + randomLat, // Base near Dubai Frame
                        lng: 55.2708 + randomLng,
                        timestamp: new Date().toISOString()
                    }
                });
            }, 500);
        });
    }
);

const trackingSlice = createSlice({
  name: 'tracking',
  initialState,
  reducers: {
    selectRider(state, action: PayloadAction<string>) {
      state.selectedRiderId = action.payload;
    },
    updateRiderLocation(state, action: PayloadAction<{ riderId: string; location: Location }>) {
        const rider = state.riders.find(r => r.id === action.payload.riderId);
        if (rider) {
            rider.location = action.payload.location;
        }
    }
  },
  extraReducers: (builder) => {
      builder.addCase(simulateRiderMovement.fulfilled, (state, action) => {
          const rider = state.riders.find(r => r.id === action.payload.riderId);
          if (rider) {
              // In a real app, this would update based on the simulation result relative to current position
              // For now, we just take the new "random" nearby location
              rider.location = {
                  lat: rider.location.lat + (Math.random() - 0.5) * 0.002,
                  lng: rider.location.lng + (Math.random() - 0.5) * 0.002,
                  timestamp: action.payload.location.timestamp
              };
          }
      });
  }
});

export const { selectRider, updateRiderLocation } = trackingSlice.actions;
export default trackingSlice.reducer;
