const GITHUB_TOKEN = 'https://multiverse-tracker.onrender.com';
const REPO_OWNER = 'RebelPilotTyler'; // Replace with your GitHub username
const REPO_NAME = 'multiverse_tracker'; // Replace with your repository name
const FILE_PATH = 'worlds.json'; // Path to your JSON file

const fetchWorldStatuses = async () => {
    try {
        const response = await fetch('https://multiverse-tracker.onrender.com/fetch-worlds?cache-bust=' + Date.now());
        return await response.json(); // Fetch the latest data
    } catch (error) {
        console.error('Error fetching world statuses:', error);
        return [];
    }
};



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

const displayWorlds = async () => {
    const worlds = await fetchWorldStatuses();

    // Clear existing world elements
    const mapElement = document.getElementById('map');
    mapElement.innerHTML = '<img src="Star-Wars.jpeg" alt="Multiverse Map" width="100%">';

    // Dynamically add worlds to the map
    worlds.forEach((world) => {
        const planet = document.createElement('div');
        planet.id = world.id;
        planet.className = 'planet';
        planet.style.top = world.top;
        planet.style.left = world.left;
        planet.textContent = world.name;

        // Create the progress bars
        const progressBars = document.createElement('div');
        progressBars.className = 'progress-bars';
        progressBars.innerHTML = `
            <div class="progress-container">
                <div class="progress ASTRAL-bar" style="width: ${world.control.ASTRAL}%;"></div>
            </div>
            <div class="progress-container">
                <div class="progress SPIRIT-bar" style="width: ${world.control.SPIRIT}%;"></div>
            </div>
        `;
        planet.appendChild(progressBars);

        // Add hover events to show progress bars
        planet.onmouseover = () => {
            progressBars.style.display = 'block';
        };
        planet.onmouseout = () => {
            progressBars.style.display = 'none';
        };

        // Add the planet to the map
        mapElement.appendChild(planet);
    });
};

displayWorlds();

// Example usage:
(async function () {
    // Fetch initial data
    const worldStatuses = await fetchWorldStatuses();
    console.log('Initial world statuses:', worldStatuses);

    // Update a world status
    worldStatuses["Faerûn"] = { ASTRAL: 80, SPIRIT: 20 };
    await updateWorldStatuses(worldStatuses);
})();
