import Upload from "../../component/Upload/UploadImage";
import { getProfile } from "../../service/user.service";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { getMajor } from "../../service/helper.service";
import { address, date } from "../../utils";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useTheme } from "@mui/material";
import { toast } from "react-toastify";
import { updateProfile } from "../../service/user.service";
import "./profile.scss";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  OutlinedInput,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Chip,
} from "@mui/material";
export default function Profile() {
  const user = useSelector((state) => state.user);
  const [major, setMajor] = useState([]);
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [majorCurrent, setMajorCurrent] = useState({});
  const [schoolYear, setSchoolYear] = useState();
  const [classNumber, setClassNumber] = useState();
  const [phone, setPhone] = useState("");
  const [liveIn, setLiveIn] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [interest, setInterest] = useState([]);
  const [isSomethingChange, setIsSomethingChange] = useState(false);
  const [rawBirthday, setRawBirthday] = useState("");
  const theme = useTheme();
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
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    //check max 5
    if (value.length > 5) {
      toast.error("Bạn chỉ được chọn tối đa 5 sở thích");
      return;
    }
    setInterest(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    setIsSomethingChange(true);
  };

  const handleUpdate = async () => {
    const data = {
      name,
      studentId,
      majorId: majorCurrent.id,
      schoolYear,
      class: `${majorCurrent.acronym} ${classNumber}`,
      phone,
      liveIn,
      city,
      district,
      birthday,
      interest,
      gender,
      birthday: birthday ? birthday : rawBirthday,
      avatarUrl: image,
    };
    console.log(data, "data");
    const res = await updateProfile(user.accessToken, data);
    if (res.status === 200) {
      toast.success("Cập nhật thông tin thành công");
      setIsSomethingChange(false);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const res = await getProfile(user.accessToken);
      const resMajor = await getMajor();
      const majorName = res.data.class.split(" ")[0];
      const currentMajor = resMajor.data.find(
        (item) => item.acronym === majorName
      );
      console.log(res.data, "res.data");
      if (res.data.class) {
        setMajorCurrent(currentMajor);
        setClassNumber(classNumber);
      } else {
        setMajorCurrent(resMajor.data[0]);
        setClassNumber(1);
      }
      setMajor(resMajor.data);
      setImage(res.data.avatarUrl);
      setName(res.data.name);
      setStudentId(res.data.studentId);
      setPhone(res.data.phone);

      if (res.data.schoolYear) {
        setSchoolYear(res.data.schoolYear);
      } else {
        //4 first of studentId
        setSchoolYear(res.data.studentId.slice(0, 4));
      }

      if (res.data.class) {
        setClassNumber(res.data.class.split(" ")[1]);
      } else {
        setClassNumber(1);
      }

      setLiveIn(res.data.liveIn);
      if (res.data.city) {
        setCity(res.data.city);
        setDistrict(res.data.district);
      } else {
        setCity(address.getCities()[0]);
        setDistrict(address.getDistricts(address.getCities()[0])[0]);
      }

      console.log(res.data.Birthday, "res.data.birthday");

      if (res.data.Birthday) {
        setRawBirthday(res.data.Birthday);
      }

      if (res.data.gender) {
        setGender(res.data.gender);
      } else {
        setGender("Nam");
      }

      if (res.data.interest) {
        setInterest(res.data.interest);
      }
    };
    getData();
  }, []);
  return (
    <section className="profile">
      <Grid container justifyContent="center" alignItems="center" height="100%">
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            margin: "20px auto",
            width: "50%",
            height: "auto",
          }}
        >
          <Box textAlign="center">
            {" "}
            {/* Đảm bảo component Upload nằm ở giữa */}
            <Upload
              backgroundImage={image}
              setAvatarUrl={setImage}
              setSomethingChange={setIsSomethingChange}
            />
          </Box>
          <Grid align="center">
            <Typography
              variant="caption"
              gutterBottom
              style={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              Thay đổi thông tin
            </Typography>
            {/* 2 column */}
            <form className="form mt-5">
              <Grid container spacing={2}>
                <Grid item xs={6} className="pr-4">
                  <TextField
                    label="Họ và tên"
                    variant="outlined"
                    value={name}
                    fullWidth
                    onChange={(e) => {
                      setName(e.target.value);
                      setIsSomethingChange(true);
                    }}
                  />

                  <TextField
                    label="Mã số sinh viên"
                    variant="outlined"
                    value={studentId}
                    fullWidth
                    onChange={(e) => {
                      setStudentId(e.target.value);
                      setIsSomethingChange(true);
                    }}
                    style={{ marginTop: "20px" }}
                    disabled
                  />

                  <TextField
                    label={`Chuyên ngành ${majorCurrent?.acronym}`}
                    variant="outlined"
                    placeholder="Chọn chuyên ngành"
                    fullWidth
                    required
                    select
                    SelectProps={{
                      native: true,
                    }}
                    value={majorCurrent?.id || 0}
                    onChange={(e) => {
                      setMajorCurrent(major[e.target.value - 1]);
                      setIsSomethingChange(true);
                    }}
                    style={{ marginTop: "20px" }}
                  >
                    {major.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </TextField>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      {/* textfield select type*/}
                      <TextField
                        label="Niên khóa"
                        placeholder="Nhập lớp"
                        fullWidth
                        required
                        select
                        disabled
                        SelectProps={{
                          native: true,
                        }}
                        onChange={(e) => {
                          setSchoolYear(e.target.value);
                          setIsSomethingChange(true);
                        }}
                        value={schoolYear || 2019}
                        style={{ marginTop: "20px" }}
                      >
                        {majorCurrent?.classCount?.map((option, key) => {
                          return (
                            <option
                              key={key}
                              value={parseInt(option.schoolYear)}
                            >
                              {option.schoolYear}
                            </option>
                          );
                        })}
                      </TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Lớp"
                        placeholder="Nhập lớp"
                        fullWidth
                        required
                        select
                        SelectProps={{
                          native: true,
                        }}
                        onChange={(e) => {
                          setClassNumber(e.target.value);
                          setIsSomethingChange(true);
                        }}
                        value={classNumber || 1}
                        style={{ marginTop: "20px" }}
                      >
                        {majorCurrent?.classCount?.map((option, key) => {
                          if (option.schoolYear == schoolYear) {
                            const optionArr = Array.from(
                              { length: option.count },
                              (_, i) => i + 1
                            );
                            return optionArr.map((item, key) => {
                              return (
                                <option key={key} value={item}>
                                  {item}
                                </option>
                              );
                            });
                          }
                        })}
                      </TextField>
                    </Grid>
                  </Grid>

                  <TextField
                    label="Số điện thoại"
                    variant="outlined"
                    value={phone}
                    fullWidth
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setIsSomethingChange(true);
                    }}
                    style={{ marginTop: "20px" }}
                    SelectProps={{
                      native: true,
                    }}
                  />
                </Grid>
                {/* right */}
                <Grid item xs={6} className="pr-4">
                  <TextField
                    label="Nơi ở hiện tại"
                    variant="outlined"
                    value={liveIn}
                    fullWidth
                    onChange={(e) => {
                      setLiveIn(e.target.value);
                      setIsSomethingChange(true);
                    }}
                  />
                  <Grid container spacing={2}>
                    <Grid
                      item
                      style={{
                        marginTop: "20px",
                      }}
                      xs={6}
                    >
                      <TextField
                        label="Tỉnh/Thành phố"
                        variant="outlined"
                        value={city}
                        fullWidth
                        onChange={(e) => {
                          setCity(e.target.value);
                          setDistrict(address.getDistricts(e.target.value)[0]);
                          setIsSomethingChange(true);
                        }}
                        select
                        SelectProps={{
                          native: true,
                        }}
                      >
                        {address.getCities().map((item, key) => {
                          return (
                            <option key={key} value={item}>
                              {item}
                            </option>
                          );
                        })}
                      </TextField>
                    </Grid>

                    <Grid
                      item
                      style={{
                        marginTop: "20px",
                      }}
                      xs={6}
                    >
                      <TextField
                        label="Quận/Huyện"
                        variant="outlined"
                        value={district}
                        fullWidth
                        onChange={(e) => {
                          setDistrict(e.target.value);
                          setIsSomethingChange(true);
                        }}
                        select
                        SelectProps={{
                          native: true,
                        }}
                      >
                        {city &&
                          address.getDistricts(city).map((item, key) => {
                            return (
                              <option key={key} value={item}>
                                {item}
                              </option>
                            );
                          })}
                      </TextField>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid
                      item
                      xs={6}
                      style={{
                        marginTop: "20px",
                      }}
                    >
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label={`Ngày sinh: ${
                            !birthday
                              ? date.convertDateToString(rawBirthday)
                              : ""
                          }`}
                          value={birthday}
                          onChange={(newValue) => {
                            setBirthday(newValue);
                            setIsSomethingChange(true);
                          }}
                          renderInput={(params) => {
                            console.log(params, "params");
                            <TextField {...params} fullWidth />;
                          }}
                          view="[day, month, year]"
                        />
                      </LocalizationProvider>
                    </Grid>
                    {/*gender*/}
                    <Grid
                      item
                      xs={6}
                      style={{
                        marginTop: "20px",
                      }}
                    >
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
                        onChange={(e) => {
                          setGender(e.target.value);
                          setIsSomethingChange(true);
                        }}
                        defaultValue="Nam"
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </TextField>
                    </Grid>
                  </Grid>

                  <FormControl sx={{ marginTop: "20px" }} fullWidth>
                    <InputLabel id="demo-multiple-chip-label">
                      Sở thích
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-chip-label"
                      id="demo-multiple-chip"
                      multiple
                      value={interest}
                      onChange={handleChange}
                      input={
                        <OutlinedInput id="select-multiple-chip" label="Chip" />
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
                          style={getStyles(name, interest, theme)}
                        >
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {/*  */}
              </Grid>
            </form>
          </Grid>
          {isSomethingChange && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdate}
              style={{
                marginTop: "20px",
                justifyContent: "center",
                display: "flex",
              }}
            >
              Cập nhật
            </Button>
          )}
        </Paper>
      </Grid>
    </section>
  );
}
