import "./register.scss";
import { getMajor } from "../../service/helper.service";
import { useEffect, useState } from "react";
import {
  Avatar,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
export default function Register() {
  //useState
  const [major, setMajor] = useState([]);
  const [currentMajor, setCurrentMajor] = useState([]); // [1,2,3
  //useEffect
  useEffect(() => {
    const get = async () => {
      const res = await getMajor();
      setMajor(res.data);
      setCurrentMajor(res.data[0]);
      console.log(res);
    };
    get();
  }, []);
  //style
  const paperStyle = {
    padding: 20,
    height: "auto",
    width: 800,
  };
  return (
    <>
      <section className="auth">
        <Grid>
          <Paper style={paperStyle} elevation={20}>
            <Grid align="center">
              <Avatar src="iconHust.png"></Avatar>
              <h2 className="mt-4">đăng ký thành viên</h2>
              <Typography variant="caption" gutterBottom>
                đăng ký bằng mail Hust để kết nối yêu thương
              </Typography>
            </Grid>
            <form>
              <Grid container spacing={2}>
                <Grid xs={12} sm={6} className="pr-4">
                  <Grid container spacing={2}>
                    {/* <Grid item xs={12} sm={6}>
                    <TextField
                      label="Tên hiển thị"
                      placeholder="Nhập họ"
                      fullWidth
                      required
                    />
                  </Grid> */}
                  <Grid item xs={12}>
                      <TextField
                        label="Mã sinh viên"
                        placeholder="Nhập mã sinh viên"
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Họ & Tên"
                        placeholder="Nhập tên"
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Email"
                        placeholder="Nhập email"
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Mật khẩu"
                        placeholder="Nhập mật khẩu"
                        type="password"
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Nhập lại mật khẩu"
                        placeholder="Nhập lại mật khẩu"
                        type="password"
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={<Checkbox name="checkedB" color="primary" />}
                        label="Tôi đồng ý với điều khoản sử dụng"
                      />
                    </Grid>
                  </Grid>
                </Grid>
                {/*right*/}
                <Grid xs={12} sm={6}>
                  <Grid container spacing={2}>
                    
                    <Grid item xs={12}>
                      <TextField
                        label="Số điện thoại"
                        placeholder="Nhập số điện thoại"
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Ngày sinh"
                        placeholder="Nhập ngày sinh"
                        fullWidth
                        requiredS
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Địa chỉ"
                        placeholder="Nhập địa chỉ"
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label={`Chuyên ngành` + ` (${currentMajor?.acronym})`}
                        placeholder="Chọn chuyên ngành"
                        fullWidth
                        required
                        select
                        SelectProps={{
                          native: true,
                        }}
                        value={currentMajor?.id||0}
                        onChange={(e) =>{
                          setCurrentMajor(major[e.target.value])
                        }}
                      >
                        {major.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid align="center" className="mt-4">
                  {" "}
                  <Button type="submit" color="primary" variant="contained">
                    Đăng ký
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </section>
    </>
  );
}
