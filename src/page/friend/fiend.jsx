import { useEffect, useState } from "react";
import { Home, Group, Message, Person } from "@material-ui/icons";
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  makeStyles,
  CssBaseline,
  TextField,
} from "@material-ui/core";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  getFriendsRequest,
  getCountryman,
  searchFriendRequest,
  filterFriendRequest,
} from "../../service/friend.service";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    maxWidth: "1400px", // Set maxWidth to control the width of the content area
    margin: "0 auto", // Center the content
  },
  nav: {
    width: "auto",
    flexShrink: 0,
    backgroundColor: "#f5f5f5",
    padding: theme.spacing(2),
    minHeight: "93.2vh",
    borderRight: "1px solid #e0e0e0",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    margin: "0 auto", // Center the content
    backgroundColor: "#f5f5f5",
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    cursor: "pointer", // Add cursor pointer on hover
  },
  friendCard: {
    marginBottom: theme.spacing(2),
  },
  listItem: {
    borderRadius: theme.shape.borderRadius,
    "&:hover": {
      backgroundColor: "#e0e0e0",
    },
  },
  selectedListItem: {
    backgroundColor: "#e0e0e0",
  },
}));

const friends = [
  { name: "Alice", avatar: "https://via.placeholder.com/150" },
  { name: "Bob", avatar: "https://via.placeholder.com/150" },
  { name: "Charlie", avatar: "https://via.placeholder.com/150" },
  // Thêm nhiều bạn bè hơn ở đây
];

