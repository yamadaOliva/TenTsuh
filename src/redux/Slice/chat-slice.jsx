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
  isPostOpen: false,
  postId: null,
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
    openPost: (state, action) => {
      state.isPostOpen = true;
      state.postId = action.payload;
    },
    closePost: (state) => {
      state.isPostOpen = false;
      state.postId = null;
    },
  },
});
export const { openChat, closeChat, openPost, closePost } =
  chatSlice.actions;
export const selectIsChatOpen = (state) => state.chat.isChatOpen;
