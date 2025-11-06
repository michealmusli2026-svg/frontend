import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { commoditedRoute, getAllEnums } from "../../api/routes";

// Async thunk for login
export const enumCall = createAsyncThunk(
  "enums/fetchAll",
  async (_,{ rejectWithValue }) => {
    try {
      const response = await axios.get(getAllEnums);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Enum failed");
    }
  }
);

export const addCommodity = createAsyncThunk(
  "enums/addCommodity",
  async(name , {rejectWithValue}) => {
    try {
      const response = await axios.post(commoditedRoute,name)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Adding Commodities failed");
      
    }
  }
)

const enumSlice = createSlice({
  name: "enums",
  initialState: { data: null, error: null, addCommodity: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(enumCall.fulfilled, (state, action) => {
        state.data = action.payload;
        state.error = null;
      })
      .addCase(enumCall.rejected, (state, action) => {
        state.data = null;
        state.error = action.payload;
      })
       .addCase(addCommodity.fulfilled, (state, action) => {
        state.addCommodity = action.payload;
        state.error = null;
      })
      .addCase(addCommodity.rejected, (state, action) => {
        state.addCommodity = null;
        state.error = action.payload;
      });
  },
});

export default enumSlice.reducer;
