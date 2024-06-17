import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Button,
  TextField,
  Grid,
  Paper,
  Pagination,
  IconButton,
  styled,
  Divider,
  Tabs,
  Tab,
  Select,
  MenuItem,
  Modal,
} from "@mui/material";
import { Search, Delete, Block, Visibility } from "@mui/icons-material";
import Header from "../../component/Header/Header";
import {
  getListUser,
  banUser,
  unbanUser,
  searchUser,
} from "../../service/user.service";
import {
  deletePostByAdmin,
  deleteCommentByAdmin,
} from "../../service/post.service";
import { getReports, deleteReport } from "../../service/report.service";
import { useSelector, useDispatch } from "react-redux";
import { openPost } from "../../redux/Slice/chat-slice";
import { toast } from "react-toastify";
import { socket } from "../../socket";

const CustomCard = styled(Paper)({
  padding: 16,
  marginBottom: 16,
  borderRadius: 8,
});

const BackgroundContainer = styled(Box)({
  backgroundImage:
    "url('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgcHHLKKkH5gRDNQxlpf45CvHCSoLhYlb_sbFh3hdch98xJYB31XPYPENjlL4GMk-1pacMMsGtAFV2dLm9ePPpBlGTjKQhx1eTqjBZpKMGn2oTf9ZThg-4iAN1SeWaCllDZRKxxtYFF7X4/w1200-h630-p-k-no-nu/trandainghiadhbkhn.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  minHeight: "100vh",
  width: "100%",
  padding: "20px",
  display: "flex",
  justifyContent: "center",
});

const ContentContainer = styled(Container)({
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  borderRadius: 8,
  padding: 20,
  width: "100%",
  maxWidth: "1200px",
});

const ModalBox = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  textAlign: "center",
  backgroundColor: "#fff",
  padding: 20,
});

