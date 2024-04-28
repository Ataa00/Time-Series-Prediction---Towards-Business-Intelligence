import React from "react";
import Header from "../Header/Header";
import { Box, Button, Grid, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div
      style={{
        background: "linear-gradient(to bottom, black,  purple)",
        minHeight: "100vh",
      }}
    >
      <Header />
      <Grid container maxWidth="xl" sx={{ ml: 3 }}>
        <Grid xs={7}>
          <Box sx={{ textAlign: "left" }}>
            <Typography
              variant="h3"
              sx={{ ml: 5, mb: 3, mt: 15, color: "white" }}
            >
              Business Forecast
            </Typography>
            <Typography variant="h3" sx={{ ml: 5, color: "white" }}>
              <span style={{ color: "purple" }}>AI Financial</span> Make
              Financial <br /> Data a Story Worth Telling.
            </Typography>
            <Link to="/main" style={{ textDecoration: "none" }}>
              <Button
                sx={{
                  ml: 5,
                  mt: 3,
                  border: "2px solid #6B009D",
                  borderRadius: "20px",
                  color: "white",
                }}
                startIcon={<PlayArrowIcon />}
              >
                Get Started
              </Button>
            </Link>
          </Box>
        </Grid>
        <Grid xs={5}>
          <img
            style={{
              height: "500px",
              width: "350px",
              marginTop: "20px",
              borderRadius: "20px",
            }}
            src="/imgs/background1.png"
          ></img>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
