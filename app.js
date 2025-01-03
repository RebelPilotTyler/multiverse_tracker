export const API_URL = 'worlds.json'; // Path to your worlds.json file

const displayWorldInfo = (world) => {
    const menu = document.getElementById('overlay-menu');
    document.getElementById('world-name').textContent = world.name;

    // Replace \n with <br> for line breaks in description
    document.getElementById('world-description').innerHTML = world.details.description.replace(/\n/g, '<br>');

    // Dynamically create faction control information
    const factions = [
        { name: 'ASTRAL', color: 'blue' },
        { name: 'SPIRIT', color: 'purple' },
        { name: 'Gilded_Garden', color: 'gold' },
        { name: 'Marines', color: 'white' },
        { name: 'Flood', color: 'green' },
        { name: 'Super_Earth', color: 'yellow' },
        { name: 'New_Republic', color: 'red' }
    ];

    const factionContainer = document.createElement('div');
    factions.forEach((faction) => {
        const controlPercentage = world.control[faction.name] || 0;

        if (controlPercentage > 0) {
            const factionInfo = document.createElement('p');
            factionInfo.innerHTML = `<strong style="color:${faction.color};">${faction.name}:</strong> ${controlPercentage}%`;
            factionContainer.appendChild(factionInfo);
        }
    });

    // Clear existing faction control content and append the new container
    const factionSection = document.getElementById('faction-control');
    factionSection.innerHTML = '';
    factionSection.appendChild(factionContainer);

    // Points of Interest, Rifts, and Merge Points
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

        // Add the x overlay if the variable is set
        if (world.x_overlay) {
            const xOverlayImage = document.createElement('img');
            xOverlayImage.src = 'Logos/World X.png'; // Path to your overlay image
            xOverlayImage.alt = 'X Overlay';
            xOverlayImage.className = 'x-overlay';
            xOverlayImage.style.display = 'block'; // Ensure it's visible
            planet.appendChild(xOverlayImage);
        }

        // Add the overlay image if ASTRAL has 100% control
        if ((world.control.ASTRAL || 0) === 100) {
            const overlayImage = document.createElement('img');
            overlayImage.src = 'Logos/World Lock.png'; // Path to the overlay image
            overlayImage.alt = 'ASTRAL Control Overlay';
            overlayImage.className = 'lock-overlay';
            overlayImage.style.display = 'block'; // Ensure it's visible
            planet.appendChild(overlayImage);
        }

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

document.addEventListener('DOMContentLoaded', () => {
    const map = document.getElementById('map');
    const container = document.getElementById('map-container');

    let scale = 1; // Define scale at the correct scope

    const containerRect = container.getBoundingClientRect();
    const mapRect = map.getBoundingClientRect();

    const initialLeft = (containerRect.width - mapRect.width) / 2;
    const initialTop = (containerRect.height - mapRect.height) / 2;

    map.style.left = `${initialLeft}px`;
    map.style.top = `${initialTop}px`;

    // Set the initial transform-origin to the center of the map
    map.style.transformOrigin = '50% 50%';
    map.style.transform = `scale(${scale})`;

    // Initialize zoom and dragging
    initializeZoomAndDrag(map, container, () => scale, (newScale) => { scale = newScale; });
});

function initializeZoomAndDrag(map, container, getScale, setScale) {
    let isDragging = false;
    let startX = 0, startY = 0;

    // Zooming with the mouse wheel
    map.addEventListener('wheel', (e) => {
        e.preventDefault();
    
        // Get the zoom center relative to the map
        const rect = map.getBoundingClientRect();
        const zoomCenterX = e.clientX - rect.left;
        const zoomCenterY = e.clientY - rect.top;
    
        // Update scale
        const zoomSpeed = 0.1;
        let scale = getScale();
        scale += e.deltaY < 0 ? zoomSpeed : -zoomSpeed; // Zoom in or out
        scale = Math.min(Math.max(scale, 0.5), 3); // Clamp zoom level
        setScale(scale);
    
        // Apply transform-origin for smooth zooming
        map.style.transformOrigin = `${(zoomCenterX / rect.width) * 100}% ${(zoomCenterY / rect.height) * 100}%`;
        map.style.transform = `scale(${scale})`;
    
        // Update boundaries
        //updateMapBoundaries(map, container, scale);
    });
    

    map.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        map.style.cursor = 'grabbing'; // Change cursor to grabbing
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
    
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
    
        const currentLeft = parseFloat(map.style.left) || 0;
        const currentTop = parseFloat(map.style.top) || 0;
    
        const newLeft = currentLeft + dx;
        const newTop = currentTop + dy;
    
        map.style.left = `${newLeft}px`;
        map.style.top = `${newTop}px`;
    
        startX = e.clientX;
        startY = e.clientY;
    });    

    document.addEventListener('mouseup', () => {
        isDragging = false; // Stop dragging
        map.style.cursor = 'grab'; // Reset cursor to default grab
    });

    map.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }
    });
    
    map.addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length !== 1) return;
    
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;
    
        const currentLeft = parseFloat(map.style.left) || 0;
        const currentTop = parseFloat(map.style.top) || 0;
    
        const newLeft = currentLeft + dx;
        const newTop = currentTop + dy;
    
        map.style.left = `${newLeft}px`;
        map.style.top = `${newTop}px`;
    
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    map.addEventListener('touchend', () => {
        isDragging = false;
    });    
}

function getMapBounds(map, container, scale) {
    const mapRect = map.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const scaledWidth = mapRect.width * scale;
    const scaledHeight = mapRect.height * scale;

    const minLeft = containerRect.width - scaledWidth;
    const maxLeft = 0;
    const minTop = containerRect.height - scaledHeight;
    const maxTop = 0;

    return { minLeft, maxLeft, minTop, maxTop };
}

function updateMapBoundaries(map, container, scale) {
    const { minLeft, maxLeft, minTop, maxTop } = getMapBounds(map, container, scale);
    const currentLeft = parseFloat(map.style.left) || 0;
    const currentTop = parseFloat(map.style.top) || 0;

    const constrainedLeft = Math.min(Math.max(currentLeft, minLeft), maxLeft);
    const constrainedTop = Math.min(Math.max(currentTop, minTop), maxTop);

    map.style.left = `${constrainedLeft}px`;
    map.style.top = `${constrainedTop}px`;
}

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input');
    const errorMessage = document.getElementById('error-message');
    const loginScreen = document.getElementById('login-screen');
    const mainContent = document.getElementById('main-content');

    // Array of users and passwords
    const users = [
        { username: 'player1', password: 'password1' },
        { username: 'player2', password: 'password2' },
        { username: 'admin', password: 'secureadminpass' }
    ];

    // Handle login
    loginButton.addEventListener('click', () => {
        const enteredUsername = usernameInput.value;
        const enteredPassword = passwordInput.value;

        // Check if the entered credentials match any in the array
        const user = users.find(
            (user) => user.username === enteredUsername && user.password === enteredPassword
        );

        if (user) {
            loginScreen.style.display = 'none';
            mainContent.style.display = 'block';
        } else {
            errorMessage.style.display = 'block';
        }
    });

    // Optionally, handle "Enter" key for username or password input
    [usernameInput, passwordInput].forEach((input) => {
        input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                loginButton.click();
            }
        });
    });
});
