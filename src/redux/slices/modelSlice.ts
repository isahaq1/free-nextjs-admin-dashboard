import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/app/api/axiosInstance";

interface Model {
  id: string;
  name: string;
  status: string;
}

interface ModelState {
  models: Model[];
  modelDetails: Model | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
}

const initialState: ModelState = {
  models: [],
  modelDetails: null,
  loading: false,
  error: null,
  totalPages: 1,
  pageable: {
    pageNumber: 0,
    pageSize: 10,
  },
};

// Create Model
export const createModel = createAsyncThunk(
  "model/createModel",
  async (modelData: { name: string }, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/models/create", modelData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "An error occurred",
      );
    }
  },
);

// Fetch Model Details
export const fetchModelDetails = createAsyncThunk(
  "model/fetchModelDetails",
  async (id: string, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/models/${id}`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "An error occurred",
      );
    }
  },
);

// List Models
export const listModels = createAsyncThunk(
  "model/listModels",
  async ({ page, size }: { page: number; size: number }, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/models/list`, {
        params: { page, size },
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "An error occurred",
      );
    }
  },
);

// Edit Model
export const editModel = createAsyncThunk(
  "model/editModel",
  async (
    {
      id,
      modelData,
    }: { id: string; modelData: { name: string; status: string } },
    thunkAPI,
  ) => {
    try {
      const response = await axiosInstance.put(`/models/${id}`, modelData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "An error occurred",
      );
    }
  },
);

// Delete Model
export const deleteModel = createAsyncThunk(
  "model/deleteModel",
  async (id: string, thunkAPI) => {
    try {
      await axiosInstance.delete(`/models/${id}`);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "An error occurred",
      );
    }
  },
);

const modelSlice = createSlice({
  name: "model",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createModel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createModel.fulfilled, (state, action: PayloadAction<Model>) => {
        state.loading = false;
        state.models.push(action.payload);
      })
      .addCase(createModel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchModelDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchModelDetails.fulfilled,
        (state, action: PayloadAction<Model>) => {
          state.loading = false;
          state.modelDetails = action.payload;
        },
      )
      .addCase(fetchModelDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(listModels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        listModels.fulfilled,
        (
          state,
          action: PayloadAction<{
            content: Model[];
            pageable: {
              pageNumber: number;
              pageSize: number;
            };
            totalPages: number;
          }>,
        ) => {
          state.loading = false;
          state.models = action.payload.content;
          state.pageable = action.payload.pageable;
          state.totalPages = action.payload.totalPages;
        },
      )
      .addCase(listModels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(editModel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editModel.fulfilled, (state, action: PayloadAction<Model>) => {
        state.loading = false;
        const index = state.models.findIndex(
          (model) => model.id === action.payload.id,
        );
        if (index !== -1) {
          state.models[index] = action.payload;
        }
      })
      .addCase(editModel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteModel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteModel.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.models = state.models.filter(
            (model) => model.id !== action.payload,
          );
        },
      )
      .addCase(deleteModel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default modelSlice.reducer;
