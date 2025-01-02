const API_URL = 'worlds.json'; // Path to your worlds.json file

// Fetch the current world statuses
const fetchWorldStatuses = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Fetch error: ${response.statusText}`);
        }
        const worlds = await response.json();
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

        // Create the image element for the planet
        const planetImage = document.createElement('img');
        planetImage.src = world.picture;
        planetImage.alt = world.name;
        planetImage.className = 'planet-image';

        // Add the image inside the planet div
        planet.appendChild(planetImage);

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
