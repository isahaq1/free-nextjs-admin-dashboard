import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/app/api/axiosInstance";

export interface Product {
  id: number | string;
  name: string;
  details: string;
  price: number;
  category: {
    name: string;
    // other category fields...
  };
  model: {
    name: string;
    // other model fields...
  };
  image: string;
}

interface ProductState {
  products: Product[];
  productDetails?: Product | null;
  loading: boolean;
  error?: string | null;
}

const initialState: ProductState = {
  products: [],
  productDetails: null,
  loading: false,
  error: null,
};

// Async actions
export const listProducts = createAsyncThunk(
  "products/list",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/products");

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error fetching products",
      );
    }
  },
);

export const createProduct = createAsyncThunk(
  "products/create",
  async (productData: FormData, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        "/products/create",
        productData,
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error creating product",
      );
    }
  },
);

export const getProductDetails = createAsyncThunk(
  "products/details",
  async (id: number, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error fetching product details",
      );
    }
  },
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async (
    { id, productData }: { id: number | string; productData: FormData },
    thunkAPI,
  ) => {
    try {
      const response = await axiosInstance.put(`/products/${id}`, productData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating product",
      );
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: number, thunkAPI) => {
    try {
      await axiosInstance.delete(`/products/${id}`);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error deleting product",
      );
    }
  },
);

// Slice
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // List products
    builder.addCase(listProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(listProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload;
    });
    builder.addCase(listProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create product
    builder.addCase(createProduct.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.products.push(action.payload);
    });
    builder.addCase(createProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Get product details
    builder.addCase(getProductDetails.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getProductDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.productDetails = action.payload;
    });
    builder.addCase(getProductDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update product
    builder.addCase(updateProduct.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) state.products[index] = action.payload;
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete product
    builder.addCase(deleteProduct.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.products = state.products.filter(
        (product) => product.id !== action.payload,
      );
    });
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default productSlice.reducer;
