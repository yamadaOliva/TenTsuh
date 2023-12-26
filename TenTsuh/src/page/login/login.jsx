import { Avatar, Grid, Paper, TextField } from "@material-ui/core";
import AssignmentIndSharpIcon from "@mui/icons-material/AssignmentIndSharp";
export default function Login() {
  const paperStyle = {
    padding: 20,
    height: "70vh",
    width: 280,
    margin: "20px auto",
  };
  return (
    <>
      <section>
        <Grid>
          <Paper elevation={10} style={paperStyle}>
            <Grid align="center">
              <Avatar>
                <AssignmentIndSharpIcon />
              </Avatar>
              <h2>Sign in</h2>
              <TextField
                label="email"
                placeholder="Vui lòng nhập email"
                type="email"
                fullWidth
                required
              />
              <div className="my-4"></div>
              <TextField
                label="password"
                placeholder="Vui lòng nhập password"
                type="password"
                fullWidth
                required
              />
            </Grid>
          </Paper>
        </Grid>
      </section>
    </>
  );
}
