require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');  // NEW: OpenAI v4+

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/ai-report', async (req, res) => {
  const userPrompt = req.body.prompt;
  if (!userPrompt) return res.status(400).json({ error: "No prompt provided" });

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {role: "system", content: "You are a friendly sports training assistant. Summarize the user's week based on their completed workouts, sleep scores, readiness scores, and notes, and provide 3-4 actionable tips for improvement. include excersises or drills for the user to do. "},
        {role: "user", content: userPrompt}
      ],
      max_tokens: 350
    });
    res.json({ answer: chat.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI error" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('AI backend running on port', PORT));