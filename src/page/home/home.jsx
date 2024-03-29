import Nav from "../../component/Nav/Nav";
import Rightbar from "../../component/RightBar/RightBar";
import Feed from "../../component/Feed/Feed";
import Add from "../../component/Add/Add";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import { useState } from "react";
export default function Home() {
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
          bgcolor={"background.default"}
          color={"text.primary"}
        >
          <Nav setMode={setMode} mode={mode} />
          <Feed />
          <Rightbar />
          <Add />
        </Box>
      </ThemeProvider>
    </>
  );
}
