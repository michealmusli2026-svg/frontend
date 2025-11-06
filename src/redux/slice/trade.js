import { saveTradeRoute, executeTradesRoute } from "../../api/routes";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { useEffect } from "react";

export const saveTrade = createAsyncThunk(
  "trade/save",
  async (tradeData, { rejectWithValue }) => {
    try {
      const response = await axios.post(saveTradeRoute, tradeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Save trade failed");
    }
  }
);

export const executeTrade = createAsyncThunk(
  "trade/execute",
  async (tradeData, { rejectWithValue }) => {
    try {
      console.log("Executing trade with data:", tradeData);
      const response = await axios.post(executeTradesRoute, tradeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Save trade failed");
    }
  }
);

export const getAllTrades = createAsyncThunk(
  "trade/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(executeTradesRoute);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Fetch trades failed");
    }
  }
);

export const deleteTrade = createAsyncThunk(
  "trade/delete",
  async(id,{rejectWithValue}) =>{
    try {
      const response = await axios.delete(`${executeTradesRoute}/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Trade Deletion failed");
    }
  }
)

export const updateTrade = createAsyncThunk(
  "trade/update",
  async(updateData,{rejectWithValue})=>{
    try {
      const response = await axios.post(`${executeTradesRoute}/update`,updateData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Trade Updation failed");
    }
  }
)

const tradeSlice = createSlice({
  name: "trade",
  initialState: { save: null, list:null,execute: null ,error: null ,delete:null ,note:null},
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveTrade.fulfilled, (state, action) => {
        state.save = action.payload;
        state.error = null;
      })
      .addCase(saveTrade.rejected, (state, action) => {
        state.save = null;
        state.error = action.payload;
      })
       .addCase(executeTrade.fulfilled, (state, action) => {
        state.execute = action.payload;
        state.error = null;
      })
      .addCase(executeTrade.rejected, (state, action) => {
        state.execute = null;
        state.error = action.payload;
      })
      .addCase(getAllTrades.fulfilled, (state, action) => {
        state.list = action.payload;
        state.error = null;
      })
      .addCase(getAllTrades.rejected, (state, action) => {
        state.list = null;
        state.error = action.payload;
      })
       .addCase(deleteTrade.fulfilled, (state, action) => {
        state.delete = action.payload;
        state.error = null;
      })
      .addCase(deleteTrade.rejected, (state, action) => {
        state.delete = null;
        state.error = action.payload;
      })
      .addCase(updateTrade.fulfilled, (state, action) => {
        state.note = action.payload;
        state.error = null;
      })
      .addCase(updateTrade.rejected, (state, action) => {
        state.note = null;
        state.error = action.payload;
      })
  },
});


export default tradeSlice.reducer;