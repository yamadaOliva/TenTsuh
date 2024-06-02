import React, { useEffect, useState } from "react";
import { getProfileById } from "../../service/user.service";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { date } from "../../utils/index";
import { toast } from "react-toastify";
import {
  Avatar,
  Box,
  Grid,
  Typography,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";
import {
  checkFollow,
  followFriend,
  unfollowFriend,
  unFriend,
  addFriendRequest,
} from "../../service/friend.service";
import { socket } from "../../socket";
const RightbarV2 = () => {
  const accessToken = useSelector((state) => state.user.accessToken);
  const me = useSelector((state) => state.user);
  const [status, setStatus] = useState({});
  const { id } = useParams();
  const [user, setUser] = useState({});
  const friendsList = [
    {
      name: "Travis Howard",
      avatar: "https://material-ui.com/static/images/avatar/2.jpg",
    },
    {
      name: "Cindy Baker",
      avatar: "https://material-ui.com/static/images/avatar/3.jpg",
    },
    { name: "Agnes Walker", avatar: "" },
    {
      name: "Trevor Henderson",
      avatar: "https://material-ui.com/static/images/avatar/6.jpg",
    },
    {
      name: "Steve Rogers",
      avatar: "https://material-ui.com/static/images/avatar/7.jpg",
    },
    {
      name: "Natasha Romanoff",
      avatar: "https://material-ui.com/static/images/avatar/8.jpg",
    },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfileById(accessToken, id);
        setUser(res.data);
        const resStatus = await checkFollow(accessToken, id);
        console.log(resStatus.data);
        setStatus(resStatus.data);

        console.log(resStatus.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, []);

  const handleAddFriend = async () => {
    console.log("Add Friend button clicked");
    const res = await addFriendRequest(accessToken, id);
    setStatus(res.data);
    console.log(res);
    if (res.EC === 200) {
      toast.success("Đã gửi lời mời kết bạn");
      socket.emit("addFriend", { friendId: id });
      setStatus({ ...status, friend: { status: "PENDING" } });
      socket.off("addFriend");
    }
  };

  const handleFollow = async () => {
    const res = await followFriend(accessToken, id);
    setStatus(res.data);
    if (res.EC === 200) {
      toast.success("Đã theo dõi");
      setStatus({ ...status, follow: true });
    }
  };

  const handleUnfollow = async () => {
    console.log("Unfollow button clicked");
    const res = await unfollowFriend(accessToken, id);
    setStatus(res.data);
    console.log(res);
    if (res.EC === 200) {
      toast.success("Đã bỏ theo dõi");
      setStatus({ ...status, follow: false });
    }
  };

  const handleUnfriend = async () => {
    console.log("Unfriend button clicked");
    const res = await unFriend(accessToken, id);
    setStatus(res.data);
    console.log(res);
    if (res.EC === 200) {
      toast.success("Đã hủy kết bạn");
      setStatus({ ...status, friend: false });
      socket.emit("addFriend", { friendId: id });
      socket.off("addFriend");
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfileById(accessToken, id);
        setUser(res.data);
        const resStatus = await checkFollow(accessToken, id);
        console.log(resStatus.data);
        setStatus(resStatus.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, [id]);

  return (
    <Box
      sx={{
        display: { xs: "none", sm: "block" },
        width: {
          xl: id != me?.id ? 500 : 400,
          sm: 300,
        },
        marginRight: 2,
      }}
    >
      <Box position="fixed" sx={{ maxHeight: "100vh", overflowY: "auto" }}>
        <Grid container spacing={2}>
          {/* avatar */}
          <Grid item xs={id != me?.id ? 4 : 12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                flexDirection: "column",
              }}
            >
              <Avatar
                src={user.avatarUrl || "https://via.placeholder.com/150"}
                sx={{ width: 100, height: 100, border: `2px solid green` }}
              />
              <Typography>{user.name}</Typography>
              <Typography>{user.studentId}</Typography>
              <Typography>{user.class}</Typography>
            </Box>
          </Grid>
          {/* add friend and follow buttons */}
          <Grid item xs={8}>
            {me.id !== user.id && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                {!status?.friend && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddFriend}
                    style={{ marginRight: "10px" }}
                  >
                    Kết bạn
                  </Button>
                )}

                {status?.friend?.status === "PENDING" && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUnfriend}
                    style={{ marginRight: "10px" }}
                  >
                    Hủy lời mời
                  </Button>
                )}

                {status?.friend?.status === "ACCEPTED" && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUnfriend}
                    style={{ marginRight: "10px" }}
                  >
                    Hủy kết bạn
                  </Button>
                )}

                {!status?.follow ? (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleFollow}
                  >
                    Theo dõi
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleUnfollow}
                  >
                    Bỏ theo dõi
                  </Button>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold" }}
          style={{ marginBottom: "10px", borderBottom: "1px solid #ccc" }}
        >
          Thông tin cá nhân
        </Typography>
        <Typography>
          <Typography sx={{ fontWeight: "bold", display: "inline-block" }}>
            {" "}
            Quê quán:{" "}
          </Typography>
          {user?.district && user?.district + ", "} {user?.city && user?.city}
        </Typography>
        {user.liveIn && (
          <Typography>
            <Typography sx={{ fontWeight: "bold", display: "inline-block" }}>
              Sống tại:{" "}
            </Typography>
            {user.liveIn}
          </Typography>
        )}

        {user?.Birthday && (
          <Typography>
            <Typography sx={{ fontWeight: "bold", display: "inline-block" }}>
              Ngày sinh:{" "}
            </Typography>
            {date.convertDateToString(user.Birthday)}
          </Typography>
        )}

        {user?.interest?.length > 0 && (
          <Typography>
            <Typography sx={{ fontWeight: "bold", display: "inline-block" }}>
              Sở thích:{" "}
            </Typography>
            {user.interest.join(", ")}
          </Typography>
        )}

        {user?.phone && (
          <Typography>
            <Typography sx={{ fontWeight: "bold", display: "inline-block" }}>
              Số điện thoại:{" "}
            </Typography>
            {user.phone}
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Bạn bè
        </Typography>
        <Grid container spacing={2}>
          {friendsList.slice(0, 6).map((friend, index) => (
            <Grid item xs={4} key={index}>
              <Card sx={{ maxWidth: 400 }}>
                <CardMedia
                  height="200"
                  image={friend.avatar || "https://via.placeholder.com/150"}
                  alt={friend.name}
                  sx={{ width: "100%", height: 100, bgcolor: "grey.300" }}
                />
                <CardContent>
                  <Typography gutterBottom variant="body2" noWrap>
                    {friend.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default RightbarV2;
