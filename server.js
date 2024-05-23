// server.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/ask-question', async (req, res) => {
    const { question, runningData } = req.body;

    // Format the prompt for OpenAI API
    const prompt = `Question: ${question}\nRunning Data: ${JSON.stringify(runningData)}\nAnswer:`;

    try {
        const response = await axios.post('https://api.openai.com/v1/completions', {
            model: 'gpt-3.5-turbo-instruct',
            prompt: prompt,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.ABC}`
            }
        });

        const answer = response.data.choices[0].text.trim();
        console.log(`Answer: ${answer}`);
        res.json({ answer: answer });
    } catch (error) {
        console.error(error.response.data);
        res.status(500).json({ error: 'Error processing the question' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});