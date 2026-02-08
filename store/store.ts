import { configureStore } from '@reduxjs/toolkit'
import shipmentReducer from './slices/shipmentSlice'
import pickupReducer from './slices/pickupSlice'
import trackingReducer from './slices/trackingSlice'
import documentReducer from './slices/documentSlice'
import adminReducer from './slices/adminSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      shipments: shipmentReducer,
      pickups: pickupReducer,
      tracking: trackingReducer,
      documents: documentReducer,
      admin: adminReducer,
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
