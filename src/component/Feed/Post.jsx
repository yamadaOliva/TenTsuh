import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Favorite,
  FavoriteBorder,
  MoreVert,
  Share,
  Comment,
} from "@mui/icons-material";
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Checkbox,
  IconButton,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button,
  Collapse,
  Badge,
} from "@mui/material";
import { useSelector } from "react-redux";
import { date } from "../../utils/index";
import {
  getPostById,
  commentPost,
  replyComment,
  likeComment,
  unlikeComment,
  likePost,
  unlikePost,
} from "../../service/post.service";
import { socket } from "../../socket";
const Post = ({ post }) => {
  const navigate = useNavigate();
  const me = useSelector((state) => state.user);
  const [currentPost, setCurrentPost] = useState(post);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [change, setChange] = useState(0);
  const [isModalLikeOpen, setIsModalLikeOpen] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(currentPost.likes);
  const [comments, setComments] = useState(
    post?.comments || [
      {
        id: 1,
        user: {
          name: "John Doe",
          avatarUrl: "https://via.placeholder.com/40",
        },
        text: "This is a great post!",
        liked: false,
        replies: [],
      },
      {
        id: 2,
        user: {
          name: "Jane Smith",
          avatarUrl: "https://via.placeholder.com/40",
        },
        text: "Thanks for sharing!",
        liked: false,
        replies: [],
      },
    ]
  );

  const likeCommentHandler = async (comment) => {
    console.log(comment);
    const commentId = comment.id;
    let check;
    if (comment.likes.length === 0) {
      check = false;
    } else {
      check = comment.likes.find((like) => {
        console.log(like.user.id);
        return like.user.id === me.id;
      });
    }
    console.log(check);
    if (check) {
      await unlikeComment(me.accessToken, commentId);
      await reLoadPost();
      socket.emit("comment", `post_${currentPost.id}`);
      socket.emit("notification", `user_${comment.user.id}`)
    } else {
      await likeComment(me.accessToken, commentId);
      await reLoadPost();
      socket.emit("comment", `post_${currentPost.id}`);
      socket.emit("notification", `user_${comment.user.id}`)
    }
  };

  const findCommentChildren = (commentId) => {
    return currentPost.comments.filter(
      (comment) => comment.fatherId === commentId
    );
  };

  const CommentItem = ({ comment, addReply, handleLike }) => {
    const [replyText, setReplyText] = useState("");
    const [showReply, setShowReply] = useState(false);

    const handleReplyChange = (event) => {
      setReplyText(event.target.value);
    };

    const submitReply = async () => {
      await replyComment(me.accessToken, comment.id, replyText);
      await reLoadPost();
      socket.emit("comment", `post_${currentPost.id}`);
      socket.emit("notification", `user_${comment.user.id}`)
      setReplyText("");
      setShowReply(false);
    };

    return (
      <>
        <ListItem 
          alignItems="flex-start"
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <ListItemAvatar>
            <Avatar src={comment.user.avatarUrl} />
          </ListItemAvatar>
          <ListItemText
            primary={comment.content}
            secondary={
              comment.user.name +
              " - " +
              date.convertDateToTime(comment.createdAt)
            }
          />
          <Typography
            variant="body2"
            color="text.secondary"
            style={{
              fontSize: "1rem",
              fontWeight: "600",
              color: "#000000",
              cursor: "pointer",
              position: "relative",
            }}
            onClick={() => {
              setCurrentLikes(comment.likes);
              console.log(comment.likes);
              setIsModalLikeOpen(true);
            }}
          >
            {comment.likes.length > 0 ? comment.likes.length : ""}
          </Typography>

          <IconButton
            aria-label="like comment"
            onClick={() => likeCommentHandler(comment)}
          >
            <Checkbox
              icon={<FavoriteBorder />}
              checkedIcon={<Favorite sx={{ color: "red" }} />}
              checked={comment.likes.find((like) => like.user.id === me.id)}
            />
          </IconButton>
          <IconButton
            aria-label="reply comment"
            onClick={() => setShowReply(!showReply)}
          >
            <Comment />
          </IconButton>
        </ListItem>
        <Collapse in={showReply} timeout="auto" unmountOnExit>
          <div style={{ paddingLeft: "3rem", paddingBottom: "1rem" }}>
            <TextField
              fullWidth
              value={replyText}
              onChange={handleReplyChange}
              placeholder="Viết phản hồi..."
              variant="outlined"
            />
            <Button onClick={submitReply} color="primary">
              Phản hồi
            </Button>
          </div>
        </Collapse>
        {findCommentChildren(comment.id) &&
          findCommentChildren(comment.id).map((reply, index) => (
            <ListItem key={index} style={{ paddingLeft: "4rem" }}>
              <ListItemAvatar>
                <Avatar src={reply.user.avatarUrl} />
              </ListItemAvatar>
              <ListItemText
                primary={reply.content}
                secondary={
                  reply.user.name +
                  " - " +
                  date.convertDateToTime(reply.createdAt)
                }
              />
              <Typography
                variant="body2"
                color="text.secondary"
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#000000",
                  cursor: "pointer",
                  position: "relative",
                }}
                onClick={() => {
                  setCurrentLikes(reply.likes);
                  setIsModalLikeOpen(true);
                }}
              >
                {reply.likes.length > 0 ? reply.likes.length : ""}
              </Typography>
              
              <IconButton
                aria-label="like reply"
                onClick={() => likeCommentHandler(reply)}
              >
                <Checkbox
                  icon={<FavoriteBorder />}
                  checkedIcon={<Favorite sx={{ color: "red" }} />}
                  checked={reply.likes.find((like) => like.user.id === me.id)}
                />
              </IconButton>
            </ListItem>
          ))}
      </>
    );
  };

  const Comments = ({
    comments,
    addReply,
    handleLike,
    accessToken,
    postId,
  }) => {
    const [newComment, setNewComment] = useState("");

    const handleCommentChange = (event) => {
      setNewComment(event.target.value);
    };

    const submitComment = async () => {
      if (!newComment.trim()) return;
      const res = await commentPost(accessToken, postId, newComment);
      await reLoadPost();
      socket.emit("comment", `post_${currentPost.id}`);
      socket.emit("notification", `user_${currentPost.user.id}`)
      setNewComment("");
    };

    return (
      <div
        style={{ padding: "0 1rem 1rem 1rem", borderTop: "1px solid #C0C0C0" }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          style={{
            fontSize: "1rem",
            fontWeight: "600",
            color: "#000000",
            marginTop: "1rem",
            marginLeft: "1rem",
          }}
        >
          {currentPost.comments.length} bình luận
        </Typography>
        <List>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              addReply={addReply}
              handleLike={handleLike}
            />
          ))}
        </List>
        <TextField
          fullWidth
          value={newComment}
          onChange={handleCommentChange}
          placeholder="Viết bình luận..."
          variant="outlined"
        />
        <Button
          onClick={submitComment}
          style={{
            marginTop: "1rem",
            borderRadius: "10px",
            backgroundColor: "#3f51b5",
            color: "#fff",
          }}
        >
          Bình luận
        </Button>
      </div>
    );
  };

  const toggleComments = () => setShowComments(!showComments);

  const addReply = (parentId, text) => {
    if (parentId === null) {
      setComments([
        ...comments,
        {
          id: comments.length + 1,
          user: {
            name: "New User",
            avatarUrl: "https://via.placeholder.com/40",
          },
          text,
          liked: false,
          replies: [],
        },
      ]);
    } else {
      const updatedComments = comments.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [
              ...comment.replies,
              {
                id: comment.replies.length + 1,
                user: {
                  name: "New User",
                  avatarUrl: "https://via.placeholder.com/40",
                },
                text,
                liked: false,
              },
            ],
          };
        }
        return comment;
      });
      setComments(updatedComments);
    }
  };

  const handleLike = (id) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === id) {
        return { ...comment, liked: !comment.liked };
      }
      const updatedReplies = comment.replies.map((reply) => {
        if (reply.id === id) {
          return { ...reply, liked: !reply.liked };
        }
        return reply;
      });
      return { ...comment, replies: updatedReplies };
    });
    setComments(updatedComments);
  };
  const reLoadPost = async () => {
    console.log("Reloading post with ID:", currentPost.id);
    try {
      const res = await getPostById(me.accessToken, currentPost.id);
      console.log("API response:", res.data);
      setCurrentPost(res.data);
    } catch (error) {
      console.error("Failed to reload post:", error);
    }
  };

  const handleLikePost = async () => {
    console.log(post.id);
    if (isLiked) {
      await unlikePost(currentPost.id, me.accessToken);
      const res = await getPostById(me.accessToken, currentPost.id);
      setCurrentPost(res.data);
      setIsLiked(false);
      socket.emit("comment", `post_${currentPost.id}`);
      socket.emit("notification", `user_${currentPost.user.id}`)
    } else {
      await likePost(currentPost.id, me.accessToken);
      const res = await getPostById(me.accessToken, currentPost.id);
      setCurrentPost(res.data);
      setIsLiked(true);
      socket.emit("comment", `post_${currentPost.id}`);
      socket.emit("notification", `user_${currentPost.user.id}`)
    }
  };

  useEffect(() => {
    currentPost.likes.forEach((like) => {
      if (like.user.id === me.id) {
        setIsLiked(true);
      }
    });
    socket.emit("joinPost", `post_${post.id}` );
    socket.on("comment", (data) => {
      console.log(data);
      reLoadPost();
    });
  }, []); 

  const LikePostModal = ({ likes }) => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#fff",
          padding: "1rem",
          borderRadius: "10px",
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
          border: "2px solid #000",
          maxHeight: "30vh",
          width: "80%",
          maxWidth: "400px", 
          zIndex: 1000, 
          overflow: "auto",
        }}
      >
        <Typography
          variant="h5"
          style={{
            fontWeight: "bold",
            fontSize: "1.5rem",
            color: "#000000",
          }}
        >
          {likes.length} lượt thích {}
        </Typography>
        <List>
          {likes.map((like) => (
            <ListItem key={like.user.id}>
              <ListItemAvatar>
                <Avatar src={like.user.avatarUrl} />
              </ListItemAvatar>
              <ListItemText primary={like.user.name} />
            </ListItem>
          ))}
        </List>
        <Button
          onClick={() => setIsModalLikeOpen(false)}
          style={{
            marginTop: "1rem",
            borderRadius: "10px",
            backgroundColor: "#3f51b5",
            color: "#fff",
          }}
        >
          Close
        </Button>
      </div>
    );
  };
  return (
    <>
      <Card
        style={{
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
          transition: "0.3s",
          borderRadius: "10px",
          maxWidth: "800px",
          marginLeft: "18%",
          marginBottom: "20px",
          marginTop: "10px",
          height: "fit-content",
          position: "relative",
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              aria-label="recipe"
              src={currentPost.user.avatarUrl}
              style={{
                borderColor: "primary.main",
                border: "1px solid",
              }}
            />
          }
          action={
            <IconButton aria-label="settings">
              <MoreVert />
            </IconButton>
          }
          title={post.user.name}
          subheader={date.convertDateToTime(currentPost.createdAt)}
          style={{
            borderBottom: "1px solid #C0C0C0",
          }}
        />

        {currentPost.imageUrl && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "20%",
            }}
          >
            <CardMedia
              component="img"
              image={currentPost.imageUrl}
              alt="Post image"
              style={{
                objectFit: "cover",
                maxHeight: "600px",
                width: "fit-content",
              }}
            />
          </div>
        )}

        <CardContent
          style={{
            borderTop: "1px solid #C0C0C0",
            borderBottom: "1px solid #C0C0C0",
            paddingLeft: "1rem",
          }}
        >
          <Typography
            variant="body2"
            color="text.black"
            style={{
              fontSize: "1.4rem",
              fontWeight: "bold",
            }}
          >
            {currentPost.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            style={{
              fontSize: "1rem",
              fontWeight: "400",
            }}
          >
            {currentPost.content}
          </Typography>
        </CardContent>
        <CardActions
          disableSpacing
          style={{
            borderTop: "1px solid #C0C0C0",
            display: "flex",
            alignItems: "center",
            padding: "0 0rem",
          }}
        >
          <IconButton aria-label="add to favorites" onClick={handleLikePost}>
            <Checkbox
              icon={<FavoriteBorder />}
              checkedIcon={<Favorite sx={{ color: "red" }} />}
              checked={isLiked}
            />
          </IconButton>
          <IconButton aria-label="share">
            <Share />
          </IconButton>
          <IconButton onClick={toggleComments} aria-label="comment">
            <Badge badgeContent={currentPost.comments.length} color="primary">
              <Comment />
            </Badge>
          </IconButton>
        </CardActions>
        {currentPost.likes.length + change > 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            style={{
              paddingLeft: "1rem",
              fontSize: "1rem",
              fontWeight: "600",
              color: "#000000",
              cursor: "pointer",
            }}
            onClick={() => {
              setIsModalLikeOpen(true);
              setCurrentLikes(currentPost.likes);
            }}
          >
            {currentPost.likes.length } thích
          </Typography>
        )}
        {showComments && (
          <Comments
            comments={currentPost.comments.filter(
              (comment) => !comment.fatherId
            )}
            addReply={addReply}
            handleLike={handleLike}
            accessToken={me.accessToken}
            postId={currentPost.id}
          />
        )}
      </Card>
      {isModalLikeOpen && <LikePostModal likes={currentLikes} />}
    </>
  );
};

export default Post;
