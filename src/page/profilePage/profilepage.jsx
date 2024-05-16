import Nav from "../../component/Nav/Nav";
import RightbarV2 from "../../component/RightBar/RightBarV2";
import Feed from "../../component/Feed/Feed";
import Add from "../../component/Add/Add";
import "./profilepage.scss";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import { useState } from "react";
export default function ProfileApp() {
  const [mode, setMode] = useState("light");
  const darkTheme = createTheme({
    palette: {
      mode: mode,
    },
  });
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Box
          sx={{ display: "flex" }}
          bgcolor={"#f0f0f1"}
          color={"text.primary"}
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
      </ThemeProvider>
    </>
  );
}
