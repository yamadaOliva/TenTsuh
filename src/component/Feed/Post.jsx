import { useEffect, useState } from "react";
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
} from "@mui/material";
import { useSelector } from "react-redux";
import { likePost, unlikePost } from "../../service/post.service";
import { date } from "../../utils/index";

const CommentItem = ({ comment, addReply, handleLike }) => {
  const [replyText, setReplyText] = useState("");
  const [showReply, setShowReply] = useState(false);

  const handleReplyChange = (event) => {
    setReplyText(event.target.value);
  };

  const submitReply = () => {
    addReply(comment.id, replyText);
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
        <ListItemText primary={comment.text} secondary={comment.user.name} />
        <IconButton
          aria-label="like comment"
          onClick={() => handleLike(comment.id)}
        >
          <Checkbox
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite sx={{ color: "red" }} />}
            checked={comment.liked}
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
            placeholder="Reply to comment..."
            variant="outlined"
          />
          <Button onClick={submitReply} color="primary">
            Phản hồi
          </Button>
        </div>
      </Collapse>
      {comment.replies &&
        comment.replies.map((reply, index) => (
          <ListItem key={index} style={{ paddingLeft: "4rem" }}>
            <ListItemAvatar>
              <Avatar src={reply.user.avatarUrl} />
            </ListItemAvatar>
            <ListItemText primary={reply.text} secondary={reply.user.name} />
            <IconButton
              aria-label="like reply"
              onClick={() => handleLike(reply.id)}
            >
              <Checkbox
                icon={<FavoriteBorder />}
                checkedIcon={<Favorite sx={{ color: "red" }} />}
                checked={reply.liked}
              />
            </IconButton>
          </ListItem>
        ))}
    </>
  );
};

const Comments = ({ comments, addReply, handleLike }) => {
  const [newComment, setNewComment] = useState("");

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const submitComment = () => {
    if (!newComment.trim()) return;
    addReply(null, newComment);
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
        }}
      >
        {comments.length} bình luận
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
        placeholder="Add a comment..."
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

const Post = ({ post }) => {
  const me = useSelector((state) => state.user);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [change, setChange] = useState(0);
  const [comments, setComments] = useState([
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
  ]);

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

  const handleLikePost = async () => {
    console.log(post.id);
    if (isLiked) {
      await unlikePost(post.id, me.accessToken);
      setIsLiked(false);
      setChange(change - 1);
    } else {
      await likePost(post.id, me.accessToken);
      setIsLiked(true);
      setChange(change + 1);
    }
  };

  useEffect(() => {
    post.likes.forEach((like) => {
      if (like.user.id === me.id) {
        setIsLiked(true);
      }
    });
  }, []);
  return (
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
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            aria-label="recipe"
            src={post.user.avatarUrl}
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
        subheader={date.convertDateToTime(post.createdAt)}
        style={{
          borderBottom: "1px solid #C0C0C0",
        }}
      />

      {post.imageUrl && (
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
            image={post.imageUrl}
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
          {post.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          style={{
            fontSize: "1rem",
            fontWeight: "400",
          }}
        >
          {post.content}
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
          <Comment />
        </IconButton>
      </CardActions>
      {post.likes.length + change > 0 && (
        <Typography
          variant="body2"
          color="text.secondary"
          style={{
            paddingLeft: "1rem",
            fontSize: "1rem",
            fontWeight: "600",
            color: "#000000",
          }}
        >
          {post.likes.length + change} thích
        </Typography>
      )}
      {showComments && (
        <Comments
          comments={comments}
          addReply={addReply}
          handleLike={handleLike}
        />
      )}
    </Card>
  );
};

export default Post;
