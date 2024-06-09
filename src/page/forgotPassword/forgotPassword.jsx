import React, { useState } from "react";
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
import "./forgotPassword.scss";
import { forgotPassword } from "../../service/auth.service";
import { toast } from "react-toastify";
export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Vui lòng nhập email");
      return;
    }

    const res = await forgotPassword(email);
    if (res?.EC === 200) {
      toast.success("Vui lòng kiểm tra email của bạn");
      setEmail("");

    } else {
      toast.error(res?.message);
    }
  };

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
              <h2 className="mt-4">Quên mật khẩu</h2>
            </Grid>
            <TextField
              label="Email"
              placeholder="Vui lòng nhập email"
              fullWidth
              required
              type="email"
              value={email}
              style={textfieldStyle}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Grid align="left"></Grid>
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
    </>
  );
}
