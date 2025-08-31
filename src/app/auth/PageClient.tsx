"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Person2Outlined } from "@mui/icons-material";
import { Button, Paper, Typography } from "@mui/material";

export default function PageClient({
  signInAction,
}: {
  signInAction: (formData: FormData) => void;
}) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        backgroundImage: `url(/bg.jpg)`,
        backgroundPosition: "50% 0",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundColor: `rgba(0,0,0,0.5)`,
        backgroundBlendMode: "overlay"
      }}
    >
        <Typography
            sx={{
              textAlign: "center",
              color: (theme) => theme.vars.palette.common.white,
              position: "absolute",
              top: 30,
              fontWeight: 800
            }}
            variant="h2"
          >
            Email Scheduling Job App
          </Typography>
      <Paper sx={{}} elevation={8}>
        <Box
          sx={{
            backgroundColor: (theme) => theme.vars.palette.primary.main,
            p: 2,
          }}
        >
          <Typography
            sx={{
              textAlign: "center",
              color: (theme) => theme.vars.palette.common.white,
            }}
            variant="h4"
          >
            Sign In
          </Typography>
        </Box>
        <Box sx={{ px: 4, pb: 4}}>
        <form action={signInAction}>
          <FormControl sx={{ m: 1 }} fullWidth variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Email</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={"text"}
              name="email"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton aria-label={"user email"} edge="end">
                    <Person2Outlined />
                  </IconButton>
                </InputAdornment>
              }
              label="Email"
            />
          </FormControl>
          <FormControl sx={{ m: 1 }} fullWidth variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              name="password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword
                        ? "hide the password"
                        : "display the password"
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          <Box sx={{ display: "block", textAlign: "center" }}>
            <Button type="submit" variant="outlined">Sign In</Button>
          </Box>
        </form>
        </Box>
      </Paper>
    </Box>
  );
}
