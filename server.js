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
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            messages: [
                { role: 'system', content: 'You are a helpful assistant. The distances in the data set are in miles.' },
                { role: 'user', content: prompt }
            ],    
            model: 'gpt-4',
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.ABC}`
            }
        });

        console.log(runningData)
        
        const answer = response.data.choices[0].message.content;
        console.log(`Answer: ${answer}`);
        res.json({ answer: answer });
    } catch (error) {
        console.error(error);
        console.error(error.response);
        console.error(error.response.data);
        res.status(500).json({ error: 'Error processing the question' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});