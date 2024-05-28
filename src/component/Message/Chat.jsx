import React, { useState, useEffect, useCallback, useRef } from "react";
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
import {
  getFriendChatList,
  getChatList,
  sendChat,
} from "../../service/chat.service";
import { Badge } from "@mui/material";
import { green, grey } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { date } from "../../utils";
import { socket } from "../../socket";
import InfiniteScroll from "react-infinite-scroll-component";
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
    height: "79.1vh",
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
  const navigate = useNavigate();
  const LIMIT = 10;
  const me = useSelector((state) => state.user);

  const classes = useStyles();
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // {id, name, avatarUrl}
  const [searchTerm, setSearchTerm] = useState("");
  const [chatList, setChatList] = useState([]); // [ {id, name, avatarUrl}
  const [page, setPage] = useState(1);
  const [pageChat, setPageChat] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [image, setImage] = useState("");
  const handleSendMessage = () => {
    console.log(currentMessage);
    if (currentMessage.trim() !== "") {
      setMessages([
        ...messages,
        {
          content: currentMessage,
          fromUserId: me.Id,
          createdAt: new Date().toISOString(),
          imgUrl: image,
        },
      ]);
      setImage("");
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

  const fetchMoreData = async () => {
    console.log("fetchMoreData");
    const result = await getFriendChatList(me.accessToken, LIMIT, page + 1);
    if (result.data.length === 0) {
      setHasMore(false);
    } else {
      setChatList([...chatList, ...result.data]);
      setPage(page + 1);
    }
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

  const handleSendChat = async () => {
    console.log("currentMessage", currentMessage);
    if (currentMessage.trim() === "" && !image) return;
    const data = {
      toUserId: currentUser.id,
      content: currentMessage,
      fromUserId: me.id,
      imageUrl: image,
    };
    const result = await sendChat(me.accessToken, data);
    if (result?.EC === 200) {
      setMessages([
        ...messages,
        {
          ...result.data,
        },
      ]);
      socket.emit("message", result.data);
      const getChatListResult = await getFriendChatList(
        me.accessToken,
        LIMIT,
        page
      );
      setChatList(getChatListResult.data);
      setImage("");
      setCurrentMessage("");
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
        const chatResult = await getChatList(
          me.accessToken,
          result.data[0]?.fromUser.id,
          LIMIT,
          pageChat
        );
        console.log(chatResult);
        setMessages(chatResult.data);
      } else {
        setCurrentUser({
          ...result.data[0]?.toUser,
          online: result.data[0]?.online,
        });
        const chatResult = await getChatList(
          me.accessToken,
          result.data[0]?.toUser.id,
          LIMIT,
          pageChat
        );
        console.log(chatResult);
        setMessages(chatResult.data);
      }
    };

    fetchChatList();
  }, [page]);

  useEffect(() => {
    const fetchChatList = async () => {
      const res = await getChatList(
        me.accessToken,
        currentUser?.id,
        100,
        pageChat
      );
      console.log("dsfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdf");
      setMessages(res.data);
    };

    if (currentUser) {
      fetchChatList();
      const messageListener = async (data) => {
        console.log("receive-message", currentUser, data);
        if (currentUser.id == data?.fromUserId)
          setMessages((prevMessages) => [...prevMessages, data]);
        const res = await getFriendChatList(me.accessToken, LIMIT, page);
        setChatList(res.data);
      };

      if (currentUser) {
        socket.on("receive-message", messageListener);
      }

      return () => {
        if (currentUser) {
          socket.off("receive-message", messageListener);
        }
      };
    }
  }, [currentUser]);

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

  useEffect(() => {
    console.log("chatList", messages);
  }, [messages]);
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
                            chat?.status === "UNREAD" &&
                            me.id === chat?.toUserId
                              ? "black"
                              : "grey",
                          fontWeight:
                            chat?.status === "UNREAD" &&
                            me.id === chat?.toUserId
                              ? "bold"
                              : "normal",
                        }}
                      >
                        {`${me.id != chat?.toUserId ? "Bạn :" : ""} ${
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
          <List className={classes.messageArea} >
            <div ref={messagesEndRef} id="scrollableDiv"
            >
              {/* {messages &&
                me &&
                messages.map((message, index) => {
                  return (
                    <ListItem key={index}>
                      <Grid container>
                        <Grid item xs={12}>
                          <ListItemText
                            align={
                              message.fromUserId == me.id ? "right" : "left"
                            }
                            primary={
                              <div>
                                {message.content}
                                {message.imageUrl && (
                                  <img
                                    src={message.imageUrl}
                                    alt="image"
                                    style={{
                                      width: "200px",
                                      maxHeight: "200px",
                                    }}
                                  />
                                )}
                              </div>
                            }
                          ></ListItemText>
                        </Grid>
                        <Grid item xs={12}>
                          <ListItemText
                            align={
                              message.fromUserId === me.id ? "right" : "left"
                            }
                            secondary={date.convertDateToTime(
                              message.createdAt
                            )}
                          ></ListItemText>
                        </Grid>
                      </Grid>
                    </ListItem>
                  );
                })} */}
              <InfiniteScroll
                dataLength={messages?.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                inverse={true}
                scrollableTarget="scrollableDiv"
                style={{ display: 'flex', flexDirection: 'column-reverse' }}
              >
                {messages &&
                  me &&
                  messages.map((message, index) => {
                    return (
                      <ListItem key={index}>
                        <Grid container>
                          <Grid item xs={12}>
                            <ListItemText
                              align={
                                message.fromUserId == me.id ? "right" : "left"
                              }
                              primary={
                                <div>
                                  {message.content}
                                  {message.imageUrl && (
                                    <img
                                      src={message.imageUrl}
                                      alt="image"
                                      style={{
                                        width: "200px",
                                        maxHeight: "200px",
                                      }}
                                    />
                                  )}
                                </div>
                              }
                            ></ListItemText>
                          </Grid>
                          <Grid item xs={12}>
                            <ListItemText
                              align={
                                message.fromUserId === me.id ? "right" : "left"
                              }
                              secondary={date.convertDateToTime(
                                message.createdAt
                              )}
                            ></ListItemText>
                          </Grid>
                        </Grid>
                      </ListItem>
                    );
                  })}
              </InfiniteScroll>
            </div>
          </List>
          <Divider />

          <Grid item xs={12} className={classes.inputArea}>
            {image && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "10px",
                }}
              >
                <img
                  src={image}
                  alt="image"
                  style={{ width: "100px", maxHeight: "100px" }}
                />
              </div>
            )}
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
              label="Nhập tin nhắn"
              fullWidth
              variant="outlined"
              value={currentMessage}
              onChange={handleInputChange}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendChat();
                }
              }}
              style={{
                marginLeft: "10px",
                marginRight: "10px",
                backgroundColor: "#f0f0f0",
                marginBottom: "10px",
              }}
            />
            <IconButton
              color="primary"
              aria-label="send message"
              onClick={() => handleSendChat()}
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