export default function Friend() {
  const accessToken = useSelector((state) => state.user.accessToken);
  const navigate = useNavigate();
  const [friendList, setFriendList] = useState(friends); // Replace 'friends' with the actual data from the API
  const [selectedIndex, setSelectedIndex] = useState(1);
  const PER_PAGE = 12;
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [filter, setFilter] = useState("sameClass"); // Add filter state
  const classes = useStyles();

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };

  const handleSearchTypeChange = (event, newSearchType) => {
    if (newSearchType !== null) {
      setSearchType(newSearchType);
    }
  };

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const handleSearch = async () => {
    const res = await searchFriendRequest(accessToken, searchQuery, searchType);
    console.log(res.data);
    if (res?.EC === 200) {
      setFriendList(res.data);
    }
  };

  useEffect(() => {
    const fetchFriendsRequest = async () => {
      const res = await getFriendsRequest(accessToken, page, PER_PAGE);
      console.log(res.data);
      if (res?.EC === 200) {
        setFriendList(res.data);
      }
    };
    fetchFriendsRequest();
  }, []);

  useEffect(() => {
    const fetchCountryman = async () => {
      switch (selectedIndex) {
        case 1:
          setPage(1);
          const res = await getFriendsRequest(accessToken, 1, PER_PAGE);
          if (res?.EC === 200) {
            setFriendList(res.data);
          }
          break;
        case 2:
          setPage(1);
          setFriendList([]);
          break;
        case 3:
          setPage(1);
          const res3 = await getCountryman(accessToken, 1, PER_PAGE);
          console.log(res3);
          if (res3?.EC === 200) {
            setFriendList(res3.data);
          }
          break;
        case 4:
          setPage(1);
          const res4 = await filterFriendRequest(
            accessToken,
            1,
            PER_PAGE,
            filter
          );
          if (res4?.EC === 200) {
            setFriendList(res4.data);
          }
          break;
        default:
          break;
      }
    };
    fetchCountryman();
  }, [selectedIndex]);

  useEffect(() => {
    const fetchFilteredFriends = async () => {
      const res = await filterFriendRequest(
        accessToken,
        page,
        PER_PAGE,
        filter
      );
      console.log(res.data);
      if (res?.EC === 200) {
        setFriendList(res.data);
      }
    };
    if(selectedIndex == 4) fetchFilteredFriends();
  }, [filter]);

  return (
    <div
      style={{
        backgroundImage: `url("https://dlcorp.com.vn/wp-content/uploads/2021/09/Ba%CC%81ch-Khoa-600x301.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className={classes.root}>
        <CssBaseline />
        <Box className={classes.nav}>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton
                className={`${classes.listItem} ${
                  selectedIndex === 1 ? classes.selectedListItem : ""
                }`}
                selected={selectedIndex === 1}
                onClick={() => handleListItemClick(1)}
              >
                <ListItemIcon>
                  <Group />
                </ListItemIcon>
                <ListItemText primary="Lời mời kết bạn" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                className={`${classes.listItem} ${
                  selectedIndex === 2 ? classes.selectedListItem : ""
                }`}
                selected={selectedIndex === 2}
                onClick={() => handleListItemClick(2)}
              >
                <ListItemIcon>
                  <Group />
                </ListItemIcon>
                <ListItemText primary="Tìm kiếm bạn bè" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                className={`${classes.listItem} ${
                  selectedIndex === 3 ? classes.selectedListItem : ""
                }`}
                selected={selectedIndex === 3}
                onClick={() => handleListItemClick(3)}
              >
                <ListItemIcon>
                  <Group />
                </ListItemIcon>
                <ListItemText primary="Bạn đồng hương" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                className={`${classes.listItem} ${
                  selectedIndex === 4 ? classes.selectedListItem : ""
                }`}
                selected={selectedIndex === 4}
                onClick={() => handleListItemClick(4)}
              >
                <ListItemIcon>
                  <Group />
                </ListItemIcon>
                <ListItemText primary="Bạn cùng khoa, cùng khóa" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
        <Container className={classes.content}>
          {selectedIndex === 2 && (
            <Box
              mb={2}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              flexDirection={{ xs: "column", sm: "column" }}
              borderBottom="1px solid #e0e0e0"
            >
              <ToggleButtonGroup
                value={searchType}
                exclusive
                onChange={handleSearchTypeChange}
                aria-label="search type"
              >
                <ToggleButton value="name" aria-label="search by name">
                  Tìm theo tên
                </ToggleButton>
                <ToggleButton
                  value="studentId"
                  aria-label="search by student ID"
                >
                  Tìm theo mã số sinh viên
                </ToggleButton>
              </ToggleButtonGroup>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                flexDirection={{ xs: "column", sm: "row" }}
                width={{ xs: "80%", sm: "80%" }}
              >
                <TextField
                  label="Tìm kiếm"
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  fullWidth
                  style={{ marginRight: "16px" }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSearch}
                  style={{ height: "100%" }}
                >
                  Tìm kiếm
                </Button>
              </Box>
            </Box>
          )}
          {selectedIndex === 4 && (
            <>
              <Box
                mb={2}
                display="flex"
                flexDirection={{ xs: "column", sm: "column" }}
                borderBottom="1px solid #e0e0e0"
              >
                {/* 3 options */}
                <ToggleButtonGroup
                  value={filter}
                  exclusive
                  onChange={handleFilterChange}
                  aria-label="filter"
                >
                  <ToggleButton value="sameClass" aria-label="same class">
                    Cùng lớp
                  </ToggleButton>
                  <ToggleButton value="sameMajor" aria-label="same faculty">
                    Cùng khoa
                  </ToggleButton>
                  <ToggleButton value="sameSchoolYear" aria-label="same year">
                    Cùng khóa
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </>
          )}
          <Grid container spacing={3}>
            {friendList.map((friend, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  className={classes.friendCard}
                  
                >
                  <CardContent>
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Avatar
                        alt={
                          selectedIndex == 1 ? friend.user?.name : friend?.name
                        }
                        src={
                          selectedIndex == 1
                            ? friend.user?.avatarUrl
                            : friend?.avatarUrl
                        }
                        className={classes.avatar}
                        onClick={() => {
                          if (selectedIndex == 1) {
                            navigate(`/profilepage/${friend.user?.id}`);
                          } else {
                            navigate(`/profilepage/${friend.id}`);
                          }
                        }}
                      />
                      <Typography variant="h6">
                        {selectedIndex == 1 ? friend.user?.name : friend?.name}
                      </Typography>
                    </Box>

                    <Box
                      mt={1}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                      }}
                    >
                      <Typography variant="12px">
                        MSSV:{" "}
                        {selectedIndex == 1
                          ? friend?.user?.studentId
                          : friend?.studentId}{" "}
                      </Typography>
                      <Typography variant="12px">
                        Lớp:{" "}
                        {selectedIndex == 1
                          ? friend?.user?.class
                          : friend?.class}
                      </Typography>
                      <Typography variant="12px">
                        Đến từ:{" "}
                        {friend?.user?.city && selectedIndex == 1
                          ? friend.user.city
                          : friend.city}
                      </Typography>
                    </Box>

                    {selectedIndex != 1 ? (
                      <Box display="flex" justifyContent="center" mt={2}
                      
                      >
                        <Button variant="contained" color="primary">
                          Thêm bạn
                        </Button>
                      </Box>
                    ) : (
                      <>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          mt={2}
                        >
                          <Button variant="contained" color="primary">
                            Chấp nhận
                          </Button>
                          <Button variant="contained" color="secondary">
                            Từ chối
                          </Button>
                        </Box>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>
    </div>
  );
}