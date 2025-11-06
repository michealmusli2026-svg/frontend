import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { loginRoute } from "../../api/routes";

// Async thunk for login
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(loginRoute, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState: { auth: null, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.auth = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.auth = null;
        state.error = action.payload;
      });
  },
});

export default loginSlice.reducer;
