import "./register.scss";
import { getMajor } from "../../service/helper.service";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { toast } from "react-toastify";
import { register } from "../../service/auth.service";
import axios from "axios";
import {
  Avatar,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
  OutlinedInput,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Chip,
} from "@material-ui/core";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Link } from "react-router-dom";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  "Du lịch",
  "Đọc sách",
  "Nghe nhạc",
  "Chơi thể thao",
  "Nấu ăn",
  "Học ngoại ngữ",
  "Xem phim",
  "Viết blog",
  "Chơi game",
  "Học hỏi mới",
  "Yoga",
  "Lập trình",
  "Thiền",
  "Nghệ thuật sáng tạo",
  "Chụp ảnh",
  "Gardening",
  "Thể dục buổi sáng",
  "Meditation",
  "Nấu ăn",
  "Ghi chép nhật ký",
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
export default function Register() {
  //useState
  const theme = useTheme();
  const [personName, setPersonName] = useState([]);
  const [major, setMajor] = useState([]);
  const [currentMajor, setCurrentMajor] = useState([]);
  const [classCount, setClassCount] = useState(1);
  const [classNumber, setClassNumber] = useState(1);
  const [province, setProvince] = useState([]);
  const [currentProvince, setCurrentProvince] = useState("");
  const [district, setDistrict] = useState([]);
  const [currentDistrict, setCurrentDistrict] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reInputPassword, setReInputPassword] = useState("");
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [phone, setPhone] = useState("");
  const [liveIn, setLiveIn] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [remember, setRemember] = useState(false);
  //useEffect
  useEffect(() => {
    const get = async () => {
      try {
        const res = await getMajor();
        setMajor(res.data);
        setCurrentMajor(res.data[1]);
        setClassCount(res.data[1].classCount[0].schoolYear);
        setClassNumber(res.data[1].classCount[0].count);
        let ptr = await axios.get("https://provinces.open-api.vn/api/");
        let ptr1 = await axios.get(
          `https://provinces.open-api.vn/api/p/${ptr.data[0].code}?depth=2`
        );
        setProvince(ptr.data);
        setCurrentProvince(ptr.data[0]);
        setDistrict(ptr1.data.districts);
        setCurrentDistrict(ptr1.data.districts[0].name);
      } catch (error) {
        console.log(error);
      }
    };
    get();
  }, []);
  const getDistrict = async (id) => {
    try {
      let ptr = await axios.get(
        `https://provinces.open-api.vn/api/p/${id}?depth=2`
      );
      setDistrict(ptr.data.districts);
    } catch (error) {
      console.log(error);
    }
  };
  //style
  const paperStyle = {
    padding: 20,
    height: "auto",
    width: 800,
  };
  //handle
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    //check max 5
    if (value.length > 5) {
      toast.error("Bạn chỉ được chọn tối đa 5 sở thích");
      return;
    }
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const validate = () => {
    //check empty
    console.log(remember);
    if(!remember){
      toast.error("Bạn chưa đồng ý với điều khoản sử dụng");
      return false;
    }
    if (!email) {
      toast.error("Email không được để trống");
      return false;
    }
    if (!password) {
      toast.error("Mật khẩu không được để trống");
      return false;
    }
    if (!reInputPassword) {
      toast.error("Nhập lại mật khẩu không được để trống");
      return false;
    }
    if (!name) {
      toast.error("Họ tên không được để trống");
      return false;
    }
    if (!studentId) {
      toast.error("Mã sinh viên không được để trống");
      return false;
    }
    const regexMail = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/;
    const regexPhone = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!regexMail.test(email)) {
      toast.error("Email không hợp lệ");
      return false;
    }
    if (phone && !regexPhone.test(phone)) {
      toast.error("Số điện thoại không hợp lệ");
      return false;
    }
    if (password !== reInputPassword) {
      toast.error("Mật khẩu không khớp");
      return false;
    }
    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 kí tự");
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const data = {
      email: email,
      password: password,
      studentId: studentId,
      majorID: currentMajor.id,
      class: currentMajor.acronym + " " + classNumber,
      comeFrom: currentProvince.name + ", " + currentDistrict,
      liveIn: liveIn,
      gender: gender,
      Birthday: birthday,
      schoolYear: classCount,
      interest: personName,
      name: name,
    };
    console.log(data);
    try {
      const res = await register(data);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
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
                <Grid xs={6} className="pr-4">
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
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Họ & Tên"
                        placeholder="Nhập tên"
                        fullWidth
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Quê quán"
                        placeholder="Nhập tên"
                        fullWidth
                        required
                        select
                        SelectProps={{
                          native: true,
                        }}
                        value={currentProvince.code || 2}
                        onChange={(e) => {
                          setCurrentProvince(
                            province.filter(
                              (i) => i.code === +e.target.value
                            )[0]
                          );
                          getDistrict(+e.target.value);
                        }}
                      >
                        {province.map((option) => (
                          <option key={option.code} value={option.code}>
                            {option.name}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Quận/Huyện"
                        placeholder="Nhập tên"
                        fullWidth
                        required
                        select
                        SelectProps={{
                          native: true,
                        }}
                        value={currentDistrict}
                        onChange={(e) => {
                          console.log(e.target.value);
                          console.log(currentProvince);
                          setCurrentDistrict(e.target.value);
                        }}
                      >
                        {district?.length > 0 &&
                          district.map((option) => {
                            return (
                              <option key={option.id} value={option.name}>
                                {option.name}
                              </option>
                            );
                          })}
                      </TextField>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Email"
                        placeholder="Nhập email"
                        fullWidth
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Mật khẩu"
                        placeholder="Nhập mật khẩu"
                        type="password"
                        fullWidth
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Nhập lại mật khẩu"
                        placeholder="Nhập lại mật khẩu"
                        type="password"
                        fullWidth
                        required
                        value={reInputPassword}
                        onChange={(e) => setReInputPassword(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={<Checkbox name="checkedB" color="primary" value={remember}/>}
                        label="Tôi đồng ý với điều khoản sử dụng"
                        fullWidth
                        onChange={(e) => setRemember(e.target.value)}
                      />
                      <Typography fullWidth>
                        Bạn đã có tài khoản?{" "}
                        <Link to="/login" className="text-blue-600">
                          Đăng nhập
                        </Link>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                {/*right*/}
                <Grid sm={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Số điện thoại"
                        placeholder="Nhập số điện thoại"
                        fullWidth
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Địa chỉ"
                        placeholder="Nhập địa chỉ"
                        fullWidth
                        required
                        value={liveIn}
                        onChange={(e) => setLiveIn(e.target.value)}
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
                        value={currentMajor?.id || 0}
                        onChange={(e) => {
                          setCurrentMajor(major[e.target.value - 1]);
                          setClassNumber(1);
                          setClassCount(
                            major[e.target.value].classCount[0].schoolYear
                          );
                        }}
                      >
                        {major.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid xs={12} sm={6} className="mt-2 px-2">
                      <TextField
                        label="Niên khóa"
                        placeholder="Nhập lớp"
                        fullWidth
                        required
                        select
                        SelectProps={{
                          native: true,
                        }}
                        onChange={(e) => {
                          setClassCount(e.target.value);
                          setClassNumber(1);
                        }}
                        value={classCount}
                      >
                        {currentMajor?.classCount?.map((option, key) => {
                          return (
                            <option key={key} value={option.schoolYear}>
                              {option.schoolYear}
                            </option>
                          );
                        })}
                      </TextField>
                    </Grid>
                    <Grid xs={12} sm={6} className="mt-2 pr-2">
                      <TextField
                        label="Lớp"
                        placeholder="Nhập lớp"
                        fullWidth
                        required
                        select
                        SelectProps={{
                          native: true,
                        }}
                        value={classNumber}
                        onChange={(e) => {
                          setClassNumber(e.target.value);
                        }}
                      >
                        {currentMajor?.classCount?.map((option) => {
                          if (option.schoolYear !== +classCount) return null;

                          const optionsArray = Array.from(
                            { length: option.count },
                            (_, index) => index + 1
                          );

                          return optionsArray.map((i) => (
                            <option key={i} value={i}>
                              {i}
                            </option>
                          ));
                        })}
                      </TextField>
                    </Grid>
                    {/*birthday*/}
                    <Grid item xs={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Ngày sinh"
                          value={birthday}
                          onChange={(newValue) => {
                            setBirthday(newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              style={{ paddingTop: "2px" }}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                    {/*gender*/}
                    <Grid item xs={6}>
                      <TextField
                        label="Giới tính"
                        placeholder="Nhập tên"
                        fullWidth
                        required
                        select
                        SelectProps={{
                          native: true,
                        }}
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        defaultValue="Nam"
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </TextField>
                    </Grid>
                    {/*interest*/}
                    <Grid item xs={12} fullWidth>
                      <FormControl sx={{ m: 1, width: 300 }} fullWidth>
                        <InputLabel
                          id="demo-multiple-chip-label"
                          className="px-2"
                        >
                          Sở thích
                        </InputLabel>
                        <Select
                          labelId="demo-multiple-chip-label"
                          id="demo-multiple-chip"
                          multiple
                          value={personName}
                          onChange={handleChange}
                          input={
                            <OutlinedInput
                              id="select-multiple-chip"
                              label="Chip"
                            />
                          }
                          renderValue={(selected) => (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {selected.map((value) => (
                                <Chip key={value} label={value} />
                              ))}
                            </Box>
                          )}
                          MenuProps={MenuProps}
                        >
                          {names.map((name) => (
                            <MenuItem
                              key={name}
                              value={name}
                              style={getStyles(name, personName, theme)}
                            >
                              {name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid align="center" className="mt-4">
                {" "}
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  onClick={handleSubmit}
                >
                  Đăng ký
                </Button>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </section>
    </>
  );
}
