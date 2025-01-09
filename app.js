export const API_URL = 'worlds.json'; // Path to your worlds.json file

let loggedInUser = null;

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
    //document.getElementById('points_of_interest').innerHTML = world.details.points_of_interest.replace(/\n/g, '<br>');
    //document.getElementById('rifts').innerHTML = world.details.rifts.replace(/\n/g, '<br>');
    //document.getElementById('merge_points').innerHTML = world.details.merge_points.replace(/\n/g, '<br>');

    if (loggedInUser == "ASTRAL") {
        document.getElementById('points_of_interest').innerHTML = world.ASTRAL_details.points_of_interest.replace(/\n/g, '<br>');
        document.getElementById('rifts').innerHTML = world.ASTRAL_details.rifts.replace(/\n/g, '<br>');
        document.getElementById('merge_points').innerHTML = world.ASTRAL_details.merge_points.replace(/\n/g, '<br>');
    }
    if (loggedInUser == "SPIRIT") {
        document.getElementById('points_of_interest').innerHTML = world.SPIRIT_details.points_of_interest.replace(/\n/g, '<br>');
        document.getElementById('rifts').innerHTML = world.SPIRIT_details.rifts.replace(/\n/g, '<br>');
        document.getElementById('merge_points').innerHTML = world.SPIRIT_details.merge_points.replace(/\n/g, '<br>');
    }
    if (loggedInUser == "GM") {
        document.getElementById('points_of_interest').innerHTML = world.GM_details.points_of_interest.replace(/\n/g, '<br>');
        document.getElementById('rifts').innerHTML = world.GM_details.rifts.replace(/\n/g, '<br>');
        document.getElementById('merge_points').innerHTML = world.GM_details.merge_points.replace(/\n/g, '<br>');
        //document.getElementById('points_of_interest').innerHTML = world.SPIRIT_details.points_of_interest.replace(/\n/g, '<br>');
        //document.getElementById('rifts').innerHTML = world.SPIRIT_details.rifts.replace(/\n/g, '<br>');
        //document.getElementById('merge_points').innerHTML = world.SPIRIT_details.merge_points.replace(/\n/g, '<br>');
    }

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
    mapElement.innerHTML = '<img src="Anomaly Picture.png" alt="Multiverse Map" width="100%">';

    if (loggedInUser == 'ASTRAL') {
        const icon = document.createElement('img');
        icon.src = 'ASTRAL Logo.png'; // Path to your overlay image
        icon.alt = 'Faction Icon';
        icon.className = 'faction-icon';
        icon.style.display = 'block'; // Ensure it's visible
        const iconElement = document.getElementById('faction-icon');
        iconElement.appendChild(icon);
    }
    if (loggedInUser == 'SPIRIT') {
        const icon = document.createElement('img');
        icon.src = 'SPIRIT Logo.png'; // Path to your overlay image
        icon.alt = 'Faction Icon';
        icon.className = 'faction-icon';
        icon.style.display = 'block'; // Ensure it's visible
        const iconElement = document.getElementById('faction-icon');
        iconElement.appendChild(icon);
    }
    if (loggedInUser == 'GM') {
        const icon = document.createElement('img');
        icon.src = 'Star Squadron Symbol 500PX.png'; // Path to your overlay image
        icon.style.scale = .6;
        icon.alt = 'Faction Icon';
        icon.className = 'faction-icon';
        icon.style.display = 'block'; // Ensure it's visible
        const iconElement = document.getElementById('faction-icon');
        iconElement.appendChild(icon);

        document.getElementById('open-overlay').addEventListener('click', () => {
            document.getElementById('editor-menu').style.display = 'block';
            fetchWorlds(); // Populate the overlay when opened
        });
        
        document.getElementById('close-overlay').addEventListener('click', () => {
            document.getElementById('editor-menu').style.display = 'none';
        });
    }

    const visibleWorlds = worlds.filter((world) => {
        // If no `viewableBy` field, the world is visible to everyone
        if (!world.viewableBy || world.viewableBy.length === 0) {
            return true;
        }
    
        // Check if `loggedInUser` is in the `viewableBy` array
        return world.viewableBy.includes(loggedInUser);
    });

    visibleWorlds.forEach((world) => {
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
        if (Number(world.control.ASTRAL || 0) === 100) {
            const overlayImage = document.createElement('img');
            overlayImage.src = 'Logos/World Lock.png'; // Path to the overlay image
            overlayImage.alt = 'ASTRAL Control Overlay';
            overlayImage.className = 'lock-overlay';
            overlayImage.style.display = 'block'; // Ensure it's visible
            planet.appendChild(overlayImage);
            console.log("Added ASTRAL lock for: " + world.name);
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
        { username: 'ASTRAL', password: 'epsilon#1' },
        { username: 'SPIRIT', password: 'samisawesome' },
        { username: 'GM', password: '1' }
    ];

    // Handle login
    loginButton.addEventListener('click', () => {
    const enteredUsername = usernameInput.value;
    const enteredPassword = passwordInput.value;

    const user = users.find(
        (user) => user.username === enteredUsername && user.password === enteredPassword
    );

    if (user) {
        loggedInUser = user.username; // Store the logged-in user

        loginScreen.style.display = 'none';
        mainContent.style.display = 'block';
        displayWorlds(); // Load worlds after successful login
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

async function fetchWorlds() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/RebelPilotTyler/multiverse_tracker/main/worlds.json');
        if (response.ok) {
            const data = await response.json();
            populateOverlay(data);
        } else {
            console.error('Failed to fetch worlds:', response.status);
        }
    } catch (error) {
        console.error('Error fetching worlds:', error);
    }
}

function populateOverlay(worlds) {
    const worldFields = document.getElementById('world-fields');
    worldFields.innerHTML = ''; // Clear previous fields

    worlds.forEach((world, index) => {
        const worldDiv = document.createElement('div');
        worldDiv.className = 'world';

        // Create a title for the world
        const worldTitle = document.createElement('h3');
        worldTitle.textContent = world.name;
        worldTitle.style.fontFamily = 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', 'Arial', 'sans-serif';
        worldTitle.style.fontSize = 30;
        worldTitle.style.fontStyle = 'italic';
        worldTitle.style.textDecoration = 'underline';
        worldDiv.appendChild(worldTitle);

        // Generate editable fields for each property
        for (const key in world) {
            if (typeof world[key] === 'object') {
                // Handle nested objects (e.g., control)
                for (const subKey in world[key]) {
                    createEditableField(worldDiv, index, `${key}.${subKey}`, world[key][subKey]);
                }
            } else {
                createEditableField(worldDiv, index, key, world[key]);
            }
        }

        worldFields.appendChild(worldDiv);
    });
}

function createEditableField(container, worldIndex, key, value) {
    const fieldDiv = document.createElement('div');
    fieldDiv.className = 'field';

    // Label
    const label = document.createElement('label');
    label.textContent = key;
    label.htmlFor = `${worldIndex}-${key}`;
    fieldDiv.appendChild(label);

    // Input
    const input = document.createElement('input');
    input.type = 'text';
    input.id = `${worldIndex}-${key}`;
    input.value = value;
    fieldDiv.appendChild(input);

    // Save Button
    const button = document.createElement('button');
    button.textContent = 'Save';
    button.onclick = () => saveField(worldIndex, key, input.value);
    fieldDiv.appendChild(button);

    container.appendChild(fieldDiv);
}

async function saveField(worldIndex, key, newValue) {
    console.log({ worldIndex, key, newValue });
    console.log('Sending payload:', { 
        event_type: 'update-world-field',
        client_payload: {
            worldIndex,
            key,
            newValue,
        }
    });
    try {
        const response = await fetch('/.netlify/functions/triggerWorkflow', {
            method: 'POST',
            body: JSON.stringify({
                event_type: 'update-world-field',
                client_payload: {
                    worldIndex,
                    key,
                    newValue,
                },
            }),
        });

        if (response.ok) {
            alert(`Field ${key} updated successfully!`);
            fetchWorlds();
        } else {
            alert('Error updating field.');
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        alert('Unexpected error occurred.');
    }
}
