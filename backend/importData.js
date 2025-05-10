// backend/importData.js
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');

// Define the Question schema and model
const questionSchema = new mongoose.Schema({
  question: { type: String, unique: true }, // Ensure the question field is unique
  options: [String],
  correctAnswer: String,
});

const Question = mongoose.model('Question', questionSchema);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/quizApp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    importData();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
  });

// Function to import data from CSV file
const importData = () => {
  const csvFilePath = process.argv[2]; // Get the CSV file path from command-line arguments

  if (!csvFilePath) {
    console.error('Please provide the path to the CSV file as a command-line argument.');
    mongoose.connection.close();
    return;
  }

  const results = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data) => {
      // Parse the options string into an array
      data.options = data.options.split(',');
      results.push(data);
    })
    .on('end', async () => {
      try {
        for (const item of results) {
          const existingQuestion = await Question.findOne({ question: item.question });
          if (!existingQuestion) {
            await Question.create(item);
            console.log(`Inserted: ${item.question}`);
          } else {
            console.log(`Skipped duplicate: ${item.question}`);
          }
        }
        console.log('Data import completed');
        mongoose.connection.close();
      } catch (err) {
        console.error('Error importing data', err);
        mongoose.connection.close();
      }
    })
    .on('error', (err) => {
      console.error('Error reading the CSV file', err);
      mongoose.connection.close();
    });
};
