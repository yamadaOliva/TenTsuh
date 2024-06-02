import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";
import { Close } from "@mui/icons-material";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import { Badge } from "@mui/material";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import { date } from "../../utils";
import { sendChat, getChatList } from "../../service/chat.service";
import { socket } from "../../socket";
import { green, grey } from "@mui/material/colors";
import { useDispatch } from "react-redux";
import { closeChat } from "../../redux/Slice/chat-slice";
import emojiData from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
const useStyles = makeStyles({
  messageArea: {
    height: "300px",
    overflowY: "auto",
    backgroundColor: "#fff",
  },
  inputArea: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
  },
});

const MiniChat = ({ friend }) => {
  const classes = useStyles();
  const messagesEndRef = useRef(null);
  const me = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const dispatch = useDispatch();
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e) => {
    setCurrentMessage(e.target.value);
  };

  const handleSendChat = async () => {
    if (!currentMessage.trim()) return;
    const data = {
      toUserId: friend.id,
      content: currentMessage,
      fromUserId: me.id,
    };
    const result = await sendChat(me.accessToken, data);
    if (result?.EC === 200) {
      setMessages([...messages, result.data]);
      socket.emit("message", result.data);
      setCurrentMessage("");
    }
  };

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
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await getChatList(me.accessToken, friend.id, 100, 1, true);
      console.log(res);
      if (res?.EC === 200) {
        setMessages(res.data);
      }
    };

    fetchMessages();
    scrollToBottom();
  }, [friend.id]);

  useEffect(() => {
    socket.on("receive-message", (data) => {
      if (friend.id === data.fromUserId) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off("receive-message");
    };
  }, [friend.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    socket.emit("join", `user_${me.id}`);
  }, []);

  return (
    <Grid
      container
      component={Paper}
      style={{
        maxWidth: "400px",
        position: "fixed",
        bottom: "10px",
        right: "100px",
      }}
    >
      <Grid item xs={12}>
        <Box
          bgcolor="#f0f0f0"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box display="flex" alignItems="center" padding="10px">
            <StyledBadge online={friend.online}>
              <Avatar src={friend.avatarUrl} />
            </StyledBadge>
            <Box marginLeft="10px">
              <strong>{friend.name}</strong>
            </Box>
          </Box>
          <Box>
            <IconButton
              onClick={() => {
                dispatch(closeChat());
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </Box>

        <Divider />
        <div className={classes.messageArea} id="scrollableDiv">
          {messages.map((message, index) => (
            <ListItem key={index}>
              <Grid container>
                <Grid item xs={12}>
                  <ListItemText
                    align={message.fromUserId === me.id ? "right" : "left"}
                    primary={message.content}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ListItemText
                    align={message.fromUserId === me.id ? "right" : "left"}
                    secondary={date.convertDateToTime(message.createdAt)}
                  />
                </Grid>
              </Grid>
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <Divider />

        <Grid item xs={12} className={classes.inputArea}>
          <IconButton
            color="primary"
            component="span"
            onClick={() => {
              widgetRef.current.open();
            }}
          >
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
            label="Type a message..."
            fullWidth
            variant="outlined"
            value={currentMessage}
            onChange={handleInputChange}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendChat();
              }
            }}
          />
          <IconButton color="primary" onClick={handleSendChat}>
            <SendIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MiniChat;
