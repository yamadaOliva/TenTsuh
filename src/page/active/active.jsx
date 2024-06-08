import NotFound from "../404/notFound";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { activeAccount } from "../../service/auth.service";
import { Container, Typography, Button, Box } from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";

export default function ActivePage() {
  const { token } = useParams();
  const [active, setActive] = useState(false);

  const activeHandler = async () => {
    const res = await activeAccount(token);
    console.log(res);
    if (+res.EC === 200) {
      setActive(true);
    }
  };

  useEffect(() => {
    activeHandler();
  }, []);

  return active ? (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
      <CheckCircleOutline style={{ fontSize: "100px", color: "green" }} />
      <Typography variant="h4" gutterBottom>
        Kích hoạt tài khoản thành công
      </Typography>
      <Button variant="contained" color="primary" href="/login">
        Đăng nhập
      </Button>
    </Container>
  ) : (
    <NotFound />
  );
}
