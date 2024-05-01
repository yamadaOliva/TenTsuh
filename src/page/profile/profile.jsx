import Upload from "../../component/Upload/UploadImage";
import { getProfile } from "../../service/user.service";
import { useState, useRef , useEffect } from "react";
import { useSelector } from "react-redux";
import "./profile.scss";
import { Grid, Paper } from "@mui/material";
export default function Profile() {
  const user = useSelector((state) => state.user);
  const [image, setImage] = useState(
    "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
  );
  useEffect(() => {
    const getData = async () => {
      const res = await getProfile(user.accessToken);
      console.log(res.data);
      setImage(res.data.avatarUrl);
    }
    getData();
  }
  ,[]);
  return (
    <section className="profile">
      <Grid>
          <Paper
            elevation={3}
            style={{ padding: "20px", margin: "20px auto", width: "50%" }}
          ></Paper>
      </Grid>
    </section>
  );
}
