import {
  AccountBox,
  Article,
  Group,
  Home,
  ModeNight,
  Person,
  Message,
} from "@mui/icons-material";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
const Nav = ({ mode, setMode }) => {
  const navigate = useNavigate();
  return (
    <Box flex={1} p={2} sx={{ display: { xs: "none", sm: "block" } }}>
      <Box position="fixed">
        <List>
          <ListItem disablePadding>
            <ListItemButton component="a" href="#home">
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Homepage" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component="a"
              onClick={() => {
                navigate("/message");
              }}
            >
              <ListItemIcon>
                <Article />
              </ListItemIcon>
              <ListItemText primary="Pages" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component="a" >
              <ListItemIcon>
                <Group />
              </ListItemIcon>
              <ListItemText primary="Hội nhóm" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component="a"
              
              onClick={() => {
                navigate("/message");
              }}
            >
              <ListItemIcon>
                <Message />
              </ListItemIcon>
              <ListItemText primary="Tin nhắn" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component="a" >
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText primary="Bạn bè" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component="a" >
              <ListItemIcon>
                <AccountBox />
              </ListItemIcon>
              <ListItemText primary="Tường nhà" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component="a" >
              <ListItemIcon>
                <ModeNight />
              </ListItemIcon>
              <Switch
                onChange={() => setMode(mode === "light" ? "dark" : "light")}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

Nav.propTypes = {
  mode: PropTypes.string,
  setMode: PropTypes.func,
};
export default Nav;
