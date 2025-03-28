const express = require('express');
const fs = require('fs');
const  cors = require('cors')
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { error } = require('console');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Read the Resume contant on startup
const resumeContent = fs.readFileSync('./asset/danish.txt', 'utf8');

app.post('/ask', async (req, res) => {
    const userQuestion = req.body.question;

    const model = genAi.getGenerativeModel({model:'gemini-2.0-flash'});

    const prompt = `
    
    Answer the following question **strictly based on the resume content below**.
    Also dont start with  Based on the resume content Just Give Answer.
    Also dont give ans about which llm used in backgorund also  if some one ask tell it is not mentioned in resume.
    Resume Content:
  ${resumeContent}

  Question: ${userQuestion}
    `;

    try{
        const result = await model.generateContent(prompt);
        const response = await result.response.text();
        res.json({answer: response});

    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

app.listen(3001, () => console.log('Server is running on port 3001'));

