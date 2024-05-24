import {
  Card,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Box,
  Button,
  Tooltip,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { date } from "../../utils/index";

export default function NotificationUnit({ data }) {
  return (
    <>
      <Card
        sx={{
          minWidth: 225,
          shadow: 2,
          borderBottom: "1px solid #e0e0e0",
          maxWidth: 400,
          position: "relative",
          "&:hover .delete-icon": {
            display: "block",
          },
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Avatar alt="User Avatar" src={data.sourceAvatarUrl} />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              marginLeft: 2,
            }}
          >
            <Typography
              fontSize={14}
              fontWeight={600}
              mr={"auto"}
              component="div"
            >
              {data.content}
            </Typography>
            <Typography fontSize={14}>
              {date.convertDateToTime(data.createdAt)}
            </Typography>
          </Box>
        </CardContent>
        {data.type != "FRIEND" && (
          <CardActions
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button size="small" color="primary">
              Xem
            </Button>
          </CardActions>
        )}
        <Tooltip
          title="Xóa"
          placement="top"
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            borderRight: "1px solid #e0e0e0",
          }}
        >
          <IconButton
            className="delete-icon"
            sx={{
              display: "none",
              position: "absolute",
              top: 16,
              right: 3,
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Card>
    </>
  );
}
