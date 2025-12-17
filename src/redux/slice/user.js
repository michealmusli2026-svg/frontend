import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getUserRoute } from "../../api/routes";
import { useEffect } from "react";

// Async thunk for login
export const fetchUser = createAsyncThunk(
  "user/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(getUserRoute);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchUserBalance = createAsyncThunk(
  "user/fetchBalance",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${getUserRoute}/balance/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchUserTrade = createAsyncThunk(
  "user/fetchTrade",
  async ({userId,order,complete,offset}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${getUserRoute}/trade/${userId}/${order}/${complete}/${offset}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchUserHoldings = createAsyncThunk(
  "user/fetchHoldings",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${getUserRoute}/holdings/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createUser = createAsyncThunk(
  "user/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(getUserRoute, userData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
)
export const createCustomer = createAsyncThunk(
  "user/createCustomer",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${getUserRoute}/create/party`, userData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
)

export const fetchParty = createAsyncThunk(
  "user/fetchParty",
  async ({userId}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${getUserRoute}/party/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateUserTrade = createAsyncThunk(
  "user/tradeUpdate",
  async (tradeId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${getUserRoute}/trade/update`, tradeId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
)
const userSlice = createSlice({
  name: "user",
  initialState: { createUser: null, createCustomer: null, data: null, error: null, balance: null, trade: null, holdings: null , party:null ,update:null},
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.createCustomer = action.payload;
        state.error = null;
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.createCustomer = null;
        state.error = action.payload;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.createUser = action.payload;
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.createUser = null;
        state.error = action.payload;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.data = null;
        state.error = action.payload;
      })
      .addCase(fetchUserBalance.fulfilled, (state, action) => {
        state.balance = action.payload;
        state.error = null;
      })
      .addCase(fetchUserBalance.rejected, (state, action) => {
        state.balance = null;
        state.error = action.payload;
      })
      .addCase(fetchUserTrade.fulfilled, (state, action) => {
        state.trade = action.payload;
        state.error = null;
      })
      .addCase(fetchUserTrade.rejected, (state, action) => {
        state.trade = null;
        state.error = action.payload;
      })
      .addCase(fetchUserHoldings.fulfilled, (state, action) => {
        state.holdings = action.payload;
        state.error = null;
      })
      .addCase(fetchUserHoldings.rejected, (state, action) => {
        state.holdings = null;
        state.error = action.payload;
      })
       .addCase(fetchParty.fulfilled, (state, action) => {
        state.party = action.payload;
        state.error = null;
      })
      .addCase(fetchParty.rejected, (state, action) => {
        state.party = null;
        state.error = action.payload;
      })
       .addCase(updateUserTrade.fulfilled, (state, action) => {
        state.update = action.payload;
        state.error = null;
      })
      .addCase(updateUserTrade.rejected, (state, action) => {
        state.update = null;
        state.error = action.payload;
      });
  },
});


export default userSlice.reducer;
