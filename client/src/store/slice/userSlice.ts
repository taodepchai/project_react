import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../../interface/types";

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsers:any = createAsyncThunk("user/fetchUsers", async () => {
  const response = await axios.get("http://localhost:3000/account");
  return response.data;
});

export const createUser:any = createAsyncThunk(
  "user/createUser",
  async (user: User[]) => {
    const response = await axios.post("http://localhost:3000/account", user);
    return response.data;
  }
);

export const updateUser:any = createAsyncThunk(
  "user/updateUser",
  async (user: User) => {
    const response = await axios.put(`http://localhost:3000/account/${user.id}`, user);
    return response.data;
  }
);

export const removeUser:any = createAsyncThunk(
  "user/removeUser",
  async (id: number) => {
    await axios.delete(`http://localhost:3000/account/${id}`);
    return id;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        const index = state.users.findIndex((user:User) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(removeUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.users = state.users.filter((user:User) => user.id !== action.payload);
      });
  },
});

export default userSlice.reducer;
