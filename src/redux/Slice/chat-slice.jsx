import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isChatOpen: false,
  friend: {
    id: null,
    name: null,
    avatarUrl: null,
    class: null,
    studentId: null,
    online: false,
  },
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    openChat: (state, action) => {
      console.log(action.payload);
      state.isChatOpen = true;
      state.friend = action.payload;
    },
    closeChat: (state) => {
      state.isChatOpen = false;
      state.friend = {
        id: null,
        name: null,
        avatarUrl: null,
        class: null,
        studentId: null,
      };
    },
  },
});
export const { openChat, closeChat } = chatSlice.actions;
export const selectIsChatOpen = (state) => state.chat.isChatOpen;
