import React from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  Avatar,
} from "@mui/material";

export default function FriendRequestUnit({ friend, onAccept, onReject }) {
  return (
    <Card
      sx={{
        minWidth: 225,
        shadow: 2,
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar alt="User Avatar" src={friend.user.avatarUrl} />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginLeft: 2,
          }}
        >
          {" "}
          <Typography
            fontSize={14}
            fontWeight={600}
            mr={"auto"}
            component="div"
          >
            {friend.user.name}
          </Typography>
          <Typography fontSize={14}>{friend.user.studentId}</Typography>
          <Typography fontSize={14}>{friend.user.class}</Typography>
        </Box>
      </CardContent>
      <CardActions
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          size="small"
          color="primary"
          onClick={() => onAccept(friend.id, friend.user.id)}
        >
          Đồng ý
        </Button>
        <Button
          size="small"
          color="secondary"
          onClick={() => onReject(friend.id)}
        >
          Từ chối
        </Button>
      </CardActions>
    </Card>
  );
}
