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
import Checkbox from "@mui/material/Checkbox";
import { Link, useNavigate } from "react-router-dom";
import { changePassword } from "../../service/auth.service";
import "./changePassword.scss";
import Header from "../../component/Header/Header";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
export default function ChangePassword() {
  const navigate = useNavigate();
  const me = useSelector((state) => state.user);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("Mật khẩu mới không khớp");
      return;
    }
    const data = {
        oldPassword: currentPassword,
        newPassword: newPassword,
    };
    console.log(data);
    const res = await changePassword(me.accessToken, data);

    if (res?.EC === 200) {
      toast.success("Đổi mật khẩu thành công");
      navigate("/home");
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
      <Header />
      <section
        className="auth"
        style={{
          backgroundImage: `url("/bg1.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "93.2vh",
        }}
      >
        <Grid>
          <Paper elevation={6} style={paperStyle}>
            <Grid align="center">
              <Avatar src="/iconHust.png"></Avatar>
              <h2 className="mt-4">Đổi mật khẩu</h2>
            </Grid>
            <TextField
              label="Mật khẩu hiện tại"
              placeholder="Vui lòng nhập mật khẩu hiện tại"
              type="password"
              fullWidth
              required
              value={currentPassword}
              style={textfieldStyle}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <TextField
              label="Mật khẩu mới"
              placeholder="Vui lòng nhập mật khẩu mới"
              type="password"
              fullWidth
              required
              value={newPassword}
              style={textfieldStyle}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              label="Xác nhận mật khẩu mới"
              placeholder="Vui lòng nhập lại mật khẩu mới"
              type="password"
              fullWidth
              required
              value={confirmNewPassword}
              style={textfieldStyle}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
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
              Đổi mật khẩu
            </Button>
            <Grid align="left">
              <Typography fullWidth style={typoStyle}>
                <Link to="/home" className="text-blue-600">
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
