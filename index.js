const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const dataFile = path.join(__dirname, "data", "workoutData.json");

// Create file if not exists
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify({}, null, 2));

// GET all workouts
app.get("/getWorkouts", (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataFile));
  res.json(data);
});

// POST save/update workout
app.post("/postWorkout", (req, res) => {
  const { date, type, weight, reps } = req.body;
  if (!date || !type || !weight || !reps) return res.status(400).json({ message: "Missing fields" });

  const data = JSON.parse(fs.readFileSync(dataFile));
  data[date] = { type, weight, reps };
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

  res.json({ message: "Workout saved successfully", data });
});

app.listen(6500, () => console.log("Server running on http://localhost:6500"));
