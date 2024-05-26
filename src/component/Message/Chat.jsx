import React, { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import SendIcon from "@material-ui/icons/Send";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import IconButton from "@material-ui/core/IconButton";
import { useSelector } from "react-redux";
import emojiData from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Box from "@mui/material/Box";
import _ from "lodash";
import { getFriendIdOrName } from "../../service/friend.service";
import { getFriendChatList } from "../../service/chat.service";
import { Badge } from "@mui/material";
import { green, grey } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: "100%",
    height: "92.6vh",
    display: "flex",
    flexDirection: "row",
  },
  headBG: {
    backgroundColor: "#e0e0e0",
  },
  borderRight500: {
    borderRight: "1px solid #e0e0e0",
  },
  messageArea: {
    height: "auto",
    overflowY: "auto",
    height: "85%",
  },
  inputArea: {
    display: "flex",
    alignItems: "center",
  },
});

const StyledBadge = ({ children, online }) => (
  <Badge
    overlap="circular"
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    variant="dot"
    sx={{
      "& .MuiBadge-dot": {
        backgroundColor: online ? green[400] : grey[400],
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

const Chat = () => {
  const navigate = useNavigate();
  const LIMIT = 10;
  const me = useSelector((state) => state.user);
  const classes = useStyles();
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // {id, name, avatarUrl}
  const [searchTerm, setSearchTerm] = useState("");
  const [chatList, setChatList] = useState([]); // [ {id, name, avatarUrl}
  const [page, setPage] = useState(1);

  const handleSendMessage = () => {
    console.log(currentMessage);
    if (currentMessage.trim() !== "") {
      setMessages([
        ...messages,
        {
          text: currentMessage,
          fromUserId: me.Id,
          time: new Date().toLocaleTimeString(),
        },
      ]);
      setCurrentMessage("");
    }
  };
  const handleInputChange = (e) => {
    setCurrentMessage(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const debouncedSearch = useCallback(
    _.debounce((query) => {
      if (query === "") return;
      getFriendIdOrName(me.accessToken, query, 1, 10).then((result) => {
        setChatList(result.data);
        console.log(result); // Handle result
      });
    }, 500),
    []
  );

  const handleSelectChat = (chat) => {
    console.log(chat);
    if (me.id === chat.toUserId) {
      setCurrentUser({ ...chat.fromUser, online: chat.online });
    } else {
      setCurrentUser({ ...chat.toUser, online: chat.online });
    }
  };

  useEffect(() => {
    const fetchChatList = async () => {
      const result = await getFriendChatList(me.accessToken, LIMIT, page);
      console.log(result);
      setChatList(result.data);
      console.log(me.id);
      if (me.id === result.data[0]?.toUserId) {
        setCurrentUser({
          ...result.data[0]?.fromUser,
          online: result.data[0]?.online,
        });
      } else {
        setCurrentUser({
          ...result.data[0]?.toUser,
          online: result.data[0]?.online,
        });
      }
    };
    fetchChatList();
  }, [page]);

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);
  return (
    <div>
      <Grid container component={Paper} className={classes.chatSection}>
        <Grid item xs={3} className={classes.borderRight500}>
          <List>
            <ListItem button key="RemySharp">
              <ListItemIcon>
                <Avatar
                  alt="Remy Sharp"
                  src={me.avatarUrl || "https://via.placeholder.com/150"}
                />
              </ListItemIcon>
              <ListItemText primary={me.name}></ListItemText>
            </ListItem>
          </List>
          <Divider />
          <Grid item xs={12} style={{ padding: "10px" }}>
            <TextField
              id="outlined-basic-email"
              label="Search"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Grid>
          <Divider />
          <List>
            {chatList &&
              chatList.map((chat) => (
                <ListItem
                  button
                  key={chat.id}
                  onClick={() => handleSelectChat(chat)}
                >
                  <ListItemIcon>
                    <StyledBadge online={chat.online}>
                      <Avatar
                        alt={
                          me.id === chat?.toUserId
                            ? chat?.fromUser?.name
                            : chat?.toUser?.name
                        }
                        src={
                          me.id === chat?.toUserId
                            ? chat?.fromUser?.avatarUrl
                            : chat?.toUser?.avatarUrl
                        }
                      />
                    </StyledBadge>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span style={{ fontWeight: "bold" }}>
                        {me.id === chat?.toUserId
                          ? chat?.fromUser?.name
                          : chat?.toUser?.name}{" "}
                        (
                        {me.id === chat?.toUserId
                          ? chat?.fromUser?.studentId
                          : chat?.toUser?.studentId}
                        )
                      </span>
                    }
                    secondary={
                      <span
                        style={{
                          color:
                            chat?.status === "UNREAD" && me.id != chat?.toUserId
                              ? "black"
                              : "grey",
                          fontWeight:
                            chat?.status === "UNREAD" && me.id != chat?.toUserId
                              ? "bold"
                              : "normal",
                        }}
                      >
                        {`${me.id === chat?.toUserId ? "Bạn :" : ""} ${
                          chat?.content
                        }`}
                      </span>
                    }
                  />
                </ListItem>
              ))}
          </List>
        </Grid>
        <Grid item xs={9}>
          {currentUser && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 20px",
                backgroundColor: "#f0f0f0",
                borderBottom: "1px solid #ddd",
              }}
            >
              <StyledBadge online={currentUser.online}>
                <Avatar
                  alt={currentUser.name}
                  src={
                    currentUser.avatarUrl || "https://via.placeholder.com/150"
                  }
                  onClick={() => {
                    navigate(`/profilepage/${currentUser.id}`);
                  }}
                  style={{ cursor: "pointer" }}
                />
              </StyledBadge>
              <Box
                style={{
                  marginLeft: "15px",
                }}
              >
                {" "}
                <Typography
                  variant="subtitle1"
                  component="div"
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  {currentUser.name} ({currentUser.studentId})
                </Typography>
                <Typography variant="subtitle2" component="div">
                  {currentUser?.class}
                </Typography>
              </Box>
            </div>
          )}
          <List className={classes.messageArea}>
            {messages.map((message, index) => (
              <ListItem key={index}>
                <Grid container>
                  <Grid item xs={12}>
                    <ListItemText
                      align={message.fromUserId === me.Id ? "right" : "left"}
                      primary={message.text}
                    ></ListItemText>
                  </Grid>
                  <Grid item xs={12}>
                    <ListItemText
                      align={message.fromUserId === me.Id ? "right" : "left"}
                      secondary={message.time}
                    ></ListItemText>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
          <Divider />
          <Grid item xs={12} className={classes.inputArea}>
            <IconButton color="primary" component="span">
              <PhotoCamera />
            </IconButton>
            <IconButton
              color="primary"
              component="span"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <InsertEmoticonIcon />
              {showEmojiPicker && (
                <div className="absolute bottom-20">
                  <Picker
                    data={emojiData}
                    onEmojiSelect={(e) => {
                      setCurrentMessage(currentMessage + e.native);
                    }}
                  />
                </div>
              )}
            </IconButton>
            <TextField
              label="Nhập tin nhắn"
              fullWidth
              variant="outlined"
              value={currentMessage}
              onChange={handleInputChange}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              style={{
                marginLeft: "10px",
                marginRight: "10px",
                backgroundColor: "#f0f0f0",
              }}
            />
            <IconButton
              color="primary"
              aria-label="send message"
              onClick={handleSendMessage}
              style={{ marginRight: "10px", backgroundColor: "#f0f0f0" }}
            >
              <SendIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Chat;
