const express = require('express');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
dotenv.config();
const app = express();
const port = process.env.PORT;
const openai = new OpenAI({
    key: process.env.OPENAI_API_KEY
})

app.get('/reportgpt', (req, res) => {
    const inputData = req.query.data;

    if (!inputData) {
        return res.status(400).send({ message: 'Data is required' });
    }

    // Ensure inputData is a string
    const dataString = inputData.toString();

    // Include the input data in the report
    const prompt = generateReportPrompt(dataString);

    console.log('Prompt with Data', prompt);
    getCompletion(prompt, res);
});

async function getCompletion(prompt, res) {
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: prompt }],
        });

        console.log(completion);
        res.send({ result: completion.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
}

// Function to generate a report prompt with the included data
function generateReportPrompt(dataString) {
    return `Generate a detailed report based on the following data:

${dataString}

1. Overview:
   - Worker Name: Replace with worker's name from data
   - Project: Replace with project name from data
   - Team: Replace with team name from data

2. Recorded Activities:
   - Include recorded activities from data

3. Recommendations:
   - Analyze the recorded activities to provide recommendations based on the worker's performance and contribution to the project.

4. Analysis:
   - Analyze the data for insights and patterns related to the worker's activities.

Please use the provided data to fill in the appropriate details in the report.
`;
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
