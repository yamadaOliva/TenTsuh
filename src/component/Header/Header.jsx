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
import NotificationUnit from "./NotificationUnit";
import { logout } from "../../redux/Slice/user-slice";
import { useNavigate } from "react-router-dom";
import { People } from "@material-ui/icons";
import { socket } from "../../socket";
import { getFriendsRequest } from "../../service/friend.service";
import { useSelector, useDispatch } from "react-redux";
import { logoutBE } from "../../service/auth.service";
import { getUnseenChat } from "../../service/chat.service";
import {
  acceptFriendRequest,
  rejectFriendRequest,
} from "../../service/friend.service";
import {
  getNotifications,
  readNotification,
  deleteNotification,
} from "../../service/notification.service";
import FriendRequestUnit from "./FriendRequestUnit";
import { toast } from "react-toastify";

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
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const me = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [friends, setFriends] = React.useState([]);
  const [friendsMenuAnchorEl, setFriendsMenuAnchorEl] = React.useState(null);
  const [notificationsMenuAnchorEl, setNotificationsMenuAnchorEl] =
    React.useState(null);
  const [notifications, setNotifications] = React.useState([]);
  const [unseenChat, setUnseenChat] = React.useState([]);
  const handleDeleteNotification = async (id) => {
    const res = await deleteNotification(me.accessToken, id);
    if (+res.EC === 200) {
      toast.success("Đã xóa thông báo");
      const newNotifications = notifications.filter((item) => item.id !== id);
      setNotifications(newNotifications);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    handleClose();
  };

  const handleChangePassword = () => {
    navigate("/change-password");
    handleClose();
  };

  const handleLogoutClick = async () => {
    handleClose();
    dispatch(logout());
    await logoutBE(me.accessToken);
    const IsLogin = localStorage.getItem("IsLogin");
    if (IsLogin) {
      localStorage.setItem("Logout", true);
    }
    navigate("/login");
  };

  const fetchFriends = async () => {
    const response = await getFriendsRequest(me.accessToken, 1, 1000);
    if (+response.EC === 200) {
      setFriends(response.data);
    }
  };

  const fetchNotifications = async () => {
    const response = await getNotifications(me.accessToken, 1, 1000);
    if (+response.EC === 200) {
      setNotifications(response.data);
    }
  };

  const fetchUnseenChat = async () => {
    const response = await getUnseenChat(me.accessToken);
    if (+response.EC === 200) {
      setUnseenChat(response.data);
    }
  };
  React.useEffect(() => {
    fetchFriends();
    fetchNotifications();
    fetchUnseenChat();
  }, []);

  React.useEffect(() => {
    if (me?.id) {
      socket.emit("join", `user_${me?.id}`);
      socket.on("notificationFriend", async (data) => {
        console.log("lelelelelle", data);
        if (data?.type == "accept") {
          await fetchNotifications();
        }
        await fetchFriends();
      });
      socket.on("notification", async (data) => {
        console.log("notification", data);
        await fetchNotifications();
      });
    }
  }, []);

  const handleFriendsMenuOpen = (event) => {
    setFriendsMenuAnchorEl(event?.currentTarget);
  };

  const handleFriendsMenuClose = () => {
    setFriendsMenuAnchorEl(null);
  };

  const handleNotificationsMenuOpen = async (event) => {
    setNotificationsMenuAnchorEl(event?.currentTarget);
    setNotifications(
      notifications.map((item) => {
        return { ...item, status: "READ" };
      })
    );
    await readNotification(me.accessToken);
  };

  const handleNotificationsMenuClose = () => {
    setNotificationsMenuAnchorEl(null);
  };

  const handleAcceptFriend = async (id, friendId) => {
    const res = await acceptFriendRequest(me.accessToken, id);
    if (+res.EC === 200) {
      toast.success("Đã chấp nhận lời mời kết bạn");
      await socket.emit("addFriend", { friendId: friendId, type: "accept" });
      await socket.emit("addFriend", { friendId: me.id, type: "accept" });
      const newFriends = friends.filter((item) => item.id !== id);
      console.log(newFriends);
      setFriends(newFriends);
    }
  };

  const handleRejectFriend = async (id) => {
    const res = await rejectFriendRequest(me.accessToken, id);
    if (+res.EC === 200) {
      toast.success("Đã từ chối lời mời kết bạn");
      await socket.emit("addFriend", { friendId: me.id, type: "reject" });
      const newFriends = friends.filter((item) => item.id !== id);
      setFriends(newFriends);
    }
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
        Profile
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
          <Avatar src="/iconHust.png" />
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
            Xin chào {me.name}
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
            onClick={() => {
              navigate("/message");
            }}
          >
            <Badge badgeContent={unseenChat.length} color="error">
              <MailIcon />
            </Badge>
          </IconButton>
          <IconButton
            size="large"
            aria-label="show new notifications"
            color="inherit"
            onClick={handleNotificationsMenuOpen}
          >
            <Badge
              badgeContent={
                notifications.filter((item) => item.status == "UNREAD").length
              }
              color="error"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Box>

        {me && (
          <>
            <IconButton
              color="inherit"
              onClick={handleMenuClick}
              sx={{ marginRight: 2 }}
            >
              <Avatar alt="User Avatar" src={me.avatarUrl} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfileClick}>
                Thông tin cá nhân
              </MenuItem>
              <MenuItem onClick={handleChangePassword}>Đổi mật khẩu</MenuItem>
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
      <Menu
        anchorEl={notificationsMenuAnchorEl}
        open={Boolean(notificationsMenuAnchorEl)}
        onClose={handleNotificationsMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        style={{ marginTop: 30, maxHeight: "500px" }}
      >
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Box key={notification.id}>
              <NotificationUnit
                data={notification}
                handleDeleteNotification={handleDeleteNotification}
              />
            </Box>
          ))
        ) : (
          <MenuItem>Không có thông báo nào</MenuItem>
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
