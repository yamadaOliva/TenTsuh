import axios from "../setup/axios";

const getFriendChatList = (accessToken, limit, page) => {
  console.log(accessToken, limit, page);
  return axios.get(`/chat/list/friend/${page}/${limit}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const getChatList = (accessToken, targetId, limit, page, seen) => {
  return axios.get(
    `/chat/list/${targetId}/${page}/${limit}/${seen}
  `,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

const sendChat = (accessToken, data) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  return axios.post("/chat/send", data);
};

const getUnseenChat = (accessToken) => {
  return axios.get("/chat/unseen", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
export { getFriendChatList, getChatList, sendChat, getUnseenChat };
