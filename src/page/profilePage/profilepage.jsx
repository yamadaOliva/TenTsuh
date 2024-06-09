import Nav from "../../component/Nav/Nav";
import RightbarV2 from "../../component/RightBar/RightBarV2";
import Feed from "../../component/Feed/Feed";
import Add from "../../component/Add/Add";
import { Box } from "@mui/material";
import Header from "../../component/Header/Header";
import { useState } from "react";
import { createTheme } from "@mui/material/styles";
export default function ProfileApp() {
  const [mode, setMode] = useState("light");
  const darkTheme = createTheme({
    palette: {
      mode: mode,
    },
  });
  return (
    <>
      <Header />
      <Box
        sx={{ display: "flex" }}
        bgcolor={"#f0f0f1"}
        color={"text.primary"}
        minHeight={"93.2vh"}
      >
        <Nav setMode={setMode} mode={mode} />
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
