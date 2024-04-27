import React, { useState } from "react";
import Header from "../Header/Header";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputAdornment from "@mui/material/InputAdornment";
import { DateRange } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";

const Main = () => {
  const [file, setFile] = useState(null);
  const [date, setDate] = useState("");
  const [target, setTarget] = useState("");
  const [cycleType, setCycleType] = useState("");
  const [period, setPeriod] = useState("");
  const [photo1, setPhoto1] = useState("");
  const [insight1, setInsight1] = useState("");
  const [photo2, setPhoto2] = useState("");
  const [insight2, setInsight2] = useState("");
  const [predicted, setPredicted] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(file);
    const formData = new FormData();
    formData.append("csv_file", file);
    formData.append("date_col_name", date);
    formData.append("target_col_name", target);
    formData.append("cycle_type", cycleType);
    formData.append("period", period);
    fetch("http://localhost:8000/exchange-prediction/predict/", {
      method: "POST",
      body: formData,
    })
      .then(handleResponse)
      .catch((error) => console.error("Error:", error));
    setPredicted(true);
  };

  function handleResponse(response) {
    if (response.ok) {
      return response.json().then((data) => {
        if (true) {
          console.log(data);
          const keys = Object.keys(data);
          setPhoto1(data[keys[0]][0]["photo_url"]);
          setInsight1(data[keys[0]][0]["insights"]);
          setPhoto2(data[keys[0]][1]["photo_url"]);
          setInsight2(data[keys[0]][1]["insights"]);
        } else {
          console.error("Base64 encoded images not found in the response");
        }
      });
    } else {
      console.error("Failed to fetch images:", response.status);
    }
  }

  return (
    <div
      style={{
        background: "linear-gradient(to bottom, black, purple)",
        minHeight: "100vh",
        textAlign: "center",
      }}
    >
      <div
        style={{
          zIndex: "0",
          position: "absolute",
          top: "60%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <img
          src="/imgs/Group.png"
          alt="Your Image"
          style={{ width: "1000px", height: "100%" }}
        />
      </div>
      <div style={{ position: "absolute", bottom: 0, right: 0 }}>
        <img
          src="/imgs/robot.png"
          alt="Your Image"
          style={{ width: "300px", minHeight: "300px" }}
        />
      </div>
      <Header />
      <Box
        sx={{
          zIndex: 1,
          position: "absolute",
          top: "15%",
          left: "0",
          borderRadius: "20px",
          mt: 5,
          ml: 20,
          height: "450px",
          overflowY: "auto", // Enable vertical scroll
          width: "950px",
          backgroundColor: "rgba(255, 255, 255, 0.25)", // Transparent background color
          "& .MuiInputBase-input": {
            color: "white", // Text color
          },
          "& .MuiInputBase-root": {
            borderRadius: "20px", // Border radius
            backgroundColor: "rgba(255, 255, 255, 0.5)",
          },
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} p={1} mt={5}>
            {/* First Row */}
            <Grid item xs={6} textAlign="left" color="white">
              <Typography variant="h6">Upload CSV File:</Typography>
            </Grid>
            <Grid item xs={6} textAlign="left" color="white">
              <Typography variant="h6">Column name for Date:</Typography>
            </Grid>
            <Grid item xs={6} p={1}>
              <TextField
                required
                color="secondary"
                type="file"
                fullWidth
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setFile(e.target.files[0])} // Corrected onChange handler
              />
            </Grid>

            <Grid item xs={6} p={1}>
              <TextField
                required
                color="secondary"
                placeholder="Column Name"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={4} textAlign="left" color="white">
              <Typography variant="body1">Prediction for Price:</Typography>
            </Grid>
            <Grid item xs={4} textAlign="left" color="white">
              <Typography variant="body1">Cycle Type:</Typography>
            </Grid>
            <Grid item xs={4} textAlign="left" color="white">
              <Typography variant="body1">Period:</Typography>
            </Grid>
            <Grid item xs={4} p={1}>
              <TextField
                required
                color="secondary"
                placeholder="Prediction for Price"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </Grid>
            <Grid item xs={4} p={1}>
              <FormControl fullWidth>
                <Select
                  required
                  color="secondary"
                  value={cycleType}
                  onChange={(e) => setCycleType(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="D">Day</MenuItem>
                  <MenuItem value="Y">Year</MenuItem>
                  <MenuItem value="Q">Quarter</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* Second Row */}
            <Grid item xs={4} p={1}>
              <TextField
                required
                color="secondary"
                placeholder="Period"
                type="number"
                InputLabelProps={{ shrink: true }}
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                sx={{ borderRadius: "20px", pl: 4, pr: 4, width: "100px" }}
              >
                Predict
              </Button>
            </Grid>
            {/* Third Row */}
          </Grid>
        </form>
        {predicted && (
          <Grid container spacing={2} p={2} mt={5}>
            <Grid item xs={6}>
              <img
                src={photo1}
                alt="First Image"
                style={{ width: "100%", height: "auto" }}
              />
            </Grid>

            <Grid item xs={6}>
              <img
                src={photo2}
                alt="Second Image"
                style={{ width: "100%", height: "auto" }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  backgroundColor: "white",
                  textAlign: "left",
                  borderRadius: "20px",
                }}
              >
                <Typography variant="h5" p={1}>
                  Chart One Insights:
                </Typography>
                <Typography variant="body1" p={2}>
                  {insight1} {/* Use state variable for the first insight */}
                </Typography>
                <Typography variant="h5" p={1}>
                  Chart Two Insights:
                </Typography>
                <Typography variant="body1" p={2}>
                  {insight2} {/* Use state variable for the second insight */}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
    </div>
  );
};

export default Main;
