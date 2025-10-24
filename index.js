const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

// Ensure folder and file exist
const dataDir = path.join(__dirname, "data");
const dataFile = path.join(dataDir, "workoutData.json");

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify({}, null, 2));

// GET all workouts
app.get("/getWorkouts", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFile));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error reading data" });
  }
});

// POST save/update workout
app.post("/postWorkout", (req, res) => {
  // Optional: trim keys to avoid "reps " issues
  const clean = Object.fromEntries(
    Object.entries(req.body).map(([k, v]) => [k.trim(), v])
  );
  const { date, type, weight, reps } = clean;

  if (!date || !type || !weight || !reps)
    return res.status(400).json({ message: "Missing fields" });

  try {
    const data = JSON.parse(fs.readFileSync(dataFile));
    data[date] = { type, weight, reps };
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    res.json({ message: "Workout saved successfully", data });
  } catch (err) {
    res.status(500).json({ message: "Error saving data" });
  }
});

app.listen(6500, () => console.log("Server running on http://localhost:6500"));
