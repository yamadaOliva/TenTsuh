import Nav from "../../component/Nav/Nav";
import RightbarV2 from "../../component/RightBar/RightBarV2";
import Feed from "../../component/Feed/Feed";
import Add from "../../component/Add/Add";
import { Box } from "@mui/material";
import Header from "../../component/Header/Header";
export default function ProfileApp() {
  return (
    <>
      <Header />
      <Box
        sx={{ display: "flex" }}
        bgcolor={"#f0f0f1"}
        color={"text.primary"}
        minHeight={"93.2vh"}
      >
        <Nav />
        <Feed />
        <Add />
        <div
          style={{
            display: "flex",
          }}
        >
          <RightbarV2 profile />
        </div>
      </Box>
    </>
  );
}
