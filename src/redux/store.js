import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./slice/login";
import enumReducer from "./slice/enums";
import userReducer from "./slice/user";
import tradeReducer from "./slice/trade";
const store = configureStore({
  reducer: {
    login: loginReducer,
    enum: enumReducer,
    user: userReducer,
    trade : tradeReducer
  },
});

export default store;