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
  },
});
export const { setAccessToken, setRefreshToken } = userSlice.actions;
export const selectAccessToken = (state) => state.user.accessToken;
