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
import _ from "lodash";
import { getFriendIdOrName } from "../../service/friend.service";
import { getFriendChatList } from "../../service/chat.service";
import { Badge } from "@mui/material";
import { green, grey } from "@mui/material/colors";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: "100%",
    height: "92.6vh",
  },
  headBG: {
    backgroundColor: "#e0e0e0",
  },
  borderRight500: {
    borderRight: "1px solid #e0e0e0",
  },
  messageArea: {
    height: "86.6vh",
    overflowY: "auto",
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
  const LIMIT = 10;
  const me = useSelector((state) => state.user);
  const classes = useStyles();
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
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

  useEffect(() => {
    const fetchChatList = async () => {
      const result = await getFriendChatList(me.accessToken, LIMIT, page);
      console.log(result);
      setChatList(result.data);
    };
    fetchChatList();
  }, [page]);
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
                <ListItem button key={chat.id}>
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
                  <ListItemText primary={chat.name}>
                    {me.id === chat?.toUserId
                      ? chat?.fromUser?.name
                      : chat?.toUser?.name}
                    <ListItemText primary={chat.name}>
                      {me.id === chat?.toUserId
                        ? chat?.fromUser?.studentId
                        : chat?.toUser?.studentId}
                    </ListItemText>
                  </ListItemText>
                </ListItem>
              ))}
          </List>
        </Grid>
        <Grid item xs={9}>
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
