import "./register.scss";
import { getMajor } from "../../service/helper.service";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { toast } from "react-toastify";
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
  const [currentProvince, setCurrentProvince] = useState({});
  const [district, setDistrict] = useState([]);
  const [currentDistrict, setCurrentDistrict] = useState("");
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
        console.log(ptr1.data.districts);
        setProvince(ptr.data);
        setCurrentProvince(ptr.data[0]);
        setDistrict(ptr1.data.districts);
        console.log(ptr1.data.districts[0]);
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
      console.log(ptr.data.districts);
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
                        value={currentProvince.code || 0}
                        onChange={(e) => {
                          setCurrentProvince(province[e.target.value]);
                          getDistrict(+e.target.value);
                        }}
                      >
                        {province.map((option) => (
                          <option key={option.id} value={option.code}>
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
                <Grid sm={6}>
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
                        value={currentMajor?.id - 1 || 0}
                        onChange={(e) => {
                          setCurrentMajor(major[e.target.value]);
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
                    {/*interest*/}
                    <Grid item xs={12} fullWidth>
                      <FormControl sx={{ m: 1, width: 300 }} fullWidth>
                        <InputLabel id="demo-multiple-chip-label">
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
                <Button type="submit" color="primary" variant="contained">
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
