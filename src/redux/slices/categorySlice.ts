import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/app/api/axiosInstance";

interface Category {
  id: string;
  name: string;
  status: string;
}

interface CategoryState {
  categories: Category[];
  categoryDetails: Category | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  pageNo: number;
}

const initialState: CategoryState = {
  categories: [],
  categoryDetails: null,
  loading: false,
  error: null,
  totalPages: 1,
  pageNo: 0,
};

// Create Category
export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (categoryData: { name: string }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        "/categories/create",
        categoryData,
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "An error occurred",
      );
    }
  },
);

// Fetch Category Details
export const fetchCategoryDetails = createAsyncThunk(
  "category/fetchCategoryDetails",
  async (id: string, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/categories/${id}`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "An error occurred",
      );
    }
  },
);

// List Categories
export const listCategories = createAsyncThunk(
  "category/listCategories",
  async ({ page, size }: { page: number; size: number }, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/categories/list`, {
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

// Edit Category
export const editCategory = createAsyncThunk(
  "category/editCategory",
  async (
    {
      id,
      categoryData,
    }: { id: string; categoryData: { name: string; status: string } },
    thunkAPI,
  ) => {
    try {
      const response = await axiosInstance.put(
        `/categories/${id}`,
        categoryData,
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "An error occurred",
      );
    }
  },
);

// Delete Category
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id: string, thunkAPI) => {
    try {
      await axiosInstance.delete(`/categories/${id}`);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "An error occurred",
      );
    }
  },
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createCategory.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.loading = false;
          state.categories.push(action.payload);
        },
      )
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCategoryDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCategoryDetails.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.loading = false;
          state.categoryDetails = action.payload;
        },
      )
      .addCase(fetchCategoryDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(listCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        listCategories.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;

          // Map data if necessary
          state.categories = action.payload.data?.content || [];
          state.pageNo = action.payload.data?.pageNo || 0;
          state.totalPages = action.payload.data?.totalPages || 1;
        },
      )
      .addCase(listCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(editCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        editCategory.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.loading = false;
          const index = state.categories.findIndex(
            (category) => category.id === action.payload.id,
          );
          if (index !== -1) {
            state.categories[index] = action.payload;
          }
        },
      )
      .addCase(editCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteCategory.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.categories = state.categories.filter(
            (category) => category.id !== action.payload,
          );
        },
      )
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default categorySlice.reducer;
