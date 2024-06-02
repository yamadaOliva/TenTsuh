import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { userSlice } from "./Slice/user-slice";
import { chatSlice } from "./Slice/chat-slice";
import thunk from "redux-thunk";
const persistConfig = {
  key: "root",
  storage,
};
const user = persistReducer(persistConfig, userSlice.reducer);
const chat = persistReducer(persistConfig, chatSlice.reducer);
export const store = configureStore({
  reducer: {
    user,
    chat,
  },
  middleware: [thunk],
});
export const persistor = persistStore(store);
