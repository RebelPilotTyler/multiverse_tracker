const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Render provides this securely
const REPO_OWNER = 'RebelPilotTyler'; // Replace with your GitHub username
const REPO_NAME = 'multiverse_tracker'; // Replace with your repository name
const FILE_PATH = 'worlds.json'; // Path to your JSON file

async function fetchWorldStatuses() {
    try {
        const response = await fetch('https://multiverse-tracker.onrender.com/fetch-worlds');
        return await response.json();
    } catch (error) {
        console.error('Error fetching world statuses:', error);
        return {};
    }
}



async function updateWorldStatuses(updatedStatuses) {
    try {
        // Fetch the current file details (required to get the SHA)
        const getFileResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`
            }
        });
        const fileData = await getFileResponse.json();

        // Prepare the updated content
        const updatedContent = btoa(JSON.stringify(updatedStatuses, null, 2)); // Convert JSON to Base64

        // Update the file
        const updateResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            method: 'PUT',
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Update world statuses',
                content: updatedContent,
                sha: fileData.sha // Required to update the file
            })
        });

        if (!updateResponse.ok) {
            throw new Error('Failed to update world statuses');
        }

        console.log('World statuses updated successfully.');
    } catch (error) {
        console.error('Error updating world statuses:', error);
    }
}

async function saveWorldStatuses(updatedWorlds) {
    try {
        const response = await fetch('https://multiverse-tracker.onrender.com/update-worlds', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ updatedWorlds }),
        });

        if (!response.ok) {
            throw new Error('Failed to save world statuses');
        }

        console.log('Worlds updated successfully');
    } catch (error) {
        console.error('Error saving world statuses:', error);
    }
}


// Example usage:
(async function () {
    // Fetch initial data
    const worldStatuses = await fetchWorldStatuses();
    console.log('Initial world statuses:', worldStatuses);

    // Update a world status
    worldStatuses["Faerûn"] = { ASTRAL: 80, SPIRIT: 20 };
    await updateWorldStatuses(worldStatuses);
})();
