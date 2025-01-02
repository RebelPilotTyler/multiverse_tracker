const express = require('express');
const fetch = require('node-fetch');
const app = express();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Store the token securely

app.get('/fetch-worlds', async (req, res) => {
    try {
        const response = await fetch(
            `https://api.github.com/repos/<your_username>/<repo_name>/contents/worlds.json`,
            {
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                },
            }
        );
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching worlds:', error);
        res.status(500).send('Error fetching worlds');
    }
});

app.listen(3000, () => console.log('Proxy server running on port 3000'));
