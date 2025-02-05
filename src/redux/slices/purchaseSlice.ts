import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/app/api/axiosInstance";

interface PurchaseDetail {
  productId: number;
  rate: number;
  qty: number;
  vat: number;
  tax: number;
  discount: number;
  total: number;
}

interface Purchase {
  id?: number;
  purchaseDate: string;
  totalAmount: number;
  totalVat: number;
  totalTax: number;
  totalDiscount: number;
  vendorId: number;
  warehouseId: number;
  createdBy: string;
  updatedBy: string;
  purchaseDetails: PurchaseDetail[];
}

interface PurchaseState {
  purchases: Purchase[];
  purchaseDetails?: Purchase | null;
  loading: boolean;
  error?: string | null;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

const initialState: PurchaseState = {
  purchases: [],
  purchaseDetails: null,
  loading: false,
  error: null,
  currentPage: 0,
  totalPages: 1,
  pageSize: 10,
};

// Create Purchase
export const createPurchase = createAsyncThunk(
  "purchase/createPurchase",
  async (purchaseData: Purchase, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/purchases", purchaseData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "An error occurred",
      );
    }
  },
);

// Fetch Purchase Details
export const fetchPurchaseDetails = createAsyncThunk(
  "purchase/fetchPurchaseDetails",
  async (id: number, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `/purchases/purchaseDetails/${id}`,
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "An error occurred",
      );
    }
  },
);

// List Purchases with Pagination
export const listPurchases = createAsyncThunk(
  "purchase/listPurchases",

  async ({ page, size }: { page: number; size: number }, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/purchases/list`, {
        params: { page, size },
      });

      console.log(response.data);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "An error occurred",
      );
    }
  },
);

// Update Purchase
export const updatePurchase = createAsyncThunk(
  "purchase/updatePurchase",
  async (
    { id, purchaseData }: { id: number; purchaseData: Purchase },
    thunkAPI,
  ) => {
    try {
      const response = await axiosInstance.put(
        `/purchases/${id}`,
        purchaseData,
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "An error occurred",
      );
    }
  },
);

// Delete Purchase
export const deletePurchase = createAsyncThunk(
  "purchase/deletePurchase",
  async (id: number, thunkAPI) => {
    try {
      await axiosInstance.delete(`/purchases/${id}`);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "An error occurred",
      );
    }
  },
);

const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPurchase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPurchase.fulfilled, (state, action) => {
        state.loading = false;
        state.purchases.push(action.payload);
      })
      .addCase(createPurchase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPurchaseDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseDetails = action.payload;
      })
      .addCase(fetchPurchaseDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(listPurchases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listPurchases.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;

        // Map data if necessary
        state.purchases = action.payload.data?.content || [];
        state.pageSize = action.payload.data?.pageSize || 0;
        state.currentPage = action.payload.data?.pageNo || 0;
        state.totalPages = action.payload.data?.totalPages || 1;
      })
      .addCase(listPurchases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePurchase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePurchase.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.purchases.findIndex(
          (purchase) => purchase.id === action.payload.id,
        );
        if (index !== -1) {
          state.purchases[index] = action.payload;
        }
      })
      .addCase(updatePurchase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deletePurchase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePurchase.fulfilled, (state, action) => {
        state.loading = false;
        state.purchases = state.purchases.filter(
          (purchase) => purchase.id !== action.payload,
        );
      })
      .addCase(deletePurchase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default purchaseSlice.reducer;
