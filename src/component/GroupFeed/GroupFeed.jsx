import React from "react";
import {
  Box,
  Stack,
  Skeleton,
  Fab,
  Modal,
  TextField,
  ButtonGroup,
  Button,
  IconButton,
  Typography,
  Avatar,
  Tooltip,
  styled,
  Badge,
  Card,
  CardMedia,
  CardContent,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import Post from "../Feed/Post";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { socket } from "../../socket";
import { useNavigate } from "react-router-dom";
import emojiData from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { createPostGroup, getPostGroup } from "../../service/post.service";
import { openChat } from "../../redux/Slice/chat-slice";
import { getGroupMemberOnline } from "../../service/post.service";
import {
  Add as AddIcon,
  DateRange,
  EmojiEmotions,
  Image,
  Group as GroupIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import {
  getGroupDetail,
  getRequests,
  acceptRequest,
  rejectRequest,
} from "../../service/group.service";
import { green } from "@mui/material/colors";

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

const CustomCard = styled(Card)({
  borderRadius: 15,
  boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
});

const GroupFeed = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const me = useSelector((state) => state.user);
  const PER_PAGE = 5;
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [openRequests, setOpenRequests] = useState(false);
  const [group, setGroup] = useState({});
  const [openMembers, setOpenMembers] = useState(false);
  const accessToken = useSelector((state) => state.user.accessToken);
  const userId = useSelector((state) => state.user.id);
  const user = useSelector((state) => state.user);
  const [requests, setRequests] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentChange, setCurrentChange] = useState("title");
  const [onlineMembers, setOnlineMembers] = useState([]);
  const fakeGroupDetails = {
    name: "Nhóm 1",
    imageUrl:
      "https://play-lh.googleusercontent.com/uJxoDY7gP76P1vjAFfo1nGFZBYRGYtBDTxv0OrkP_4a1x7ZpO7gC5AF2xR6qj-WVefY=w240-h480-rw",
    memberCount: 10,
  };

  useEffect(() => {
    const getPosts = async () => {
      const res = await getPostGroup(accessToken, id);
      const resGroup = await getGroupDetail(accessToken, id);
      const resRequests = await getRequests(accessToken, id);
      const resOnlineMembers = await getGroupMemberOnline(accessToken, id);
      console.log(resGroup);
      console.log(resOnlineMembers);
      setOnlineMembers(resOnlineMembers.data);
      setGroup(resGroup.data);
      setPosts(res.data);
      setLoading(false);
      setRequests(resRequests.data);
    };
    getPosts();
    socket.emit("join-group", `group_${id}`);
    socket.on("refreshGroup", (data) => {
      getPosts();
    });
  }, [userId, accessToken, id]);

  const validate = () => {
    if (!title || !content) {
      toast.error("Vui lòng nhập đủ thông tin");
      return false;
    }
    return true;
  };

  const deletePost = (postId) => {
    console.log(postId);
    const newPosts = posts.filter((post) => post.id !== postId);
    setPosts(newPosts);
  };

  const handleAcceptRequest = async (requestId) => {
    const res = await acceptRequest(accessToken, requestId);
    console.log(res);
    if (res.EC === 200) {
      await socket.emit("notification", `user_${res.data.userId}`);
      toast.success("Chấp nhận yêu cầu thành công");
      const newRequests = requests.filter((req) => req.id !== requestId);
      setRequests(newRequests);
    }
  };

  const handleRejectRequest = async (requestId) => {
    const res = await rejectRequest(accessToken, requestId);
    if (res.EC === 200) {
      toast.success("Từ chối yêu cầu thành công");
      const newRequests = requests.filter((req) => req.id !== requestId);
      setRequests(newRequests);
    }
  };

  const handleCreatePost = async () => {
    if (!validate()) return;
    const newPost = {
      title: title,
      content: content,
      imageUrl: image,
      groupId: id,
    };
    await createPostGroup(newPost, accessToken);
    setOpen(false);
    setTitle("");
    setContent("");
    setImage("");
    toast.success("Tạo bài viết thành công");
    socket.emit("refreshGroup", `group_${id}`);
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

  const StyledBadge = ({ children }) => (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      variant="dot"
      sx={{
        "& .MuiBadge-dot": {
          backgroundColor: green[400],
          width: 12,
          height: 12,
          border: `2px solid white`,
          borderRadius: "50%",
        },
      }}
    >
      {children}
    </Badge>
  );

  return (
    <Box display="flex" p={{ xs: 0, md: 2 }} style={{ paddingRight: "20px" }}>
      <Box
        flex={1}
        p={2}
        sx={{
          position: "fixed",
          width: "15%",
          height: "100%",
          overflow: "auto",
        }}
      >
        <CustomCard>
          <CardMedia
            component="img"
            alt="group image"
            height="200"
            image={fakeGroupDetails.imageUrl}
          />
          <CardContent>
            <Typography variant="h6">{group?.name}</Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/profilepage/${group.owner.id}`)}
            >
              Người sáng lập: {group?.owner?.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {group?.members?.length} thành viên
            </Typography>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              <Typography
                variant="body2"
                color="textSecondary"
                onClick={() => setOpenMembers(true)}
                sx={{ cursor: "pointer" }}
              >
                Xem thành viên
              </Typography>
              {me?.id === group?.OwnerId && (
                <Badge
                  badgeContent={requests.length}
                  color="secondary"
                  onClick={() => setOpenRequests(true)}
                  sx={{ cursor: "pointer" }}
                >
                  <GroupIcon color="action" />
                </Badge>
              )}
            </Box>
          </CardContent>
        </CustomCard>
      </Box>
      <Box flex={4} sx={{ marginLeft: "15%", marginRight: "15%" }}>
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
            boxShadow={3}
          >
            <Typography variant="h6" color="gray" textAlign="center">
              Tạo bài đăng
            </Typography>
            <Divider />
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
              {/* owner  */}
            </UserBox>
            <TextField
              sx={{ width: "100%", mb: 2 }}
              id="standard-multiline-static"
              multiline
              value={title}
              rows={1}
              placeholder="Bạn đang cảm thấy thế nào"
              variant="standard"
              onChange={(e) => {
                setCurrentChange("title");
                setTitle(e.target.value);
              }}
            />
            <TextField
              sx={{ width: "100%", mb: 2 }}
              id="standard-multiline-static"
              multiline
              placeholder="Nội dung"
              variant="standard"
              rows={4}
              value={content}
              maxRows={10}
              onChange={(e) => {
                setCurrentChange("content");
                setContent(e.target.value);
              }}
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
                  mb: 2,
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
              <IconButton
                onClick={() => {
                  setShowEmojiPicker(!showEmojiPicker);
                }}
              >
                <EmojiEmotions color="primary" />
                {showEmojiPicker && (
                  <Picker
                    data={emojiData}
                    onEmojiSelect={(emoji) => {
                      console.log(emoji.native);
                      if (currentChange == "title") {
                        setTitle(title + emoji.native);
                        console.log(title);
                        setShowEmojiPicker(false);
                      } else {
                        setContent(content + emoji.native);
                        setShowEmojiPicker(false);
                      }
                    }}
                  />
                )}
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
              <Post key={post.id} post={post} deletePostEvent={deletePost} />
            ))}
          </>
        )}
      </Box>
      <Box
        flex={1}
        p={2}
        sx={{
          position: "fixed",
          right: 0,
          height: "100%",
          overflow: "auto",
          minWidth: 400,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Thành viên trực tuyến
        </Typography>
        <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
          <List>
            {onlineMembers.map((member) => (
              <ListItem
                key={member.id}
                sx={{ mb: 1 }}
                onClick={() => {
                  dispatch(
                    openChat({
                      ...member,
                      online: true,
                    })
                  );
                }}
                style={{ cursor: "pointer" }}
              >
                <ListItemAvatar>
                  <StyledBadge>
                    <Avatar alt={member?.name} src={member?.avatarUrl} />
                  </StyledBadge>
                </ListItemAvatar>
                <ListItemText
                  primary={member.name + ` (${member.studentId})`}
                  secondary={member?.class}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
      <StyledModal
        open={openRequests}
        onClose={() => setOpenRequests(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          width={600}
          height="auto"
          bgcolor="white"
          color={"text.primary"}
          p={3}
          borderRadius={5}
          boxShadow={3}
        >
          <Typography variant="h6" color="gray" textAlign="center">
            Yêu cầu tham gia nhóm
          </Typography>
          <Divider />
          {requests.length > 0 ? (
            requests.map((req) => (
              <Box
                key={req.id}
                display="flex"
                alignItems="center"
                gap={2}
                mt={2}
              >
                <Avatar src={req.user.avatarUrl} />
                <Typography variant="body1">{req.user.name}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    console.log(req.id);
                    handleAcceptRequest(req.id);
                  }}
                >
                  Đồng ý
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    handleRejectRequest(req.id);
                  }}
                >
                  Từ chối
                </Button>
              </Box>
            ))
          ) : (
            <Typography variant="body1" textAlign="center" mt={2}>
              Không có yêu cầu tham gia nhóm
            </Typography>
          )}
        </Box>
      </StyledModal>
      <StyledModal
        open={openMembers}
        onClose={() => setOpenMembers(false)}
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
          boxShadow={3}
        >
          <Typography variant="h6" color="gray" textAlign="center">
            Danh sách thành viên
          </Typography>
          <Divider />
          {group?.members?.map((member) => (
            <Box
              key={member.id}
              display="flex"
              alignItems="center"
              gap={2}
              mt={2}
            >
              <Avatar
                src={member.user.avatarUrl}
                sx={{
                  borderColor: "primary.main",
                  borderWidth: 1,
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/profilepage/${member.user.id}`)}
              />
              <Typography variant="body1">{member.user.name}</Typography>
              <Typography variant="body1">{member.user.studentId}</Typography>
            </Box>
          ))}
        </Box>
      </StyledModal>
    </Box>
  );
};

export default GroupFeed;
