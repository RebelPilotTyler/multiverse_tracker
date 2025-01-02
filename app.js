const API_URL = 'https://multiverse-tracker.onrender.com'; // Replace with your backend URL

// Fetch the current world statuses from the backend
const fetchWorldStatuses = async () => {
    try {
        const response = await fetch(`${API_URL}/fetch-worlds?cache-bust=${Date.now()}`);
        if (!response.ok) {
            throw new Error(`Fetch error: ${response.statusText}`);
        }
        const worlds = await response.json();
        console.log('Fetched Worlds:', worlds); // Debugging line
        return worlds;
    } catch (error) {
        console.error('Error fetching world statuses:', error);
        return [];
    }
};

// Update the world statuses via the backend
const updateWorldStatuses = async (updatedWorlds) => {
    try {
        const response = await fetch(`${API_URL}/update-worlds`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ updatedWorlds }),
        });

        if (!response.ok) {
            throw new Error(`Update error: ${response.statusText}`);
        }

        console.log('Worlds updated successfully');
    } catch (error) {
        console.error('Error updating world statuses:', error);
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

        planet.onmouseover = () => {
            progressBars.style.display = 'block';
        };
        planet.onmouseout = () => {
            progressBars.style.display = 'none';
        };

        mapElement.appendChild(planet);
    });
};

// Initialize the app
displayWorlds();
