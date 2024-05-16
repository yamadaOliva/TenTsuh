import React from "react";
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Badge,
  TextField,
} from "@mui/material";
import { green } from "@mui/material/colors";

const Rightbar = () => {
  const onlineFriends = [
    {
      name: "Remy Sharp",
      avatar: "https://material-ui.com/static/images/avatar/1.jpg",
    },
    {
      name: "Travis Howard",
      avatar: "https://material-ui.com/static/images/avatar/2.jpg",
    },
    {
      name: "Cindy Baker",
      avatar: "https://material-ui.com/static/images/avatar/3.jpg",
    },
    { name: "Agnes Walker", avatar: "" }, // No image for demonstration
    {
      name: "Trevor Henderson",
      avatar: "https://material-ui.com/static/images/avatar/6.jpg",
    },
  ];

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
        },
      }}
    >
      {children}
    </Badge>
  );

  return (
    <Box
      flex={2}
      sx={{ display: { xs: "none", sm: "block" } }}
      style={{ marginLeft: "10px", marginTop: "10px"}}
    >
      <Box position="fixed" width={500}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            
          }}
        >
          <Typography
            fontWeight={100}
            sx={{ mb: 2 }}
            style={{ marginLeft: "10px",
              fontSize: "20px",
              fontWeight: "bold",
             }}
          >
            Bạn bè đang trực tuyến
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Tìm kiếm bạn bè"
            style={{ marginLeft: "5px" }}
            sx={{ mb: 1 }}
          />
        </Box>

        <List>
          {onlineFriends.map((friend, index) => (
            <ListItem key={index} sx={{ mb: 1 }}>
              <ListItemAvatar>
                <StyledBadge>
                  <Avatar alt={friend.name} src={friend.avatar} />
                </StyledBadge>
              </ListItemAvatar>
              <ListItemText primary={friend.name} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Rightbar;
