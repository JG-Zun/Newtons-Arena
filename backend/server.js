require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch((error) => console.error('MongoDB connection error:', error));

// 1. Define the Database Schema (Blueprint)
const scoreSchema = new mongoose.Schema({
  playerName: String,
  objectsSpawned: Number,
  date: { type: Date, default: Date.now }
});

const Score = mongoose.model('Score', scoreSchema);

// 2. API Route: Save a new score (POST request)
app.post('/api/scores', async (req, res) => {
  try {
    const newScore = new Score({
      playerName: req.body.playerName || 'Anonymous',
      objectsSpawned: req.body.objectsSpawned
    });
    await newScore.save();
    res.status(201).json({ message: 'Score saved successfully!', score: newScore });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save score' });
  }
});

// 3. API Route: Get top 5 scores (GET request)
app.get('/api/scores', async (req, res) => {
  try {
    const topScores = await Score.find().sort({ objectsSpawned: -1 }).limit(5);
    res.json(topScores);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
});

// Test route
app.get('/', (req, res) => {
  res.send("Newton's Arena API is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});