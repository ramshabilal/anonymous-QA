import './config.mjs';
import cors from 'cors';
import express from 'express';
import Question from './db.mjs';
import url from 'url';
import path from 'path';

// Set up paths and directories
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// Create an Express application
const app = express();

app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Enable JSON parsing middleware
app.use(express.json());

// Route for creating a new question
app.post('/questions/', async (req, res) => {
  console.log(req.body); 
  try {
    // Create a new question in the database
    const newQuestion = await Question.create({
      question: req.body.question,
      answers: [],
    });

    // Send back the newly created question as a JSON response
    res.json(newQuestion);
  } catch (error) {
    // Handle errors and send an appropriate response
    res.status(500).json({ error: 'Failed to create a new question' });
  }
});

// Route for adding an answer to a question
app.post('/questions/:id/answers/', async (req, res) => {
  
  const update = { "$push": { answers: req.body.answer } };
  try {
    // Update the question with the provided answer
    const result = await Question.findByIdAndUpdate(req.params.id, update, { "new": true });
    console.log("Question updated", result);
    res.json({ success: 'Added an answer' });
  } catch (e) {
    // Handle errors and send an appropriate response
    res.status(500).json({ error: 'Failed to add answer' });
  }
});

// Route for getting all questions
app.get('/questions/', async (req, res) => {
  try {
    // Retrieve all questions from the database
    const questions = await Question.find({});
    res.json(questions);
  } catch (error) {
    // Handle errors and send an appropriate response
    res.status(500).json({ error: 'Internal Server Error: Failed to get questions' });
  }
});

// Set up the server to listen on the specified port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
