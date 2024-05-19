import { Box, Stack, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import Post from "./Post";
import { getPotsOfUser } from "../../service/post.service";
import { useSelector } from "react-redux";
const Feed = () => {
  const PER_PAGE = 5;

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const accessToken = useSelector((state) => state.user.accessToken);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getPotsOfUser(accessToken);
        console.log(res.data);
        setPosts(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, []);
  setTimeout(() => {
    setLoading(false);
  }, [3000]);

  return (
    <Box
      flex={4}
      p={{ xs: 0, md: 2 }}
      style={{
        paddingRigth: "20px",
      }}
    >
      {loading ? (
        <Stack spacing={1}>
          <Skeleton variant="text" height={100} />
          <Skeleton variant="text" height={20} />
          <Skeleton variant="text" height={20} />
          <Skeleton variant="rectangular" height={300} />
        </Stack>
      ) : (
        <>
          {posts?.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </>
      )}
    </Box>
  );
};

export default Feed;
