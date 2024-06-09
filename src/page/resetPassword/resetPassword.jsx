import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import "./resetPassword.scss";
import Error from "../../component/404/404";
import {
  verifyForgotPassword,
  resetPassword,
} from "../../service/auth.service";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVerify, setIsVerify] = useState(false);
  const { token } = useParams();
  console.log("token", token);
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Mật khẩu không khớp");
      return;
    }
    const res = await resetPassword(token, password);
    if (res?.EC === 200) {
      toast.success("Đổi mật khẩu thành công");
      navigate("/login");
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      const res = await verifyForgotPassword(token);
      if (res?.EC === 200) {
        setIsVerify(true);
      }
    };
    if (token) verifyToken();
  }, []);
  const paperStyle = {
    padding: 20,
    height: "auto",
    width: 400,
    margin: "20px auto",
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
      {isVerify ? (
        <section
          className="auth"
          style={{
            backgroundImage: `url("/bg.jpeg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            height: "100vh",
          }}
        >
          <Grid>
            <Paper elevation={6} style={paperStyle}>
              <Grid align="center">
                <Avatar src="/iconHust.png"></Avatar>
                <h2 className="mt-4">Lấy lại mật khẩu</h2>

                <TextField
                  label="Mật khẩu mới"
                  placeholder="Vui lòng nhập mật khẩu"
                  fullWidth
                  required
                  value={password}
                  style={textfieldStyle}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                />

                <TextField
                  label="Nhập lại mật khẩu"
                  placeholder="Vui lòng nhập mật khẩu"
                  fullWidth
                  required
                  value={confirmPassword}
                  style={textfieldStyle}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                />
                <Grid align="left"></Grid>
              </Grid>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                style={btnStyle}
                fullWidth
                onClick={handleChangePassword}
              >
                Gửi yêu cầu
              </Button>
              <Grid align="left">
                <Typography fullWidth style={typoStyle}>
                  <Link to="/login" className="text-blue-600">
                    Quay lại trang chủ
                  </Link>
                </Typography>
              </Grid>
            </Paper>
          </Grid>
        </section>
      ) : (
        <Error />
      )}
    </>
  );
}
