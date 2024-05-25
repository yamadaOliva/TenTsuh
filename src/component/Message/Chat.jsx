import React, { useState, useEffect } from "react";
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

const Chat = () => {
  const me = useSelector((state) => state.user);
  const classes = useStyles();
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleSendMessage = () => {
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
            />
          </Grid>
          <Divider />
          <List>
            <ListItem button key="RemySharp">
              <ListItemIcon>
                <Avatar
                  alt="Remy Sharp"
                  src="https://material-ui.com/static/images/avatar/1.jpg"
                />
              </ListItemIcon>
              <ListItemText primary="Remy Sharp">Remy Sharp</ListItemText>
              <ListItemText secondary="online" align="right"></ListItemText>
            </ListItem>
            <ListItem button key="Alice">
              <ListItemIcon>
                <Avatar
                  alt="Alice"
                  src="https://material-ui.com/static/images/avatar/3.jpg"
                />
              </ListItemIcon>
              <ListItemText primary="Alice">Alice</ListItemText>
            </ListItem>
            <ListItem button key="CindyBaker">
              <ListItemIcon>
                <Avatar
                  alt="Cindy Baker"
                  src="https://material-ui.com/static/images/avatar/2.jpg"
                />
              </ListItemIcon>
              <ListItemText primary="Cindy Baker">Cindy Baker</ListItemText>
            </ListItem>
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
            </IconButton>
            {showEmojiPicker && (
              <div className="absolute bottom-10 right-0">
                <Picker
                  data={emojiData}
                  onEmojiSelect={(e) => {
                    //console.log(e);
                    setCurrentMessage(currentMessage + e.native);
                  }}
                />
              </div>
            )}
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
