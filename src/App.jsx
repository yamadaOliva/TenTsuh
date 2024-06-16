import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./App.scss";
import Header from "./component/Header/Header";
import { Outlet } from "react-router-dom";
import { refreshToken } from "./service/auth.service";
import { getMe } from "./service/user.service";
import MiniChat from "./component/BoxChat/BoxChat";
import PostModal from "./component/Feed/PostModal";
import { socket } from "./socket";
import {
  setAccessToken,
  setRefreshToken,
  setInfo,
} from "./redux/Slice/user-slice";
import { openChat } from "./redux/Slice/chat-slice";
function App() {
  const [data, setData] = useState({});
  const accessToken = useSelector((state) => state.user.accessToken);
  const chat = useSelector((state) => state.chat);
  const refresh_token = useSelector((state) => state.user.refreshToken);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const setToken = (accessToken, refreshToken) => {
    dispatch(setAccessToken(accessToken));
    dispatch(setRefreshToken(refreshToken));
  };
  useEffect(() => {
    const fetchMe = async () => {
      const res = await getMe(accessToken);
      if (res?.EC === 200) {
        setData(res.data);
        dispatch(setInfo(res.data));
      } else {
        const res = await refreshToken(refresh_token);
        if (res?.EC === 200) {
          setToken(res.data.access_token, res.data.refresh_token);
          navigate("/home");
        } else {
          setToken("", "");
          navigate("/login");
          localStorage.setItem("Logout", true);
          toast.error("Phiên đăng nhập hết hạn");
        }
      }
    };
    if (accessToken) {
      fetchMe();
      if (window.location.pathname === "/") {
        navigate("/home");
      }
    } else {
      navigate("/login");
    }
  }, []);
  return (
    <>
      {" "}
     
      <section className="body__container">
        <Outlet />
        {chat.isChatOpen && <MiniChat friend={chat.friend} />}
        {chat.isPostOpen && <PostModal id={chat.postId} />}
      </section>
    </>
  );
}

export default App;
