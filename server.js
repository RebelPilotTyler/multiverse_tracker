const express = require('express');
const fetch = require('node-fetch');
const app = express();

const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Secure GitHub token in environment variables
const REPO_OWNER = 'RebelPilotTyler'; // GitHub username
const REPO_NAME = 'multiverse_tracker'; // Repository name
const FILE_PATH = 'worlds.json'; // Path to the file in the repository

app.use(express.json()); // Middleware to parse JSON request bodies

app.get('/', (req, res) => {
    res.send('Server is running! Use /fetch-worlds or /update-worlds to interact.');
});

// Route to fetch worlds.json
app.get('/fetch-worlds', async (req, res) => {
    try {
        const response = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
            {
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                },
            }
        );

        if (!response.ok) {
            console.error(`GitHub API error: ${response.statusText}`);
            return res.status(response.status).send('GitHub API error');
        }

        const data = await response.json();
        const decodedContent = JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8'));
        res.json(decodedContent);
    } catch (error) {
        console.error('Error fetching worlds:', error);
        res.status(500).send('Error fetching worlds');
    }
});

// Route to update worlds.json
app.post('/update-worlds', async (req, res) => {
    try {
        const { updatedWorlds } = req.body; // Get updated data from request body

        const getFileResponse = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
            {
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                },
            }
        );

        if (!getFileResponse.ok) {
            console.error(`Error fetching file details: ${getFileResponse.statusText}`);
            return res.status(getFileResponse.status).send('Failed to fetch file details');
        }

        const fileData = await getFileResponse.json();
        const updatedContent = Buffer.from(JSON.stringify(updatedWorlds, null, 2)).toString('base64');

        const updateResponse = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: 'Update worlds.json',
                    content: updatedContent,
                    sha: fileData.sha,
                }),
            }
        );

        if (!updateResponse.ok) {
            console.error(`Error updating file: ${updateResponse.statusText}`);
            return res.status(updateResponse.status).send('Failed to update file');
        }

        res.send('Worlds updated successfully');
    } catch (error) {
        console.error('Error updating worlds:', error);
        res.status(500).send('Error updating worlds');
    }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
