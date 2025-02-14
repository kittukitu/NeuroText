const fetch = require('node-fetch');
require('dotenv').config();

const chatController = async (req, res) => {
    const { topic, tone, audience, length, language } = req.body;

    if (!topic || !tone || !audience || !length || !language) {
        return res.render('index', {
            response: '❌ Please fill in all fields to generate content.',
        });
    }

    const apiKey = process.env.RAPIDAPI_KEY;
    if (!apiKey) {
        return res.render('index', {
            response: '🚨 Server configuration issue. Please try again later.',
        });
    }

    const url = 'https://chatgpt4-ai-chatbot.p.rapidapi.com/ask';
    const query = `Generate a ${length} article on "${topic}" in english. The tone should be ${tone}, and it should be tailored for a ${audience} audience.`;

    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'chatgpt4-ai-chatbot.p.rapidapi.com',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            console.error(`🚨 API Error: ${response.status} - ${response.statusText}`);
            return res.render('index', {
                response: '⚠️ Failed to generate content. Please try again later.',
            });
        }

        const result = await response.json();
        console.log("🔹 API Response:", result);

        const content = result.response || result.result || "⚠️ No response from the AI.";

        res.render('result', { content });

    } catch (error) {
        console.error("❌ Fetch Error:", error);
        res.render('index', {
            response: '🚨 Error processing your request. Please try again later.',
        });
    }
};

module.exports = { chatController };
