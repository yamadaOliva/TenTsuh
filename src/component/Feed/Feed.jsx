import { Box, Stack, Skeleton, Button, CircularProgress } from "@mui/material";
import { useEffect, useState, useRef, useCallback } from "react";
import Post from "./Post";
import { getPotsOfUser, getPostFollowing } from "../../service/post.service";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Feed = ({ home = false }) => {
  const me = useSelector((state) => state.user);
  const PER_PAGE = 5;
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const userId = useSelector((state) => state.user.id);

  const fetchPosts = async (page) => {
    setLoading(true);
    try {
      let res;
      if (id) {
        res = await getPotsOfUser(id, page, PER_PAGE);
        setPosts(res.data);
      } else {
        res = await getPostFollowing(me.accessToken, page, PER_PAGE);
        setPosts((prevPosts) => [...prevPosts, ...res.data]);
      }
      if (res.data.length < PER_PAGE) {
        setHasMore(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = (postId) => {
    const newPosts = posts.filter((post) => post.id !== postId);
    setPosts(newPosts);
  };

  useEffect(() => {
    console.log("fetch");
    fetchPosts(page);
  }, [page, id]);

  return (
    <Box
      flex={4}
      p={{ xs: 0, md: 2 }}
      style={{
        paddingRight: "20px",
      }}
    >
      {posts.map((post, index) => {
        if (posts.length === index + 1) {
          return (
            <Post
              key={post.id}
              post={post}
              home={home}
              deletePost={deletePost}
            />
          );
        } else {
          return (
            <Post
              key={post.id}
              post={post}
              home={home}
              deletePostEvent={deletePost}
            />
          );
        }
      })}
      {loading && (
        <Stack spacing={1}>
          <Skeleton variant="text" height={100} />
          <Skeleton variant="text" height={20} />
          <Skeleton variant="text" height={20} />
          <Skeleton variant="rectangular" height={300} />
        </Stack>
      )}
      {!loading && hasMore && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setPage((prevPage) => prevPage + 1)}
            style={{
              padding: "10px 20px",
              borderRadius: "20px",
            }}
          >
            Tải Thêm
          </Button>
        </Box>
      )}
      {loading && hasMore && (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default Feed;
