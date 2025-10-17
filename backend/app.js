const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectToMongoDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/quizApp');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Question Schema
const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String,
});

const Question = mongoose.model('Question', questionSchema);

// API Endpoints
app.get('/api/questions', async (req, res) => {
  try {
    const questions = await Question.find().sort({ _id: 1 });
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

app.post('/api/submit', async (req, res) => {
  try {
    const { answer, currentQuestionId } = req.body;
    if (!answer || !currentQuestionId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const question = await Question.findById(currentQuestionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json({ correct: answer === question.correctAnswer });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ message: 'Error submitting answer' });
  }
});

// Start server
connectToMongoDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});