import { Favorite, FavoriteBorder, MoreVert, Share } from "@mui/icons-material";
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
} from "@mui/material";
import {date} from "../../utils/index";
const Post = ({ post }) => {
  return (
    <Card
      sx={{ margin: 5 }}
      style={{
        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
        transition: "0.3s",
        borderRadius: "10px",
        maxWidth: "800px",
        marginLeft: "12%",
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
        subheader="September 14, 2022"
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
            alt="Paella dish"
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
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <Checkbox
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite sx={{ color: "red" }} />}
          />
        </IconButton>
        <IconButton aria-label="share">
          <Share />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default Post;
