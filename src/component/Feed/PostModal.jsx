import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { openPost, closePost } from "../../redux/Slice/chat-slice";
import { getPostById } from "../../service/post.service";
import Post from "./Post";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function PostModal({ id }) {
  const dispatch = useDispatch();
  const me = useSelector((state) => state.user);
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const result = await getPostById(me.accessToken, id);
      if (result?.EC === 200) {
        setPost(result.data);
      }
    };
    fetchPost();
  }, [id]);

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            borderRadius: "10px",
            maxHeight: "90%",
            display: "flex",
            flexDirection: "row",
            autoFocus: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <IconButton
            onClick={() => {
              dispatch(closePost());
            }}
            style={{
              backgroundColor: "white",
              borderRadius: "50%",
              zIndex: 1000,
              height: "40px",
              width: "40px",
              top: "30px",
              left: "80px",
            }}
          >
            <CloseIcon />
          </IconButton>
          {post && <Post post={post} type="mini"/>}
        </div>
      </div>
    </>
  );
}
