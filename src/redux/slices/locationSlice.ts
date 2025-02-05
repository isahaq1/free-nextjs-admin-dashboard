import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/app/api/axiosInstance";

export interface Location {
  id: number | string;
  name: string;
  address: string;
  contact: string;
  locationType: number;
  status: boolean;
}

interface LocationState {
  locations: Location[];
  locationDetails?: Location | null;
  loading: boolean;
  error?: string | null;
}

const initialState: LocationState = {
  locations: [],
  locationDetails: null,
  loading: false,
  error: null,
};

// Async actions
export const listLocations = createAsyncThunk(
  "locations/list",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/locations");

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error fetching vendors",
      );
    }
  },
);

//warehouse list
export const listWarehouses = createAsyncThunk(
  "warehouse/list",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/locations/warehouseList");
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error fetching vendors",
      );
    }
  },
);
//store list
export const listStores = createAsyncThunk(
  "store/list",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/locations/storeList");
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error fetching vendors",
      );
    }
  },
);

export const createLocation = createAsyncThunk(
  "locations/create",
  async (locationData: { name: string }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        "/locations/create",
        locationData,
      );

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error creating location",
      );
    }
  },
);

export const getLocationDetails = createAsyncThunk(
  "locations/details",
  async (id: number, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/locations/${id}`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error fetching location details",
      );
    }
  },
);

export const updateLocation = createAsyncThunk(
  "locations/update",
  async (
    { id, locationData }: { id: number | string; locationData: FormData },
    thunkAPI,
  ) => {
    try {
      const response = await axiosInstance.put(
        `/locations/${id}`,
        locationData,
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating location",
      );
    }
  },
);

export const deleteLocation = createAsyncThunk(
  "locations/delete",
  async (id: number, thunkAPI) => {
    try {
      await axiosInstance.delete(`/locations/${id}`);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error deleting location",
      );
    }
  },
);

// Slice
const locationSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // List locations
    builder.addCase(listLocations.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(listLocations.fulfilled, (state, action) => {
      state.loading = false;
      state.locations = action.payload;
    });
    builder.addCase(listLocations.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    //warehouser list
    builder.addCase(listWarehouses.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(listWarehouses.fulfilled, (state, action) => {
      state.loading = false;
      state.locations = action.payload;
    });
    builder.addCase(listWarehouses.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    //store list
    builder.addCase(listStores.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(listStores.fulfilled, (state, action) => {
      state.loading = false;
      state.locations = action.payload;
    });
    builder.addCase(listStores.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    // Create location
    builder.addCase(createLocation.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createLocation.fulfilled, (state, action) => {
      state.loading = false;
      state.locations.push(action.payload);
    });
    builder.addCase(createLocation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Get location details
    builder.addCase(getLocationDetails.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getLocationDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.locationDetails = action.payload;
    });
    builder.addCase(getLocationDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update location
    builder.addCase(updateLocation.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateLocation.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.locations.findIndex(
        (v) => v.id === action.payload.id,
      );
      if (index !== -1) state.locations[index] = action.payload;
    });
    builder.addCase(updateLocation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete location
    builder.addCase(deleteLocation.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteLocation.fulfilled, (state, action) => {
      state.loading = false;
      state.locations = state.locations.filter(
        (location) => location.id !== action.payload,
      );
    });
    builder.addCase(deleteLocation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default locationSlice.reducer;