const AdminScreen = () => {
  const dispatch = useDispatch();
  const me = useSelector((state) => state.user);
  const [students, setStudents] = useState([]);
  const [reports, setReports] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentReportPage, setCurrentReportPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("name");
  const [currentTab, setCurrentTab] = useState(0);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [total, setTotal] = useState(0);
  const [totalReports, setTotalReports] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (searchField === "all" || searchQuery.trim() === "") {
      fetchUsers(1);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    setCurrentPage(1);
    try {
      const res = await searchUser(
        me.accessToken,
        searchQuery,
        searchField,
        1,
        studentsPerPage
      );
      if (res.EC !== 200) {
        toast.error("Không thể tìm kiếm user");
        return;
      }
      setStudents(res.data.data);
      setTotal(res.data.total);
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tìm kiếm");
    }
  };

  const handleBanUser = async (studentId) => {
    const res = await banUser(me.accessToken, studentId);
    if (res.EC !== 200) {
      toast.error("Không thể ban user");
      return;
    }
    toast.success("Ban user thành công");
    socket.emit("banUser", `user_${studentId}`);
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId
          ? { ...student, statusAccount: "BLOCKED" }
          : student
      )
    );
  };

  const handleUnbanUser = async (studentId) => {
    const res = await unbanUser(me.accessToken, studentId);
    if (res.EC !== 200) {
      toast.error("Không thể unban user");
      return;
    }
    toast.success("Unban user thành công");
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId
          ? { ...student, statusAccount: "ACTIVE" }
          : student
      )
    );
  };

  const handleDeletePost = async () => {
    if (selectedReport.type === "POST") {
      const res = await deletePostByAdmin(
        me.accessToken,
        selectedReport.postId
      );
      if (res.EC !== 200) {
        toast.error("Không thể xóa bài viết");
        return;
      }
      toast.success("Xóa bài viết thành công");
      setOpenDeleteModal(false);
      setReports((prevReports) =>
        prevReports.filter((report) => report.id !== selectedReport.id)
      );
    } else {
      const res = await deleteCommentByAdmin(
        me.accessToken,
        selectedReport.comment.id
      );
      if (res.EC !== 200) {
        toast.error("Không thể xóa bình luận");
        return;
      }
      toast.success("Xóa bình luận thành công");
      await deleteReport(me.accessToken, selectedReport.id);
      setOpenDeleteModal(false);
      setReports((prevReports) =>
        prevReports.filter((report) => report.id !== selectedReport.id)
      );
    }
    socket.emit("notification", `user_${selectedReport.userReported.id}`);
  };

  const handleBanAccount = (reportId) => {
    console.log(`Banned account with Report ID: ${reportId}`);
  };

  const handleViewPost = (postId) => {
    dispatch(openPost(postId));
  };

  const handleIgnoreReport = async (reportId) => {
    const res = await deleteReport(me.accessToken, reportId);
    if (res.EC !== 200) {
      toast.error("Không thể bỏ qua báo cáo");
      return;
    }
    toast.success("Bỏ qua báo cáo thành công");
    setReports((prevReports) =>
      prevReports.filter((report) => report.id !== reportId)
    );
  };

  const studentsPerPage = 10;
  const reportsPerPage = 10;
  const totalStudentPages = Math.ceil(total / studentsPerPage);
  const totalReportPages = Math.ceil(totalReports / reportsPerPage);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const fetchUsers = async (page) => {
    try {
      if (isSearching && searchField !== "all") {
        const res = await searchUser(
          me.accessToken,
          searchQuery,
          searchField,
          page,
          studentsPerPage
        );
        setStudents(res.data.data);
        setTotal(res.data.total);
      } else {
        const res = await getListUser(me.accessToken, page, studentsPerPage);
        setStudents(res.data.data);
        setTotal(res.data.total);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchReports = async (page) => {
    try {
      const res = await getReports(me.accessToken, page, reportsPerPage);
      setReports(res.data.reports);
      console.log(res.data.reports);
      setTotalReports(res.data.total);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchReports(currentReportPage);
  }, [currentReportPage]);

  return (
    <>
      <Header />
      <BackgroundContainer>
        <ContentContainer>
          <Typography variant="h4" gutterBottom>
            Admin Dashboard
          </Typography>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Danh sách sinh viên" />
            <Tab label="Danh sách báo cáo" />
          </Tabs>
          <Divider style={{ marginBottom: 20 }} />

          {currentTab === 0 && (
            <Box mb={4}>
              <Typography variant="h5" gutterBottom>
                Danh sách sinh viên
              </Typography>
              <Box mb={2} display="flex" gap={2}>
                <TextField
                  variant="outlined"
                  label="Tìm kiếm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ flex: 1 }}
                />
                <Select
                  variant="outlined"
                  label="Lĩnh vực"
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                  style={{ width: 150 }}
                >
                  <MenuItem value="name">Tên</MenuItem>
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="studentId">Mã SV</MenuItem>
                </Select>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Search />}
                  onClick={handleSearch}
                >
                  Tìm kiếm
                </Button>
              </Box>
              {students &&
                students.map((student) => (
                  <CustomCard key={student.id}>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item>
                        <Avatar src={student.avatarUrl} />
                      </Grid>
                      <Grid item xs>
                        <Typography variant="body1">{student.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {student.class}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {student.studentId}
                        </Typography>
                      </Grid>
                      <Grid item>
                        {student?.statusAccount === "BLOCKED" ? (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleUnbanUser(student.id)}
                          >
                            Unban
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<Block />}
                            onClick={() => handleBanUser(student.id)}
                          >
                            Ban
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </CustomCard>
                ))}
              <Pagination
                count={totalStudentPages}
                page={currentPage}
                onChange={(e, value) => setCurrentPage(value)}
                color="primary"
              />
            </Box>
          )}

          {currentTab === 1 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Danh sách báo cáo
              </Typography>
              {reports &&
                reports.map((report) => (
                  <CustomCard key={report.id}>
                    <Typography variant="body1">
                      Loại báo cáo: {report.type}
                    </Typography>
                    <Typography variant="body1">
                      Người báo cáo: {report.user.name}
                    </Typography>
                    <Typography variant="body1">
                      Người bị báo cáo: {report.userReported.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Nội dung báo cáo: {report.content}
                    </Typography>
                    {report.type === "COMMENT" && (
                      <Typography variant="body2" color="red">
                        Bình luận: {report?.comment.content}
                      </Typography>
                    )}
                    <Box display="flex" gap={2} mt={2}>
                      {report.type == "POST" && (
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<Visibility />}
                          onClick={() => handleViewPost(report.postId)}
                        >
                          Xem bài viết
                        </Button>
                      )}

                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<Delete />}
                        onClick={() => {
                          setSelectedReport(report);
                          setOpenDeleteModal(true);
                        }}
                      >
                        Xóa {report.type === "POST" ? "bài viết" : "bình luận"}
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<Block />}
                        onClick={() => handleBanAccount(report)}
                      >
                        Ban Tài Khoản
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => handleIgnoreReport(report.id)}
                      >
                        Bỏ qua
                      </Button>
                    </Box>
                  </CustomCard>
                ))}
              <Pagination
                count={totalReportPages}
                page={currentReportPage}
                onChange={(e, value) => setCurrentReportPage(value)}
                color="primary"
              />
            </Box>
          )}

          <Modal
            open={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <ModalBox>
              <Typography variant="h6" color="gray" textAlign="center">
                Xác nhận xóa bài viết
              </Typography>
              <Typography variant="body1" mt={2} mb={2}>
                Bạn có chắc chắn muốn xóa bài viết này không?
              </Typography>
              <Box display="flex" justifyContent="space-around">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenDeleteModal(false)}
                >
                  Hủy
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleDeletePost}
                >
                  Xóa
                </Button>
              </Box>
            </ModalBox>
          </Modal>
        </ContentContainer>
      </BackgroundContainer>
    </>
  );
};

export default AdminScreen;
