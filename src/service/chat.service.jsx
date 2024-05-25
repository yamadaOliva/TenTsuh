import axios from "../setup/axios";

const getFriendChatList = (accessToken, limit, page) => {
  console.log(accessToken, limit, page);
  return axios.get(`/chat/list/friend/${page}/${limit}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
export { getFriendChatList };
