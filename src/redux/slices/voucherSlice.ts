import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/app/api/axiosInstance";

interface VoucherDetail {
  accCoaId: number;
  accCostCenterId: number;
  creditAmountBk: number;
  debitAmountBk: number;
  masterRef: string;
  refAccCoaId: number;
  ledgerText: string;
  lineText: string;
  accFlexId: number;
  accProfitCenterId: number;
  bpId: number;
  bpCode: string;
  ccCode: string;
  glCode: string;
  orderNo: string;
  pcCode: string;
  spGlCode: string;
  debitAmount: number;
  creditAmount: number;
}

export interface Voucher {
  id?: number;
  type: string;
  voucherNo: string;
  voucherDate: string;
  chequeDate: string;
  chequeNo: string;
  narration: string;
  voucherStatus: number;
  totalAmount: number;
  createById: number;
  companyId: number;
  companyCode: string;
  amount: number;
  description: string;
  vendorId: number;
  voucherDetails: VoucherDetail[];
}

interface VoucherState {
  vouchers: Voucher[];
  voucherDetails: Voucher | null;
  loading: boolean;
  error: string | null;
}

const initialState: VoucherState = {
  vouchers: [],
  voucherDetails: null,
  loading: false,
  error: null,
};

// Async actions
export const listVouchers = createAsyncThunk(
  "vouchers/list",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/vouchers");
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error fetching vouchers",
      );
    }
  },
);

export const createVoucher = createAsyncThunk(
  "vouchers/create",
  async (voucherData: Voucher, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        "/vouchers/create",
        voucherData,
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error creating voucher",
      );
    }
  },
);

export const getVoucherDetails = createAsyncThunk(
  "vouchers/details",
  async (id: number, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/vouchers/${id}`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error fetching voucher details",
      );
    }
  },
);

export const updateVoucher = createAsyncThunk(
  "vouchers/update",
  async (
    { id, voucherData }: { id: number; voucherData: Voucher },
    thunkAPI,
  ) => {
    try {
      const response = await axiosInstance.put(`/vouchers/${id}`, voucherData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error updating voucher",
      );
    }
  },
);

// Slice
const voucherSlice = createSlice({
  name: "vouchers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // List vouchers
    builder.addCase(listVouchers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(listVouchers.fulfilled, (state, action) => {
      state.loading = false;
      state.vouchers = action.payload;
      state.error = null;
    });
    builder.addCase(listVouchers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create voucher
    builder.addCase(createVoucher.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createVoucher.fulfilled, (state, action) => {
      state.loading = false;
      state.vouchers.push(action.payload);
      state.error = null;
    });
    builder.addCase(createVoucher.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Get voucher details
    builder.addCase(getVoucherDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getVoucherDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.voucherDetails = action.payload;
      state.error = null;
    });
    builder.addCase(getVoucherDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update voucher
    builder.addCase(updateVoucher.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateVoucher.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.vouchers.findIndex((v) => v.id === action.payload.id);
      if (index !== -1) {
        state.vouchers[index] = action.payload;
      }
      state.error = null;
    });
    builder.addCase(updateVoucher.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default voucherSlice.reducer;
