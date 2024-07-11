import React, { useEffect, useState } from "react";
import { socket } from "../../socket";
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  makeStyles,
  CssBaseline,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@material-ui/core";
import { GroupAdd, Group, ExitToApp, Search, Refresh } from "@material-ui/icons";
import Header from "../../component/Header/Header";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createGroup,
  getGroup,
  getRecommendGroup,
  requestJoinGroup,
  leaveGroup,
  findGroup
} from "../../service/group.service";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    minHeight: "100vh",
    backgroundImage: "url(/bg1.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  nav: {
    width: "240px",
    backgroundColor: "#f5f5f5",
    padding: theme.spacing(2),
    minHeight: "100vh",
    borderRight: "1px solid #e0e0e0",
    position: "fixed",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    margin: "0 auto",
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    cursor: "pointer",
  },
  groupCard: {
    marginBottom: theme.spacing(2),
  },
  media: {
    height: 140,
  },
}));

const imageUrl =
  "https://play-lh.googleusercontent.com/uJxoDY7gP76P1vjAFfo1nGFZBYRGYtBDTxv0OrkP_4a1x7ZpO7gC5AF2xR6qj-WVefY=w240-h480-rw";

export default function GroupPage() {
  const navigate = useNavigate();
  const me = useSelector((state) => state.user);
  const classes = useStyles();
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [openCreateGroupDialog, setOpenCreateGroupDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [viewMode, setViewMode] = useState("findGroups");
  const [openLeaveDialog, setOpenLeaveDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateGroup = async () => {
    const res = await createGroup(me.accessToken, newGroupName);
    if (res?.EC === 200) {
      const newGroup = await getGroup(me.accessToken);
      setMyGroups(newGroup.data);
      setNewGroupName("");
      setOpenCreateGroupDialog(false);
      toast.success("Tạo nhóm thành công");
    } else {
      toast.error(res?.message);
    }
  };

  const handleJoinGroup = async (groupId) => {
    const res = await requestJoinGroup(me.accessToken, groupId);
    if (res?.EC === 200) {
      toast.success("Yêu cầu tham gia nhóm thành công");
      const newGroups = groups.filter((group) => {
        if (group.id == groupId){
          socket.emit("notification", `user_${group.OwnerId}`);
        }
        if (group.id !== groupId) return group;
      });
      setGroups(newGroups);
    } else {
      toast.error(res?.message);
    }
  };

  const handleLeaveGroup = async(groupId) => {
    console.log("Leaving group:", groupId);
    setMyGroups(myGroups.filter((group) => group.id !== groupId));
    setOpenLeaveDialog(false);
    const res = await leaveGroup(me.accessToken, groupId);
    if (res?.EC === 200) {
      toast.success("Rời nhóm thành công");
    } else {
      toast.error(res?.message);
    }
  };

  const handleSearch = async () => {
    console.log("Searching for:", searchQuery);
    const res = await findGroup(me.accessToken, searchQuery);
    if (res?.EC === 200) {
      setGroups(res.data);
    } else {
      toast.error(res?.message);
    }
  };

  const handleRefresh = async () => {
    setSearchQuery("");
    const fetchGroups = async () => {
      const res = await getGroup(me.accessToken);
      const resRecommend = await getRecommendGroup(me.accessToken);
      if (res?.EC === 200) {
        setMyGroups(res.data);
      }
      if (resRecommend?.EC === 200) {
        setGroups(resRecommend.data);
      }
    };
    fetchGroups();
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <>
      <Header />
      <div className={classes.root}>
        <CssBaseline />
        <div className={classes.nav}>
          <List>
            <ListItem button onClick={() => setViewMode("findGroups")}>
              <ListItemIcon>
                <Search />
              </ListItemIcon>
              <ListItemText primary="Tìm nhóm" />
            </ListItem>
            <ListItem button onClick={() => setViewMode("myGroups")}>
              <ListItemIcon>
                <Group />
              </ListItemIcon>
              <ListItemText primary="Nhóm của tôi" />
            </ListItem>
          </List>
          <Divider />
        </div>
        <Container className={classes.content}>
          {viewMode === "findGroups" && (
            <>
              <Typography variant="h4" gutterBottom>
                Quản lý nhóm
              </Typography>
              <Box mb={3} display="flex">
                <TextField
                  label="Tìm kiếm nhóm"
                  variant="outlined"
                  fullWidth
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ marginRight: "16px" }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSearch}
                  style={{ marginRight: "8px" }}
                >
                  Tìm kiếm
                </Button>
                <Button
                  variant="contained"
                  color="default"
                  startIcon={<Refresh />}
                  onClick={handleRefresh}
                >
                  Làm mới
                </Button>
              </Box>
              <Typography variant="h5" gutterBottom>
                Nhóm có thể tham gia
              </Typography>
              <Grid container spacing={3}>
                {groups?.map((group) => (
                  <Grid item xs={12} sm={6} md={4} key={group.id}>
                    <Card className={classes.groupCard}>
                      <CardMedia
                        className={classes.media}
                        image={imageUrl}
                        title={group.name}
                      />
                      <CardContent>
                        <Typography variant="h6">{group.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {group.memberCount} thành viên
                        </Typography>
                        <Box
                          display="flex"
                          gap="10px"
                          alignItems="center"
                          mt={2}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<GroupAdd />}
                            onClick={() => handleJoinGroup(group.id)}
                          >
                            Tham gia
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {viewMode === "myGroups" && (
            <>
              <Typography variant="h5" gutterBottom>
                Nhóm của tôi
              </Typography>
              <Box mb={3} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<GroupAdd />}
                  onClick={() => setOpenCreateGroupDialog(true)}
                >
                  Tạo nhóm mới
                </Button>
              </Box>
              <Grid container spacing={3}>
                {myGroups.length > 0 &&
                  myGroups.map((group) => (
                    <Grid item xs={12} sm={6} md={4} key={group.id}>
                      <Card className={classes.groupCard}>
                        <CardMedia
                          className={classes.media}
                          image={imageUrl}
                          title={group?.name}
                          style={{
                            objectFit: "cover",
                          }}
                        />
                        <CardContent>
                          <Typography variant="h6">{group?.name}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {group?.memberCount} thành viên
                          </Typography>
                          <Box
                            display="flex"
                            gap="10px"
                            alignItems="center"
                            mt={2}
                          >
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<Group />}
                              onClick={() =>
                                navigate(`/group/${group?.id}`)
                              }
                              style={{ marginRight: "8px" }}
                            >
                              Truy cập nhóm
                            </Button>
                            {me.id !== group?.OwnerId && (
                              <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<ExitToApp />}
                                onClick={() => {
                                  setSelectedGroup(group);
                                  setOpenLeaveDialog(true);
                                }}
                              >
                                Rời nhóm
                              </Button>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            </>
          )}
        </Container>

        <Dialog
          open={openCreateGroupDialog}
          onClose={() => setOpenCreateGroupDialog(false)}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Tạo nhóm mới</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Tên nhóm"
              type="text"
              fullWidth
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenCreateGroupDialog(false)}
              color="primary"
            >
              Hủy
            </Button>
            <Button onClick={handleCreateGroup} color="primary">
              Tạo
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openLeaveDialog}
          onClose={() => setOpenLeaveDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Xác nhận rời nhóm"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Bạn có chắc chắn muốn rời nhóm {selectedGroup?.name} không?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenLeaveDialog(false)} color="primary">
              Hủy
            </Button>
            <Button
              onClick={() => handleLeaveGroup(selectedGroup?.id)}
              color="secondary"
              autoFocus
            >
              Rời nhóm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
