import React, { useEffect, useState } from "react";
import { getProfileById } from "../../service/user.service";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { date } from "../../utils/index";
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

const RightbarV2 = () => {
  const accessToken = useSelector((state) => state.user.accessToken);
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
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, []);

  const handleAddFriend = () => {
    console.log("Add Friend button clicked");
    // Logic kết bạn
  };

  const handleFollow = () => {
    console.log("Follow button clicked");
    // Logic follow
  };

  return (
    <Box
      sx={{ display: { xs: "none", sm: "block" }, width: 450, marginRight: 2 }}
    >
      <Box
        position="fixed"
        width={450}
        sx={{ maxHeight: "100vh", overflowY: "auto" }}
      >
        <Grid container spacing={2}>
          {/* avatar */}
          <Grid item xs={6}>
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
          <Grid item xs={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddFriend}
                style={{ marginRight: "10px" }}
              >
                Kết bạn
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleFollow}
              >
               Theo dõi
              </Button>
            </Box>
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
