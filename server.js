const express = require('express');
const cors = require('cors'); // Import CORS middleware
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000; // Default to port 3000 if PORT is not set
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Ensure the token is stored securely in environment variables
const REPO_OWNER = 'RebelPilotTyler'; // Replace with your GitHub username
const REPO_NAME = 'multiverse_tracker'; // Replace with your GitHub repository name
const FILE_PATH = 'worlds.json'; // Path to the JSON file in your repository

// Route to fetch world statuses from GitHub
app.get('/fetch-worlds', async (req, res) => {
    try {
        const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
        const response = await fetch(url, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        });

        if (!response.ok) {
            console.error(`GitHub API error: ${response.statusText}`);
            return res.status(response.status).send(`GitHub API error: ${response.statusText}`);
        }

        const data = await response.json();
        const decodedContent = JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8')); // Decode Base64 content
        res.json(decodedContent); // Send the decoded JSON content to the client
    } catch (error) {
        console.error('Error fetching worlds:', error);
        res.status(500).send('Error fetching worlds');
    }
});

// Health check route to verify the server is running
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // Middleware to parse JSON request bodies

app.post('/update-worlds', async (req, res) => {
    try {
        // Get the updated data from the request body
        const { updatedWorlds } = req.body;

        // Validate the updatedWorlds format
        if (!Array.isArray(updatedWorlds)) {
            return res.status(400).send('Invalid data format: Expected an array of worlds');
        }

        // Fetch the current file details to get the SHA
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

        // Encode the updated content to Base64
        const updatedContent = Buffer.from(JSON.stringify(updatedWorlds, null, 2)).toString('base64');

        // Update the file on GitHub
        const updateResponse = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: 'Update worlds.json with new control data',
                    content: updatedContent,
                    sha: fileData.sha, // Required for updating the file
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
