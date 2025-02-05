import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/app/api/axiosInstance";

export interface Vendor {
  id: number | string;
  name: string;
  status: boolean;
}

interface VendorState {
  vendors: Vendor[];
  vendorDetails?: Vendor | null;
  loading: boolean;
  error?: string | null;
}

const initialState: VendorState = {
  vendors: [],
  vendorDetails: null,
  loading: false,
  error: null,
};

// Async actions
export const listVendors = createAsyncThunk(
  "vendors/list",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/vendors");
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error fetching vendors",
      );
    }
  },
);

export const createVendor = createAsyncThunk(
  "vendors/create",
  async (vendorData: { name: string }, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/vendors/create", vendorData);

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error creating vendor",
      );
    }
  },
);

export const getVendorDetails = createAsyncThunk(
  "vendors/details",
  async (id: number, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/vendors/${id}`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error fetching vendor details",
      );
    }
  },
);

export const updateVendor = createAsyncThunk(
  "vendors/update",
  async (
    { id, vendorData }: { id: number | string; vendorData: FormData },
    thunkAPI,
  ) => {
    try {
      const response = await axiosInstance.put(`/vendors/${id}`, vendorData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating vendor",
      );
    }
  },
);

export const deleteVendor = createAsyncThunk(
  "vendors/delete",
  async (id: number, thunkAPI) => {
    try {
      await axiosInstance.delete(`/vendors/${id}`);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error deleting vendor",
      );
    }
  },
);

// Slice
const vendorSlice = createSlice({
  name: "vendors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // List vendors
    builder.addCase(listVendors.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(listVendors.fulfilled, (state, action) => {
      state.loading = false;
      state.vendors = action.payload;
    });
    builder.addCase(listVendors.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create vendor
    builder.addCase(createVendor.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createVendor.fulfilled, (state, action) => {
      state.loading = false;
      state.vendors.push(action.payload);
    });
    builder.addCase(createVendor.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Get vendor details
    builder.addCase(getVendorDetails.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getVendorDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.vendorDetails = action.payload;
    });
    builder.addCase(getVendorDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update vendor
    builder.addCase(updateVendor.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateVendor.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.vendors.findIndex((v) => v.id === action.payload.id);
      if (index !== -1) state.vendors[index] = action.payload;
    });
    builder.addCase(updateVendor.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete vendor
    builder.addCase(deleteVendor.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteVendor.fulfilled, (state, action) => {
      state.loading = false;
      state.vendors = state.vendors.filter(
        (vendor) => vendor.id !== action.payload,
      );
    });
    builder.addCase(deleteVendor.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default vendorSlice.reducer;
