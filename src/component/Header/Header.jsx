import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Avatar from "@mui/material/Avatar";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/Slice/user-slice";
import { useNavigate } from "react-router-dom";
import { People } from "@material-ui/icons";
import { socket } from "../../socket";
import { getFriendsRequest } from "../../service/friend.service";
import { useSelector } from "react-redux";
import FriendRequestUnit from "./FriendRequestUnit";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function Header({ data }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.user.accessToken);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [friends, setFriends] = React.useState([]);
  const [friendsMenuAnchorEl, setFriendsMenuAnchorEl] = React.useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    handleClose();
  };

  const handleLogoutClick = () => {
    handleClose();
    dispatch(logout());
    const IsLogin = localStorage.getItem("IsLogin");
    if (IsLogin) {
      localStorage.setItem("Logout", true);
    }
    navigate("/login");
  };

  const fetchFriends = async () => {
    const response = await getFriendsRequest(accessToken, 1, 1000);
    setFriends(response.data);
  };

  React.useEffect(() => {
    fetchFriends();
  }, []);

  React.useEffect(() => {
    if (data?.id) {
      socket.emit("join", `user_${data?.id}`);
      socket.on("notificationFriend", () => {
        fetchFriends();
      });
    }
  }, [data]);

  const handleFriendsMenuOpen = (event) => {
    setFriendsMenuAnchorEl(event.currentTarget);
  };

  const handleFriendsMenuClose = () => {
    setFriendsMenuAnchorEl(null);
  };

  const handleAcceptFriend = (id) => {
    // Logic để chấp nhận lời mời kết bạn
  };

  const handleRejectFriend = (id) => {
    // Logic để từ chối lời mời kết bạn
  };

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar position="sticky">
      <Toolbar>
        <IconButton
          color="inherit"
          sx={{ marginRight: 2 }}
          onClick={() => {
            navigate("/home");
          }}
        >
          <Avatar src="iconHust.png"></Avatar>
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: "none", sm: "block" } }}
        >
          TenTsuh
        </Typography>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Tìm kiếm trên TenTsuh..."
            inputProps={{ "aria-label": "search" }}
          />
        </Search>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          <Typography variant="body1" sx={{ margin: 2 }}>
            Xin chào {data.name}
          </Typography>
          <IconButton
            size="large"
            aria-label="show new friend requests"
            color="inherit"
            onClick={handleFriendsMenuOpen}
          >
            <Badge badgeContent={friends.length} color="error">
              <People />
            </Badge>
          </IconButton>
          <IconButton
            size="large"
            aria-label="show 4 new mails"
            color="inherit"
          >
            <Badge badgeContent={4} color="error">
              <MailIcon />
            </Badge>
          </IconButton>
          <IconButton
            size="large"
            aria-label="show 17 new notifications"
            color="inherit"
          >
            <Badge badgeContent={17} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Box>

        {data && (
          <>
            <IconButton
              color="inherit"
              onClick={handleMenuClick}
              sx={{ marginRight: 2 }}
            >
              <Avatar alt="User Avatar" src={data.avatarUrl} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfileClick}>
                Thông tin cá nhân
              </MenuItem>
              <MenuItem onClick={handleLogoutClick}>Đăng xuất</MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
      {renderMobileMenu}
      <Menu
        anchorEl={friendsMenuAnchorEl}
        open={Boolean(friendsMenuAnchorEl)}
        onClose={handleFriendsMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        style={{ marginTop: 30 }}
      >
        {friends.length > 0 ? (
          friends.map((friend) => (
            <Box key={friend.id}>
              <FriendRequestUnit
                friend={friend}
                onAccept={handleAcceptFriend}
                onReject={handleRejectFriend}
              />
            </Box>
          ))
        ) : (
          <MenuItem>Không có lời mời kết bạn nào</MenuItem>
        )}
      </Menu>
    </AppBar>
  );
}

Header.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string,
    name: PropTypes.string.isRequired,
  }).isRequired,
};
