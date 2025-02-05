import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import categoryReducer from "./slices/categorySlice";
import modelReducer from "./slices/modelSlice";
import productReducer from "./slices/productSlice";
import vendorReducer from "./slices/vendorSlice";
import purchaseReducer from "./slices/purchaseSlice";
import locationReducer from "./slices/locationSlice";
import coaReducer from "./slices/coaSlice";
import voucherReducer from "./slices/voucherSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    category: categoryReducer,
    model: modelReducer,
    product: productReducer,
    vendor: vendorReducer,
    purchase: purchaseReducer,
    location: locationReducer,
    coa: coaReducer,
    voucher: voucherReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
