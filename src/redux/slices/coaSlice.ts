import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/app/api/axiosInstance";

interface Coa {
  id?: number;
  coaName: string;
  coaType: string;
  isGroupHead: number;
  keyWord: string;
  parentId: number;
  sortBy: number;
  groupName: string;
  groupCode: string;
  companyCode: string;
  isSpecialGl: number;
  gcBk: string;
}

interface CoaState {
  coas: Coa[];
  loading: boolean;
  error: string | null;
}

const initialState: CoaState = {
  coas: [],
  loading: false,
  error: null,
};

// Async thunks for API calls
export const fetchCoas = createAsyncThunk("coa/fetchCoas", async () => {
  const response = await axiosInstance.get("coa/list");
  return response.data;
});

export const createCoa = createAsyncThunk(
  "coa/createCoa",
  async (newCoa: Coa) => {
    const response = await axiosInstance.post("coa/create", newCoa);
    return response.data;
  },
);

export const deleteCoa = createAsyncThunk(
  "coa/deleteCoa",
  async (id: number) => {
    await axiosInstance.delete(`/api/coa/${id}`);
    return id;
  },
);

export const updateCoa = createAsyncThunk(
  "coa/updateCoa",
  async (updatedCoa: Coa) => {
    const response = await axiosInstance.put(
      `/api/coas/${updatedCoa.id}`,
      updatedCoa,
    );
    return response.data;
  },
);

const coaSlice = createSlice({
  name: "coa",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoas.fulfilled, (state, action: PayloadAction<Coa[]>) => {
        state.loading = false;
        state.coas = action.payload;
      })
      .addCase(fetchCoas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch COAs";
      })
      .addCase(createCoa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCoa.fulfilled, (state, action: PayloadAction<Coa>) => {
        state.loading = false;
        state.coas.push(action.payload);
      })
      .addCase(createCoa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create COA";
      })
      .addCase(deleteCoa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCoa.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.coas = state.coas.filter((coa) => coa.id !== action.payload);
      })
      .addCase(deleteCoa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete COA";
      })
      .addCase(updateCoa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCoa.fulfilled, (state, action: PayloadAction<Coa>) => {
        state.loading = false;
        const index = state.coas.findIndex(
          (coa) => coa.id === action.payload.id,
        );
        if (index !== -1) {
          state.coas[index] = action.payload;
        }
      })
      .addCase(updateCoa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update COA";
      });
  },
});

export default coaSlice.reducer;
