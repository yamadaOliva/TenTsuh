import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  accessToken: null,
  refreshToken: null,
  name: null,
  avatarUrl: null,
  id: null,
  role: null,
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
    setInfo: (state, action) => {
      state.name = action.payload.name;
      state.avatarUrl = action.payload.avatarUrl;
      state.id = action.payload.id;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.name = null;
      state.avatarUrl = null;
      state.id = null;
      state.role = null;
    },
  },
});
export const { setAccessToken, setRefreshToken, logout, setInfo } =
  userSlice.actions;
export const selectAccessToken = (state) => state.user.accessToken;
