import React, { useState } from "react";
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

const fakeStudents = Array.from({ length: 50 }, (v, i) => ({
  id: i + 1,
  avatarUrl: "https://via.placeholder.com/150",
  name: `Student ${i + 1}`,
  class: `Class ${Math.floor(i / 10) + 1}`,
  studentId: `ID${i + 1}`,
  isBanned: false, 
}));

const fakeReports = Array.from({ length: 30 }, (v, i) => ({
  id: i + 1,
  reporterName: `Reporter ${i + 1}`,
  reportedName: `Reported ${i + 1}`,
  postId: i + 1,
  content: `Report content for post ${i + 1}`,
}));

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
  const [students, setStudents] = useState(fakeStudents);
  const [reports, setReports] = useState(fakeReports);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentReportPage, setCurrentReportPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("name");
  const [currentTab, setCurrentTab] = useState(0);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const handleSearch = () => {
    const filteredStudents = fakeStudents.filter((student) =>
      student[searchField].toLowerCase().includes(searchQuery.toLowerCase())
    );
    setStudents(filteredStudents);
  };

  const handleBanUser = (studentId) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId ? { ...student, isBanned: true } : student
      )
    );
    console.log(`Banned user with ID: ${studentId}`);
  };

  const handleUnbanUser = (studentId) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId ? { ...student, isBanned: false } : student
      )
    );
    console.log(`Unbanned user with ID: ${studentId}`);
  };

  const handleDeletePost = () => {
    console.log(`Deleted post with Report ID: ${selectedReport}`);
    setReports((prevReports) =>
      prevReports.filter((report) => report.id !== selectedReport)
    );
    setOpenDeleteModal(false);
  };

  const handleBanAccount = (reportId) => {
    console.log(`Banned account with Report ID: ${reportId}`);
  };

  const handleViewPost = (postId) => {
    console.log(`Viewing post with ID: ${postId}`);
  };

  const handleIgnoreReport = (reportId) => {
    setReports((prevReports) =>
      prevReports.filter((report) => report.id !== reportId)
    );
    console.log(`Ignored report with ID: ${reportId}`);
  };

  const studentsPerPage = 10;
  const reportsPerPage = 10;
  const totalStudentPages = Math.ceil(students.length / studentsPerPage);
  const totalReportPages = Math.ceil(reports.length / reportsPerPage);

  const displayedStudents = students.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  const displayedReports = reports.slice(
    (currentReportPage - 1) * reportsPerPage,
    currentReportPage * reportsPerPage
  );

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
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
                fullWidth
              />
              <Select
                variant="outlined"
                label="Lĩnh vực"
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                fullWidth
              >
                <MenuItem value="name">Tên</MenuItem>
                <MenuItem value="class">Lớp</MenuItem>
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
            {displayedStudents.map((student) => (
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
                    {student.isBanned ? (
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
            {displayedReports.map((report) => (
              <CustomCard key={report.id}>
                <Typography variant="body1">
                  Người báo cáo: {report.reporterName}
                </Typography>
                <Typography variant="body1">
                  Người bị báo cáo: {report.reportedName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Nội dung báo cáo: {report.content}
                </Typography>
                <Box display="flex" gap={2} mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Visibility />}
                    onClick={() => handleViewPost(report.postId)}
                  >
                    Xem bài viết
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<Delete />}
                    onClick={() => {
                      setSelectedReport(report.id);
                      setOpenDeleteModal(true);
                    }}
                  >
                    Xóa bài viết
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<Block />}
                    onClick={() => handleBanAccount(report.id)}
                  >
                    Ban Account
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
  );
};

export default AdminScreen;
