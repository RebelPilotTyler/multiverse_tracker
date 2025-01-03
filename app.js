export const API_URL = 'worlds.json'; // Path to your worlds.json file

const displayWorldInfo = (world) => {
    const menu = document.getElementById('overlay-menu');
    document.getElementById('world-name').textContent = world.name;
    document.getElementById('world-description').textContent = world.details.description;
    document.getElementById('ASTRAL').textContent = world.control.ASTRAL;
    document.getElementById('SPIRIT').textContent = world.control.SPIRIT;
    document.getElementById('Gilded_Garden').textContent = world.control.Gilded_Garden;
    document.getElementById('Marines').textContent = world.control.Marines;
    document.getElementById('Flood').textContent = world.control.Flood;
    document.getElementById('Super_Earth').textContent = world.control.Super_Earth;
    document.getElementById('New_Republic').textContent = world.control.New_Republic;
    document.getElementById('points_of_interest').textContent = world.details.points_of_interest;
    document.getElementById('rifts').textContent = world.details.rifts;
    document.getElementById('merge_points').textContent = world.details.merge_points;

    // Replace \n with <br> for line breaks in description and factions
    document.getElementById('world-description').innerHTML = world.details.description.replace(/\n/g, '<br>');
    document.getElementById('points_of_interest').innerHTML = world.details.points_of_interest.replace(/\n/g, '<br>');
    document.getElementById('rifts').innerHTML = world.details.rifts.replace(/\n/g, '<br>');
    document.getElementById('merge_points').innerHTML = world.details.merge_points.replace(/\n/g, '<br>');

    menu.classList.remove('hidden');
    menu.classList.add('visible');
};

const closeMenu = () => {
    const menu = document.getElementById('overlay-menu');
    menu.classList.remove('visible');
    menu.classList.add('hidden');
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('close-menu').addEventListener('click', closeMenu);
});

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
        console.log(`Processing world: ${world.name}`);
        
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

        planet.addEventListener('click', () => {
            displayWorldInfo(world);
        });
        
        // Create the progress bars container
        const progressBars = document.createElement('div');
        progressBars.className = 'progress-bars';

        // Add progress bars for each faction if the percentage is greater than 0
        const factions = [
            { name: 'ASTRAL', color: 'blue' },
            { name: 'SPIRIT', color: 'purple' },
            { name: 'Gilded_Garden', color: 'gold' },
            { name: 'Marines', color: 'white' },
            { name: 'Flood', color: 'green' },
            { name: 'Super_Earth', color: 'yellow' },
            { name: 'New_Republic', color: 'red' }
        ];

        let hasVisibleBars = false;

        factions.forEach((faction) => {
            const percentage = world.control[faction.name] || 0;
            console.log(`Faction: ${faction.name}, Percentage: ${percentage}%`);

            if (percentage > 0) {
                const progressContainer = document.createElement('div');
                progressContainer.className = 'progress-container';

                const progressBar = document.createElement('div');
                progressBar.className = `progress ${faction.name}-bar`;
                progressBar.style.width = `${percentage}%`;
                progressBar.style.backgroundColor = faction.color;

                progressContainer.appendChild(progressBar);
                progressBars.appendChild(progressContainer);

                console.log(`Added progress bar for faction: ${faction.name} with width: ${percentage}%`);
                hasVisibleBars = true;
            }
        });

        // Append progressBars only if there are visible bars
        if (hasVisibleBars) {
            console.log(`Appending progressBars for world: ${world.name}`);
            planet.appendChild(progressBars);
        
            // Log the final structure of the progressBars container
            console.log('Progress Bars Container:', progressBars.innerHTML);
        
            planet.onmouseover = () => {
                console.log(`Hover detected for world: ${world.name}`);
                progressBars.style.display = 'block';
            };
            planet.onmouseout = () => {
                console.log(`Hover ended for world: ${world.name}`);
                progressBars.style.display = 'none';
            };
        } else {
            console.log(`No visible progress bars for world: ${world.name}`);
        }
        

        mapElement.appendChild(planet);
    });
};
