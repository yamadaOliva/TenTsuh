import {
  Avatar,
  Button,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { login } from "../../service/auth.service";
import Checkbox from "@mui/material/Checkbox";
import "./login.scss";
import { Link } from "react-router-dom";
import { useState } from "react";
import { setRefreshToken, setAccessToken } from "../../redux/Slice/user-slice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const setToken = (accessToken, refreshToken) => {
    dispatch(setAccessToken(accessToken));
    dispatch(setRefreshToken(refreshToken));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);

    console.log(res);
    if (+res?.EC === 200) {
      setToken(res.data.access_token, res.data.refresh_token);
      toast.success("Đăng nhập thành công");
      
    } else {
      toast.error("Đăng nhập thất bại");
      setPassword("");
      setEmail("");
    }
  };
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
              style={textfieldStyle}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Mật khẩu"
              placeholder="Vui lòng nhập password"
              type="password"
              fullWidth
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <Grid align="left">
              <FormControlLabel
                control={<Checkbox name="checkedB" color="primary" />}
                label="Ghi nhớ tôi"
                style={formStyle}
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
