// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with updated options
const connectToMongoDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/quizApp');
    console.log('Connected to MongoDB');

    // Seed data if needed
    await seedDatabase();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
  }
};

// Question Schema
const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String,
});

const Question = mongoose.model('Question', questionSchema);

// Seed Data (for testing purposes)
const seedDatabase = async () => {
  try {
    const count = await Question.countDocuments();
    if (count === 0) {
      const sampleQuestions = [
        {
          question: "How much is 2 + 1 ?",
          options: ["1", "2", "3", "4"],
          correctAnswer: "3",
        }
      ];
      await Question.insertMany(sampleQuestions);
      console.log('Seed data inserted');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// API Endpoints

// Get all questions (for carousel)
app.get('/api/questions', async (req, res) => {
  try {
    const questions = await Question.find().sort({ _id: 1 });
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

// Get a single random question (for backward compatibility)
app.get('/api/question', async (req, res) => {
  try {
    const question = await Question.findOne();
    if (!question) {
      return res.status(404).json({ message: 'No questions found' });
    }
    res.json(question);
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ message: 'Error fetching question' });
  }
});

// Submit an answer
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

// Get next question (for backward compatibility)
app.get('/api/next-question', async (req, res) => {
  try {
    const { currentQuestionId } = req.query;
    if (!currentQuestionId) {
      return res.status(400).json({ message: 'Missing currentQuestionId' });
    }

    const nextQuestion = await Question.findOne({ _id: { $gt: currentQuestionId } }).sort({ _id: 1 });
    if (!nextQuestion) {
      return res.status(404).json({ message: 'No more questions' });
    }

    res.json(nextQuestion);
  } catch (error) {
    console.error('Error fetching next question:', error);
    res.status(500).json({ message: 'Error fetching next question' });
  }
});

// Start server after connecting to MongoDB
connectToMongoDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
