import {
  Avatar,
  Button,
  ButtonGroup,
  Fab,
  IconButton,
  Modal,
  Stack,
  styled,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { createPost } from "../../service/post.service";
import { toast } from "react-toastify";
import {
  Add as AddIcon,
  DateRange,
  EmojiEmotions,
  Image,
} from "@mui/icons-material";
import { Box } from "@mui/system";
import { getMe } from "../../service/user.service";
import { useSelector } from "react-redux";
const SytledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const UserBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "20px",
});

const Add = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const accessToken = useSelector((state) => state.user.accessToken);

  //function
  const validate = () => {
    if (!title || !content) {
      toast.error("Vui lòng nhập đủ thông tin");
      return false;
    }
    return true;
  }

  const handleCreatePost = async () => {
    if (!validate()) return;
    const data = {
      title: title,
      content: content,
      imageUrl: image,
    };
    const res = await createPost(data, accessToken);
    if (res?.EC === 200) {
      toast.success("Tạo bài viết thành công");
      setOpen(false);
    }
  }
  //useEffect
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current?.createUploadWidget(
      {
        cloudName: "subarasuy",
        uploadPreset: "o4umo4il",
        multiple: false,
        sources: ["local", "url", "camera"],
        maxFileSize: 5000000,
      },
      function (error, result) {
        if (!error && result && result.event === "success") {
          const fileExtension = result.info.format;
          if (fileExtension !== "png" && fileExtension !== "jpg") {
            toast.error("anh phải có định dạng jpg hoặc png");
            return;
          }
          console.log(result.info.secure_url);
          if (result.info?.secure_url?.startsWith("http")) {
            setImage(result.info.secure_url);
            if (props.setSomethingChange) {
              props.setSomethingChange(true);
            }
          }
        }
      }
    );
  }, []);

  useEffect(() => {
    console.log(cloudinaryRef.current);
    console.log(image);
  }, [image]);

  useEffect(() => {
    const fetchMe = async () => {
      const res = await getMe(accessToken);
      if (res?.EC === 200) {
        setUser(res.data);
      }
    };
    if (open) fetchMe();
  }, [open]);
  return (
    <>
      <Tooltip
        onClick={() => setOpen(true)}
        title="Delete"
        sx={{
          position: "fixed",
          bottom: 20,
          left: { xs: "calc(50% - 25px)", md: 30 },
        }}
      >
        <Fab color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </Tooltip>
      <SytledModal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          width={400}
          height="auto"
          bgcolor={"background.default"}
          color={"text.primary"}
          p={3}
          borderRadius={5}
        >
          <Typography variant="h6" color="gray" textAlign="center">
            Tạo bài đăng
          </Typography>
          <UserBox>
            <Avatar
              src={user?.avatarUrl}
              sx={{
                width: 30,
                height: 30,
                borderColor: "primary.main",
                borderWidth: 1,
              }}
            />
            <Typography fontWeight={500} variant="span">
              {user?.name}
            </Typography>
          </UserBox>
          {/* title */}
          <TextField
            sx={{ width: "100%" }}
            id="standard-multiline-static"
            multiline
            rows={1}
            placeholder="Bạn đang cảm thấy thế nào"
            variant="standard"
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            sx={{ width: "100%" }}
            id="standard-multiline-static"
            multiline
            placeholder="Nội dung"
            variant="standard"
            rows={4}
            maxRows={10}
            onChange={(e) => setContent(e.target.value)}
          />
          {image && (
            <Box
            sx={{
              height: "200px",
              borderRadius: 5,
              overflow: "hidden", // Đảm bảo ảnh không vượt ra khung
              display: "flex", // Để canh chỉnh ảnh
              justifyContent: "center", // Để canh chỉnh ảnh
              alignItems: "center", // Để canh chỉnh ảnh
            }}
          >
            <img
              src={image}
              alt="preview"
              style={{
                objectFit: "contain", // Hiển thị ảnh một cách chính xác mà không làm biến dạng tỉ lệ
                width: "100%", // Chiều rộng ảnh sẽ fit với kích thước của Box
                height: "100%", // Chiều cao ảnh sẽ fit với kích thước của Box
              }}
            />
          </Box>
          )}
          <Stack direction="row" gap={1} mt={2} mb={3}>
            <IconButton onClick={() => widgetRef.current?.open()}>
              <Image color="secondary" />
            </IconButton>
            <IconButton onClick={() => widgetRef.current?.open()}>
              <EmojiEmotions color="primary" />
            </IconButton>
          </Stack>
          <ButtonGroup
            fullWidth
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button
              onClick={handleCreatePost}
            >Đăng</Button>
            <Button sx={{ width: "100px" }}>
              <DateRange />
            </Button>
          </ButtonGroup>
        </Box>
      </SytledModal>
    </>
  );
};

export default Add;
