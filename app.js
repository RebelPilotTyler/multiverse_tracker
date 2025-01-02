import { GITHUB_TOKEN } from './config.js';

const API_URL = 'https://api.github.com/repos/RebelPilotTyler/multiverse_tracker/contents/worlds.json';

// Fetch the current world statuses from the GitHub API
const fetchWorldStatuses = async () => {
    try {
        const response = await fetch(API_URL, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Fetch error: ${response.statusText}`);
        }

        const data = await response.json();
        const worlds = JSON.parse(atob(data.content)); // Decode Base64 content
        console.log('Fetched Worlds:', worlds);
        return worlds;
    } catch (error) {
        console.error('Error fetching world statuses:', error);
        return [];
    }
};

// Dynamically display the worlds on the map
const displayWorlds = async () => {
    const worlds = await fetchWorldStatuses();

    const mapElement = document.getElementById('map');
    mapElement.innerHTML = '<img src="Star-Wars.jpeg" alt="Multiverse Map" width="100%">';

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

        // Show progress bars on hover
        planet.onmouseover = () => {
            progressBars.style.display = 'block';
        };
        planet.onmouseout = () => {
            progressBars.style.display = 'none';
        };

        // Append the planet to the map
        mapElement.appendChild(planet);
    });
};

// Initialize the app
displayWorlds();
