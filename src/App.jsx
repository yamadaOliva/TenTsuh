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
import {
  setAccessToken,
  setRefreshToken,
  setInfo,
} from "./redux/Slice/user-slice";

function App() {
  const [data, setData] = useState({});
  const accessToken = useSelector((state) => state.user.accessToken);
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
        console.log(res.data);
        setData(res.data);
        dispatch(setInfo(res.data));
      } else {
        const res = await refreshToken(refresh_token);
        if (res?.EC === 200) {
          setToken(res.data.access_token, res.data.refresh_token);

          //if in route / go to /home
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
      {data && data.id && <Header data={data} />}
      <section className="body__container">
        <Outlet />
      </section>
    </>
  );
}

export default App;
