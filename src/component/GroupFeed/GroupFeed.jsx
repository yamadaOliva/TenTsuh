import { Box, Stack, Skeleton, Fab, Modal, TextField, ButtonGroup, Button, IconButton, Typography, Avatar, Tooltip, styled, Badge, Card, CardMedia, CardContent } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import Post from "../Feed/Post";
import { getPotsOfUser, createPost } from "../../service/post.service"; // Lấy bài viết của người dùng
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Add as AddIcon, DateRange, EmojiEmotions, Image, Group as GroupIcon } from "@mui/icons-material";
import { toast } from "react-toastify";

const StyledModal = styled(Modal)({
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

const GroupFeed = () => {
  const PER_PAGE = 5;
  const { id } = useParams(); // id này là groupId
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [openRequests, setOpenRequests] = useState(false);
  const accessToken = useSelector((state) => state.user.accessToken);
  const userId = useSelector((state) => state.user.id);
  const user = useSelector((state) => state.user);

  const fakeGroupDetails = {
    name: "Nhóm 1",
    imageUrl: "https://play-lh.googleusercontent.com/uJxoDY7gP76P1vjAFfo1nGFZBYRGYtBDTxv0OrkP_4a1x7ZpO7gC5AF2xR6qj-WVefY=w240-h480-rw",
    memberCount: 10,
  };

  const fakeJoinRequests = [
    { id: 1, name: "Alice", avatarUrl: "https://via.placeholder.com/150" },
    { id: 2, name: "Bob", avatarUrl: "https://via.placeholder.com/150" },
  ];

  const fakeOnlineMembers = [
    { id: 1, name: "Alice", avatarUrl: "https://via.placeholder.com/150" },
    { id: 2, name: "Bob", avatarUrl: "https://via.placeholder.com/150" },
    { id: 3, name: "Charlie", avatarUrl: "https://via.placeholder.com/150" },
  ];

  useEffect(() => {
	const getPosts = async () => {
	  const res = await getPotsOfUser(userId);
	  setPosts(res.data);
	  setLoading(false);
	};		

    setTimeout(() => {
      
      setLoading(false);
    }, 1000);
	getPosts();
  }, [userId]);

  const validate = () => {
    if (!title || !content) {
      toast.error("Vui lòng nhập đủ thông tin");
      return false;
    }
    return true;
  }

  const handleCreatePost = () => {
    if (!validate()) return;
    const newPost = {
      id: posts.length + 1,
      title: title,
      content: content,
      imageUrl: image,
      user,
    };
    setPosts([newPost, ...posts]);
    setOpen(false);
    toast.success("Tạo bài viết thành công");
  };

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
          const fileExtension = result.info?.format;
          if (fileExtension !== "png" && fileExtension !== "jpg") {
            toast.error("ảnh phải có định dạng jpg hoặc png");
            return;
          }
          if (result.info?.secure_url?.startsWith("http")) {
            setImage(result.info.secure_url);
          }
        }
      }
    );
  }, []);

  return (
    <Box
      display="flex"
      p={{ xs: 0, md: 2 }}
      style={{
        paddingRight: "20px",
      }}
    >
      <Box flex={1} p={2}>
        <Card>
          <CardMedia
            component="img"
            alt="group image"
            height="200"
            image={fakeGroupDetails.imageUrl}
          />
          <CardContent>
            <Typography variant="h6">{fakeGroupDetails.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {fakeGroupDetails.memberCount} thành viên
            </Typography>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              <Typography variant="body2" color="textSecondary">
                Yêu cầu tham gia:
              </Typography>
              <Badge
                badgeContent={fakeJoinRequests.length}
                color="secondary"
                onClick={() => setOpenRequests(true)}
                sx={{ cursor: "pointer" }}
              >
                <GroupIcon color="action" />
              </Badge>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Box flex={4}>
        <Tooltip
          onClick={() => setOpen(true)}
          title="Tạo bài đăng"
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
        <StyledModal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            width={400}
            height="auto"
            bgcolor="white"
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
                  overflow: "hidden",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={image}
                  alt="preview"
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "100%",
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
              <Button onClick={handleCreatePost}>Đăng</Button>
              <Button sx={{ width: "100px" }}>
                <DateRange />
              </Button>
            </ButtonGroup>
          </Box>
        </StyledModal>
        {loading ? (
          <Stack spacing={1}>
            <Skeleton variant="text" height={100} />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="rectangular" height={300} />
          </Stack>
        ) : (
          <>
            {posts?.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </>
        )}
      </Box>
      <Box flex={1} p={2}>
        <Typography variant="h6" gutterBottom>
          Thành viên trực tuyến
        </Typography>
        {fakeOnlineMembers.map((member) => (
          <Box key={member.id} display="flex" alignItems="center" gap={2} mt={2}>
            <Avatar src={member.avatarUrl} />
            <Typography variant="body1">{member.name}</Typography>
          </Box>
        ))}
      </Box>
      <StyledModal
        open={openRequests}
        onClose={() => setOpenRequests(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          width={400}
          height="auto"
          bgcolor="white"
          color={"text.primary"}
          p={3}
          borderRadius={5}
        >
          <Typography variant="h6" color="gray" textAlign="center">
            Yêu cầu tham gia nhóm
          </Typography>
          {fakeJoinRequests.map((req) => (
            <Box key={req.id} display="flex" alignItems="center" gap={2} mt={2}>
              <Avatar src={req.avatarUrl} />
              <Typography variant="body1">{req.name}</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  toast.success(`Chấp nhận yêu cầu từ ${req.name}`);
                }}
              >
                Đồng ý
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  toast.error(`Từ chối yêu cầu từ ${req.name}`);
                }}
              >
                Từ chối
              </Button>
            </Box>
          ))}
        </Box>
      </StyledModal>
    </Box>
  );
};

export default GroupFeed;
