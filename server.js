// server.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/ask-question', async (req, res) => {
    const { question, runningData } = req.body;

    // Format the prompt for OpenAI API
    const prompt = `Question: ${question}\nRunning Data: ${JSON.stringify(runningData)}\nAnswer:`;

    try {
        const response = await axios.post('https://api.openai.com/v1/completions', {
            model: 'text-davinci-003',
            prompt: prompt,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.ABC}`
            }
        });

        res.json({ answer: response.data.choices[0].text.trim() });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing the question');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});