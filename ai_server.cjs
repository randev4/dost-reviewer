require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4001;

app.use(cors());
app.use(express.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

app.post('/api/generate-explanation', async (req, res) => {
    try {
        const { question, choices, correctAnswer } = req.body;

        if (!question || !correctAnswer) {
            return res.status(400).json({ error: 'Missing question or answer data' });
        }

        const promptText = `You are an expert tutor. Given the following multiple-choice question and its correct answer, write a very short, one to two sentence explanation justifying why that specific answer is correct. 
Return ONLY the explanation text, formatted in basic Markdown/LaTeX if math is involved. Do not include introductory phrases like "The correct answer is", just provide the raw justification.

Question: ${question}
Choices: ${JSON.stringify(choices)}
Correct Answer Key: ${correctAnswer}
        `;

        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'http://localhost:5173',
                'X-Title': 'DOST Reviewer QA',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "google/gemini-2.5-flash",
                messages: [{ role: "user", content: promptText }],
                temperature: 0.2
            })
        });

        const data = await response.json();

        if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));

        if (data.choices && data.choices.length > 0) {
            const explanation = data.choices[0].message.content.trim();
            res.json({ explanation });
        } else {
            throw new Error('No completion returned from OpenRouter');
        }

    } catch (error) {
        console.error('AI Explanation Error:', error.message);
        res.status(500).json({ error: error.message || 'Failed to generate explanation' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ AI Explanation Server running on http://0.0.0.0:${PORT}`);
});
