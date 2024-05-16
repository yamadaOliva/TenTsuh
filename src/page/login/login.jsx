import {
  Avatar,
  Button,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { login, login365 } from "../../service/auth.service";
import Checkbox from "@mui/material/Checkbox";
import "./login.scss";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { setRefreshToken, setAccessToken } from "../../redux/Slice/user-slice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
//Azure
import {
  UnauthenticatedTemplate,
  useMsal,
  MsalProvider,
} from "@azure/msal-react";
import { loginRequest } from "../../setup/auth-config";

const WrappedView = () => {
  const dispatch = useDispatch();
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();

  const navigate = useNavigate();
  function setToken(accessToken, refreshToken) {
    dispatch(setAccessToken(accessToken));
    dispatch(setRefreshToken(refreshToken));
  }

  useEffect(() => {
    const loginOffice = async (data) => {
      const res = await login365(data);
      console.log(res.data);
      if (+res?.EC !== 200) {
        toast.error("Đăng nhập thất bại");
        return;
      }
      setToken(res.data.access_token, res.data.refresh_token);
      localStorage.setItem("IsLogin", true);
      navigate("/home");
      toast.success("Đăng nhập thành công");
    };

    const Logout = localStorage.getItem("Logout");
    if (Logout) {
      localStorage.removeItem("IsLogin");
      localStorage.removeItem("Logout");
      instance.logout();
      return;
    }

    const IsLogin = localStorage.getItem("IsLogin");
    if (activeAccount && !IsLogin ) {
      console.log(activeAccount);
      const data = {
        email: activeAccount.username,
        name: activeAccount.name,
      };
    
      loginOffice(data);

    } 
   
  }, [activeAccount]);

  

  const handleLogin = () => {
    instance
      .loginRedirect({
        ...loginRequest,
        prompt: "create",
      })
      .catch((e) => {
        console.error(e);
      });
  };
  return (
    <div>
      <UnauthenticatedTemplate>
        <Button
          color="default"
          size="large"
          variant="outlined"
          onClick={handleLogin}
        >
          đăng nhập với 365 office
        </Button>
      </UnauthenticatedTemplate>
    </div>
  );
};

// eslint-disable-next-line react/prop-types
export default function Login({ instance }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const accessToken = useSelector((state) => state.user.accessToken);
  const dispatch = useDispatch();

  function setToken(accessToken, refreshToken) {
    dispatch(setAccessToken(accessToken));
    dispatch(setRefreshToken(refreshToken));
  }
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (remember) {
      localStorage.setItem("remember", true);
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
    } else {
      localStorage.setItem("remember", false);
      localStorage.setItem("email", "");
      localStorage.setItem("password", "");
    }
    const res = await login(email, password);

    console.log(res);
    if (+res?.EC === 200) {
      setToken(res.data.access_token, res.data.refresh_token);
      setPassword("");
      setEmail("");
      navigate("/home");
      toast.success("Đăng nhập thành công");
    } else {
      toast.error("Đăng nhập thất bại");
      setPassword("");
      setEmail("");
    }
  };
  //useEffect
  useEffect(() => {
    if (accessToken) {
      navigate("/home");
      return;
    }
    const remember = localStorage.getItem("remember") === "true";
    if (remember) {
      const storedEmail = localStorage.getItem("email") || "";
      const storedPassword = localStorage.getItem("password") || "";
      setRemember(true);
      setEmail(storedEmail);
      setPassword(storedPassword);
    }
  }, []);

  //////////////////////////////////
  const paperStyle = {
    padding: 20,
    height: "55vh",
    width: 400,
  };
  const textfieldStyle = {
    margin: "20px auto",
  };
  const btnStyle = {
    margin: "8px 0",
  };
  const formStyle = {
    margin: "15px 0 8px -4px",
  };
  const typoStyle = {
    margin: "5px 0 ",
  };
  return (
    <>
      <section className="auth">
        <Grid>
          <Paper elevation={10} style={paperStyle}>
            <Grid align="center">
              <Avatar src="iconHust.png"></Avatar>
              <h2 className="mt-4">Chào mừng đến với TenTsuh</h2>
            </Grid>
            <TextField
              label="Tài khoản đăng nhập"
              placeholder="Vui lòng nhập email"
              type="email"
              fullWidth
              required
              value={email}
              style={textfieldStyle}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Mật khẩu"
              placeholder="Vui lòng nhập password"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Grid align="left">
              <FormControlLabel
                control={
                  <Checkbox
                    name="checkedB"
                    color="primary"
                    checked={remember}
                  />
                }
                label="Ghi nhớ tôi"
                style={formStyle}
                onChange={(e) => setRemember(e.target.checked)}
              />
            </Grid>

            <Button
              type="submit"
              color="primary"
              variant="contained"
              style={btnStyle}
              fullWidth
              onClick={handleSubmit}
            >
              Đăng nhập
            </Button>

            {/* Azure */}
            <MsalProvider instance={instance}>
              <WrappedView />
            </MsalProvider>

            <Grid align="left">
              <Typography fullWidth style={typoStyle}>
                <Link to="/forgot-password" className="text-blue-600">
                  Quên mật khẩu?
                </Link>
              </Typography>
              <Typography fullWidth style={typoStyle}>
                Bạn chưa có tài khoản?{" "}
                <Link to="/register" className="text-blue-600">
                  Đăng ký
                </Link>
              </Typography>
            </Grid>
          </Paper>
        </Grid>
      </section>
    </>
  );
}
