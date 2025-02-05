import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/app/api/axiosInstance";

interface User {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  checkAdmin: boolean;
  roleId: number;
  role: {
    id: number;
    name: string;
    menus: string[];
  };
  profileImage: string;
}

interface UserState {
  users: User[];
  userDetails: User | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
}

const initialState: UserState = {
  users: [],
  userDetails: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  pageable: {
    pageNumber: 0,
    pageSize: 10,
  },
};

// Fetch Users
export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/users");
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "An error occurred",
      );
    }
  },
);
// Fetch Users with Pagination
export const fetchUsersWithPagination = createAsyncThunk(
  "user/fetchUsersWithPagination",
  async ({ page, size }: { page: number; size: number }, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/users/list`, {
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
// Fetch User Details
export const fetchUserDetails = createAsyncThunk(
  "user/fetchUserDetails",
  async (id: string, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/users/${id}`);

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "An error occurred",
      );
    }
  },
);

// Create User
export const createUser = createAsyncThunk(
  "user/createUser",
  async (userData: Omit<User, "id">, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/users", userData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "An error occurred",
      );
    }
  },
);

// Update User
export const updateUser = createAsyncThunk(
  "user/updateUser",

  async ({ id, userData }: { id: string; userData: FormData }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/users/${id}`, userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

// Delete User
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id: string, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/users/${id}`);
      return { id };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "An error occurred",
      );
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch User Details
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.userDetails = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetails = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create User
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload); // Add the new user to the state
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetails = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = "Failed to update user.";
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(
          (user) => user.id !== action.payload.id,
        ); // Remove the user from the state
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUsersWithPagination.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUsersWithPagination.fulfilled,
        (
          state,
          action: PayloadAction<{
            content: User[];
            pageable: {
              pageNumber: number;
              pageSize: number;
            };
            totalPages: number;
          }>,
        ) => {
          state.loading = false;
          state.users = action.payload.content;
          state.pageable = action.payload.pageable;
          state.totalPages = action.payload.totalPages;
        },
      )
      .addCase(fetchUsersWithPagination.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
