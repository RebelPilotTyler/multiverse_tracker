export const API_URL = 'worlds.json'; // Path to your worlds.json file

export const fetchWorldStatuses = async () => {
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

export const displayWorlds = async () => {
    const worlds = await fetchWorldStatuses();

    const mapElement = document.getElementById('map');
    mapElement.innerHTML = '<img src="Star-Wars.jpeg" alt="Multiverse Map" width="100%">';

    worlds.forEach((world) => {
        const planet = document.createElement('div');
        planet.id = world.id;
        planet.className = 'planet';
        planet.style.top = world.top;
        planet.style.left = world.left;

        const planetImage = document.createElement('img');
        planetImage.src = world.picture;
        planetImage.alt = world.name;
        planetImage.className = 'planet-image';

        planet.appendChild(planetImage);

        // Create the progress bars container
        const progressBars = document.createElement('div');
        progressBars.className = 'progress-bars';

        // Add progress bars for each faction (ASTRAL and SPIRIT)
        const factions = [
            { name: 'ASTRAL', color: 'blue' },
            { name: 'SPIRIT', color: 'purple' },
            { name: 'Gilded_Garden', color: 'gold'},
            { name: 'Marines', color: 'white'},
            { name: 'Flood', color: 'green'},
            { name: 'Super_Earth', color: 'yellow'},
            { name: 'New_Republic', color: 'red'}
        ];

        factions.forEach((faction) => {
            const progressContainer = document.createElement('div');
            progressContainer.className = 'progress-container';

            const progressBar = document.createElement('div');
            progressBar.className = `progress ${faction.name}-bar`;
            progressBar.style.width = `${world.control[faction.name] || 0}%`;
            progressBar.style.backgroundColor = faction.color;

            progressContainer.appendChild(progressBar);
            progressBars.appendChild(progressContainer);
        });
        console.log(progressBars);
        planet.appendChild(progressBars);

        // Show progress bars on hover
        planet.onmouseover = () => {
            console.log('Hover detected for', world.name); // Debugging hover detection
            progressBars.style.display = 'block';
        };
        planet.onmouseout = () => {
            console.log('Hover ended for', world.name); // Debugging hover end
            progressBars.style.display = 'none';
        };

        mapElement.appendChild(planet);
    });
};
