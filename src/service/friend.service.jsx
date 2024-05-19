import axios from "../setup/axios";

const getFriendsRequest = (accessToken, page, perpage) => {
  return axios.get(`/friend/list/request/${page}/${perpage}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const getCountryman = (accessToken, page, perpage) => {
  return axios.get(`/friend/list/countryman/${page}/${perpage}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export { getFriendsRequest, getCountryman };
