import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  accessToken: null,
  refreshToken: null,
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});
export const { setAccessToken, setRefreshToken , logout } = userSlice.actions;
export const selectAccessToken = (state) => state.user.accessToken;
