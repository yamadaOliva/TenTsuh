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

const searchFriendRequest = (accessToken, keyword, type) => {
  return axios.get(`/friend/search/${type}/${keyword}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const filterFriendRequest = (accessToken, page, perpage, type) => {
  return axios.get(`/friend/filter/${type}/${page}/${perpage}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export {
  getFriendsRequest,
  getCountryman,
  searchFriendRequest,
  filterFriendRequest,
};
